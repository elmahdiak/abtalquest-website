import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  usageLimit: number | null;
  timesUsed: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCouponInput {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  usageLimit?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
}

export type CouponErrorCode = 
  | 'NOT_FOUND' 
  | 'INACTIVE' 
  | 'EXPIRED' 
  | 'LIMIT_REACHED' 
  | 'MIN_ORDER_NOT_MET';

export interface ValidateCouponResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  newTotal: number;
  errorMessage?: string;
  errorCode?: CouponErrorCode;
}

const LOCAL_STORAGE_KEY = 'abtalquest_coupons_cache';

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coupon_welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    usageLimit: 500,
    timesUsed: 0,
    expiresAt: null,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'coupon_ramadan2026',
    code: 'RAMADAN2026',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 200,
    usageLimit: 200,
    timesUsed: 0,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true,
    createdAt: '2026-03-01T00:00:00Z',
  },
];

/**
 * Load coupons from localStorage mirror
 */
export const getStoredCoupons = (): Coupon[] => {
  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
  } catch {
    return DEFAULT_COUPONS;
  }
};

/**
 * Save coupons to localStorage mirror
 */
export const saveStoredCoupons = (coupons: Coupon[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new CustomEvent('abtalquest_coupons_updated'));
  } catch (err) {
    console.warn('[Coupons] Failed to save to localStorage:', err);
  }
};

/**
 * Calculate the exact discount amount
 */
export const calculateDiscount = (coupon: Coupon, subtotal: number): number => {
  if (subtotal <= 0) return 0;
  if (coupon.discountType === 'percentage') {
    const calculated = (subtotal * coupon.discountValue) / 100;
    return Math.min(subtotal, Math.round(calculated * 100) / 100);
  } else {
    return Math.min(subtotal, Math.round(coupon.discountValue * 100) / 100);
  }
};

/**
 * Fetch all coupons (Supabase first, fallback to localStorage)
 */
export const fetchCoupons = async (): Promise<Coupon[]> => {
  if (!isSupabaseConfigured()) {
    return getStoredCoupons();
  }

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Coupons] Supabase query failed or table not yet created, using local cache:', error.message);
      return getStoredCoupons();
    }

    if (data && data.length > 0) {
      const mapped: Coupon[] = data.map((item: any) => ({
        id: String(item.id),
        code: String(item.code || '').toUpperCase().trim(),
        discountType: item.discount_type === 'fixed' ? 'fixed' : 'percentage',
        discountValue: Number(item.discount_value) || 0,
        minOrderAmount: Number(item.min_order_amount) || 0,
        usageLimit: item.usage_limit !== null && item.usage_limit !== undefined ? Number(item.usage_limit) : null,
        timesUsed: Number(item.times_used) || 0,
        expiresAt: item.expires_at || null,
        isActive: item.is_active !== false,
        createdAt: item.created_at || new Date().toISOString(),
      }));

      saveStoredCoupons(mapped);
      return mapped;
    }

    // If remote table is empty, seed defaults
    const local = getStoredCoupons();
    return local;
  } catch (err) {
    console.warn('[Coupons] Exception fetching coupons:', err);
    return getStoredCoupons();
  }
};

/**
 * Validate a promo code against active coupons and cart subtotal
 */
export const validateCoupon = async (
  code: string, 
  cartSubtotal: number
): Promise<ValidateCouponResult> => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return {
      isValid: false,
      discountAmount: 0,
      newTotal: cartSubtotal,
      errorMessage: 'Veuillez saisir un code promo.',
      errorCode: 'NOT_FOUND',
    };
  }

  // 1. Try remote lookup first if available
  let matchedCoupon: Coupon | undefined;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', cleanCode)
        .maybeSingle();

      if (!error && data) {
        matchedCoupon = {
          id: String(data.id),
          code: String(data.code).toUpperCase(),
          discountType: data.discount_type === 'fixed' ? 'fixed' : 'percentage',
          discountValue: Number(data.discount_value) || 0,
          minOrderAmount: Number(data.min_order_amount) || 0,
          usageLimit: data.usage_limit !== null && data.usage_limit !== undefined ? Number(data.usage_limit) : null,
          timesUsed: Number(data.times_used) || 0,
          expiresAt: data.expires_at || null,
          isActive: data.is_active !== false,
          createdAt: data.created_at || new Date().toISOString(),
        };
      }
    } catch {
      // ignore, fallback to cached
    }
  }

  // 2. Fallback to cached/local coupons if remote not found
  if (!matchedCoupon) {
    const cached = getStoredCoupons();
    matchedCoupon = cached.find((c) => c.code.toUpperCase() === cleanCode);
  }

  if (!matchedCoupon) {
    return {
      isValid: false,
      discountAmount: 0,
      newTotal: cartSubtotal,
      errorMessage: `Le code promo "${cleanCode}" est invalide ou inexistant.`,
      errorCode: 'NOT_FOUND',
    };
  }

  // 3. Check active status
  if (!matchedCoupon.isActive) {
    return {
      isValid: false,
      discountAmount: 0,
      newTotal: cartSubtotal,
      errorMessage: `Le code promo "${cleanCode}" est actuellement désactivé.`,
      errorCode: 'INACTIVE',
    };
  }

  // 4. Check expiration date
  if (matchedCoupon.expiresAt) {
    const expiryDate = new Date(matchedCoupon.expiresAt);
    if (!isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
      return {
        isValid: false,
        discountAmount: 0,
        newTotal: cartSubtotal,
        errorMessage: `Le code promo "${cleanCode}" a expiré le ${expiryDate.toLocaleDateString('fr-FR')}.`,
        errorCode: 'EXPIRED',
      };
    }
  }

  // 5. Check usage limit
  if (matchedCoupon.usageLimit !== null && matchedCoupon.timesUsed >= matchedCoupon.usageLimit) {
    return {
      isValid: false,
      discountAmount: 0,
      newTotal: cartSubtotal,
      errorMessage: `Le code promo "${cleanCode}" a atteint sa limite d'utilisation maximale.`,
      errorCode: 'LIMIT_REACHED',
    };
  }

  // 6. Check minimum order requirement
  if (matchedCoupon.minOrderAmount > 0 && cartSubtotal < matchedCoupon.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      newTotal: cartSubtotal,
      errorMessage: `Le montant minimum du panier pour ce code est de ${matchedCoupon.minOrderAmount} DH.`,
      errorCode: 'MIN_ORDER_NOT_MET',
    };
  }

  // 7. Calculate discount
  const discountAmount = calculateDiscount(matchedCoupon, cartSubtotal);
  const newTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

  return {
    isValid: true,
    coupon: matchedCoupon,
    discountAmount,
    newTotal,
  };
};

/**
 * Increment coupon usage count after order placement
 */
export const incrementCouponUsage = async (code: string): Promise<void> => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return;

  // Local storage update
  const cached = getStoredCoupons();
  const updated = cached.map((c) => {
    if (c.code.toUpperCase() === cleanCode) {
      return { ...c, timesUsed: c.timesUsed + 1 };
    }
    return c;
  });
  saveStoredCoupons(updated);

  // Supabase remote update
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from('coupons')
        .select('id, times_used')
        .eq('code', cleanCode)
        .maybeSingle();

      if (data) {
        await supabase
          .from('coupons')
          .update({ times_used: (data.times_used || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (err) {
      console.warn('[Coupons] Failed to increment remote usage:', err);
    }
  }
};

/**
 * Create a new coupon
 */
export const createCoupon = async (
  input: CreateCouponInput
): Promise<{ success: boolean; coupon?: Coupon; error?: string }> => {
  const cleanCode = input.code.trim().toUpperCase();
  if (!cleanCode) {
    return { success: false, error: 'Le code promo est requis.' };
  }
  if (!input.discountValue || input.discountValue <= 0) {
    return { success: false, error: 'La valeur de la réduction doit être supérieure à 0.' };
  }
  if (input.discountType === 'percentage' && input.discountValue > 100) {
    return { success: false, error: 'Un pourcentage de réduction ne peut pas dépasser 100%.' };
  }

  const existing = getStoredCoupons();
  if (existing.some((c) => c.code.toUpperCase() === cleanCode)) {
    return { success: false, error: `Le code promo "${cleanCode}" existe déjà.` };
  }

  const newId = `coupon_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;
  const newCoupon: Coupon = {
    id: newId,
    code: cleanCode,
    discountType: input.discountType,
    discountValue: Number(input.discountValue),
    minOrderAmount: Number(input.minOrderAmount) || 0,
    usageLimit: input.usageLimit ? Number(input.usageLimit) : null,
    timesUsed: 0,
    expiresAt: input.expiresAt || null,
    isActive: input.isActive !== false,
    createdAt: new Date().toISOString(),
  };

  // Local storage save
  saveStoredCoupons([newCoupon, ...existing]);

  // Supabase save
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('coupons').insert({
        id: newCoupon.id,
        code: newCoupon.code,
        discount_type: newCoupon.discountType,
        discount_value: newCoupon.discountValue,
        min_order_amount: newCoupon.minOrderAmount,
        usage_limit: newCoupon.usageLimit,
        times_used: 0,
        expires_at: newCoupon.expiresAt,
        is_active: newCoupon.isActive,
      }).select().maybeSingle();

      if (error) {
        console.warn('[Coupons] Supabase insert warning:', error.message);
      } else if (data) {
        newCoupon.id = String(data.id);
      }
    } catch (err: any) {
      console.warn('[Coupons] Failed to persist to Supabase:', err);
    }
  }

  return { success: true, coupon: newCoupon };
};

/**
 * Update an existing coupon
 */
export const updateCoupon = async (
  id: string,
  updates: Partial<CreateCouponInput>
): Promise<{ success: boolean; coupon?: Coupon; error?: string }> => {
  const cached = getStoredCoupons();
  const index = cached.findIndex((c) => c.id === id);
  if (index === -1) {
    return { success: false, error: 'Coupon introuvable.' };
  }

  const current = cached[index];
  const cleanCode = updates.code ? updates.code.trim().toUpperCase() : current.code;

  if (updates.discountValue !== undefined && updates.discountValue <= 0) {
    return { success: false, error: 'La valeur de réduction doit être positive.' };
  }

  const updated: Coupon = {
    ...current,
    code: cleanCode,
    discountType: updates.discountType || current.discountType,
    discountValue: updates.discountValue !== undefined ? Number(updates.discountValue) : current.discountValue,
    minOrderAmount: updates.minOrderAmount !== undefined ? Number(updates.minOrderAmount) : current.minOrderAmount,
    usageLimit: updates.usageLimit !== undefined ? (updates.usageLimit ? Number(updates.usageLimit) : null) : current.usageLimit,
    expiresAt: updates.expiresAt !== undefined ? updates.expiresAt : current.expiresAt,
    isActive: updates.isActive !== undefined ? updates.isActive : current.isActive,
  };

  cached[index] = updated;
  saveStoredCoupons([...cached]);

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('coupons')
        .update({
          code: updated.code,
          discount_type: updated.discountType,
          discount_value: updated.discountValue,
          min_order_amount: updated.minOrderAmount,
          usage_limit: updated.usageLimit,
          expires_at: updated.expiresAt,
          is_active: updated.isActive,
        })
        .eq('id', id);
    } catch (err) {
      console.warn('[Coupons] Supabase update warning:', err);
    }
  }

  return { success: true, coupon: updated };
};

/**
 * Toggle active status
 */
export const toggleCouponActive = async (id: string, isActive: boolean): Promise<boolean> => {
  const res = await updateCoupon(id, { isActive });
  return res.success;
};

/**
 * Delete a coupon
 */
export const deleteCoupon = async (id: string): Promise<boolean> => {
  const cached = getStoredCoupons();
  const filtered = cached.filter((c) => c.id !== id);
  saveStoredCoupons(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('coupons').delete().eq('id', id);
    } catch (err) {
      console.warn('[Coupons] Supabase delete warning:', err);
    }
  }

  return true;
};
