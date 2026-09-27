import { supabase, isSupabaseConfigured } from '../supabaseClient';

export type VendorApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface VendorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  shopName: string;
  category: string;
  categoryLabel?: string;
  productDescription: string;
  targetAgeGroup?: string;
  websiteOrSocial?: string;
  sampleImages: string[];
  status: VendorApplicationStatus;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVendorApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  shopName: string;
  category: string;
  productDescription: string;
  targetAgeGroup?: string;
  websiteOrSocial?: string;
  sampleImages?: string[];
}

export interface VendorDatabaseHealth {
  connected: boolean;
  tableExists: boolean;
  count: number;
  pendingCount: number;
  error?: string;
}

const LOCAL_STORAGE_KEY = 'abtalquest_vendor_applications_cache';
export const VENDOR_APPLICATIONS_UPDATE_EVENT = 'abtalquest_vendor_applications_updated';

export const VENDOR_CATEGORIES = [
  { id: 'stem', labelEn: 'STEM & Science Kits', labelFr: 'Kits STEM & Sciences', labelAr: 'حقائب العلوم والابتكار' },
  { id: 'wood', labelEn: 'Wooden Toys & Puzzles', labelFr: 'Jouets en Bois & Puzzles', labelAr: 'ألعاب خشبية وألغاز' },
  { id: 'books', labelEn: 'Storybooks & Chronicles', labelFr: 'Livres d\'Histoire & Contes', labelAr: 'كتب وقصص الأطفال' },
  { id: 'montessori', labelEn: 'Montessori & Early Learning', labelFr: 'Montessori & Éveil', labelAr: 'منتسوري والتعلم المبكر' },
  { id: 'games', labelEn: 'Cooperative Board Games', labelFr: 'Jeux de Société Coopératifs', labelAr: 'ألعاب لوحية تعاونية' },
  { id: 'crafts', labelEn: 'Handmade Crafts & Art', labelFr: 'Artisanat & Créativité', labelAr: 'أعمال يدوية وفنون' },
  { id: 'other', labelEn: 'Other Family Gear', labelFr: 'Autre Matériel Familial', labelAr: 'منتجات عائلية أخرى' },
];

export const DEFAULT_VENDOR_APPLICATIONS: VendorApplication[] = [
  {
    id: 'app_parent_amina',
    fullName: 'Amina Benjelloun',
    email: 'amina.b@oasiscrafts.ma',
    phone: '+212 661 234 567',
    shopName: 'Atlas Wooden Curiosities',
    category: 'wood',
    categoryLabel: 'Wooden Toys & Puzzles',
    productDescription: 'Handcrafted Moroccan cedarwood puzzles and tactile sorting blocks inspired by traditional geometric architecture, certified non-toxic with organic beeswax finish.',
    targetAgeGroup: '4-7',
    websiteOrSocial: 'https://instagram.com/atlascuriosities',
    sampleImages: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    createdAt: '2026-03-24T10:15:00Z',
  },
  {
    id: 'app_parent_youssef',
    fullName: 'Youssef Mansouri',
    email: 'youssef@astrokids.org',
    phone: '+212 662 890 123',
    shopName: 'Noor Science Lab',
    category: 'stem',
    categoryLabel: 'STEM & Science Kits',
    productDescription: 'Screen-free optical kits for budding astronomers: build-your-own brass sun-dials and stellar constellation light boxes tailored for primary school kids.',
    targetAgeGroup: '8-12',
    websiteOrSocial: 'https://noorsciencelab.ma',
    sampleImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'approved',
    adminNotes: 'Excellent physical build and pedagogical guide. Safety certification verified.',
    reviewedBy: 'akmahdi085@gmail.com',
    reviewedAt: '2026-03-25T14:30:00Z',
    createdAt: '2026-03-23T09:00:00Z',
  },
  {
    id: 'app_parent_fatima',
    fullName: 'Fatima-Zahra El Idrissi',
    email: 'fz.elidrissi@hikayats.com',
    phone: '+212 663 456 789',
    shopName: 'Contes & Couleurs',
    category: 'books',
    categoryLabel: 'Storybooks & Chronicles',
    productDescription: 'Illustrated trilingual moral chronicles (Arabic, French, English) highlighting courage, kindness, and historical Arab thinkers through watercolor illustrations.',
    targetAgeGroup: '5-9',
    websiteOrSocial: 'https://hikayats.com',
    sampleImages: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'pending',
    createdAt: '2026-03-26T16:45:00Z',
  }
];

/**
 * Load applications from localStorage mirror
 */
export const getStoredVendorApplications = (): VendorApplication[] => {
  if (typeof window === 'undefined') return DEFAULT_VENDOR_APPLICATIONS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_VENDOR_APPLICATIONS));
      return DEFAULT_VENDOR_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VENDOR_APPLICATIONS;
  } catch {
    return DEFAULT_VENDOR_APPLICATIONS;
  }
};

/**
 * Save applications to localStorage mirror and notify subscribers
 */
export const saveStoredVendorApplications = (applications: VendorApplication[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(applications));
    window.dispatchEvent(new CustomEvent(VENDOR_APPLICATIONS_UPDATE_EVENT, { detail: applications }));
  } catch (err) {
    console.warn('[Vendor Applications] Failed to save to localStorage:', err);
  }
};

/**
 * Map database row to VendorApplication model
 */
const mapRowToVendorApplication = (row: any): VendorApplication => {
  const categoryObj = VENDOR_CATEGORIES.find(c => c.id === row.category);
  return {
    id: row.id,
    fullName: row.full_name || row.fullName || '',
    email: row.email || '',
    phone: row.phone || '',
    shopName: row.shop_name || row.shopName || '',
    category: row.category || 'other',
    categoryLabel: categoryObj?.labelEn || row.category_label || row.category,
    productDescription: row.product_description || row.productDescription || '',
    targetAgeGroup: row.target_age_group || row.targetAgeGroup || 'all',
    websiteOrSocial: row.website_or_social || row.websiteOrSocial || '',
    sampleImages: Array.isArray(row.sample_images) ? row.sample_images : (row.sampleImages || []),
    status: (row.status === 'approved' || row.status === 'rejected' ? row.status : 'pending') as VendorApplicationStatus,
    adminNotes: row.admin_notes || row.adminNotes || '',
    reviewedBy: row.reviewed_by || row.reviewedBy,
    reviewedAt: row.reviewed_at || row.reviewedAt,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt,
  };
};

/**
 * Fetch all vendor applications for Admin & Manager portals
 */
export const fetchVendorApplications = async (): Promise<VendorApplication[]> => {
  if (!isSupabaseConfigured()) {
    return getStoredVendorApplications().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  try {
    const { data, error } = await supabase
      .from('vendor_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error && !error.message?.includes('does not exist')) {
        console.warn('[Vendor Applications] Supabase fetch notice:', error.message);
      }
      return getStoredVendorApplications().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const mapped = data.map(mapRowToVendorApplication);
    saveStoredVendorApplications(mapped);
    return mapped;
  } catch (err) {
    console.warn('[Vendor Applications] Error fetching from Supabase, using cache:', err);
    return getStoredVendorApplications().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
};

/**
 * Submit a new Parent Vendor application from the public frontend form
 */
export const submitVendorApplication = async (
  input: CreateVendorApplicationInput
): Promise<{ success: boolean; application?: VendorApplication; error?: string }> => {
  const now = new Date().toISOString();
  const id = `vendor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const categoryObj = VENDOR_CATEGORIES.find(c => c.id === input.category);

  const newApp: VendorApplication = {
    id,
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    shopName: input.shopName.trim(),
    category: input.category,
    categoryLabel: categoryObj?.labelEn || input.category,
    productDescription: input.productDescription.trim(),
    targetAgeGroup: input.targetAgeGroup || 'all',
    websiteOrSocial: input.websiteOrSocial?.trim() || '',
    sampleImages: input.sampleImages || [],
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  // Try storing in Supabase
  if (isSupabaseConfigured()) {
    try {
      const { error: insertErr } = await supabase.from('vendor_applications').insert({
        id: newApp.id,
        full_name: newApp.fullName,
        email: newApp.email,
        phone: newApp.phone,
        shop_name: newApp.shopName,
        category: newApp.category,
        product_description: newApp.productDescription,
        target_age_group: newApp.targetAgeGroup,
        website_or_social: newApp.websiteOrSocial,
        sample_images: newApp.sampleImages,
        status: newApp.status,
        created_at: newApp.createdAt,
        updated_at: newApp.updatedAt,
      });

      if (insertErr) {
        console.warn('[Vendor Applications] Supabase insert warning:', insertErr.message);
      }
    } catch (err) {
      console.warn('[Vendor Applications] Exception inserting to Supabase:', err);
    }
  }

  // Save to local cache mirror
  const current = getStoredVendorApplications();
  const updated = [newApp, ...current];
  saveStoredVendorApplications(updated);

  return { success: true, application: newApp };
};

/**
 * Update vendor application status (Approve / Reject) with admin notes
 */
export const updateVendorApplicationStatus = async (
  id: string,
  status: VendorApplicationStatus,
  adminNotes?: string,
  reviewerEmail?: string
): Promise<{ success: boolean; error?: string }> => {
  const current = getStoredVendorApplications();
  const index = current.findIndex(a => a.id === id);
  if (index === -1) {
    return { success: false, error: 'Application not found.' };
  }

  const now = new Date().toISOString();
  const updatedApp: VendorApplication = {
    ...current[index],
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : current[index].adminNotes,
    reviewedBy: reviewerEmail || current[index].reviewedBy || 'Admin',
    reviewedAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({
          status: updatedApp.status,
          admin_notes: updatedApp.adminNotes,
          reviewed_by: updatedApp.reviewedBy,
          reviewed_at: updatedApp.reviewedAt,
          updated_at: now,
        })
        .eq('id', id);

      if (error) {
        console.warn('[Vendor Applications] Supabase status update notice:', error.message);
      }
    } catch (err) {
      console.warn('[Vendor Applications] Exception updating Supabase status:', err);
    }
  }

  current[index] = updatedApp;
  saveStoredVendorApplications(current);

  return { success: true };
};

/**
 * Delete a vendor application
 */
export const deleteVendorApplication = async (id: string): Promise<{ success: boolean; error?: string }> => {
  const current = getStoredVendorApplications();
  const filtered = current.filter(a => a.id !== id);
  saveStoredVendorApplications(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('vendor_applications').delete().eq('id', id);
    } catch (err) {
      console.warn('[Vendor Applications] Supabase delete warning:', err);
    }
  }

  return { success: true };
};

/**
 * Upload sample product image to Supabase Storage ('product-images' or 'banner-media')
 */
export const uploadVendorSampleImage = async (file: File): Promise<string> => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image file exceeds the 5MB size limit.');
  }

  if (!isSupabaseConfigured()) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image locally.'));
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `vendor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `vendor-samples/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.warn('[Vendor Applications] Upload fallback, returning data URL:', uploadError);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('Could not resolve public URL for uploaded sample image.');
  }

  return data.publicUrl;
};

/**
 * Check database health for vendor applications
 */
export const checkVendorDatabaseHealth = async (): Promise<VendorDatabaseHealth> => {
  if (!isSupabaseConfigured()) {
    const list = getStoredVendorApplications();
    return {
      connected: false,
      tableExists: false,
      count: list.length,
      pendingCount: list.filter(a => a.status === 'pending').length,
      error: 'Supabase credentials not configured in environment',
    };
  }

  try {
    const { count, error } = await supabase
      .from('vendor_applications')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        connected: true,
        tableExists: false,
        count: 0,
        pendingCount: 0,
        error: error.message,
      };
    }

    const { count: pendingCount } = await supabase
      .from('vendor_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    return {
      connected: true,
      tableExists: true,
      count: count ?? 0,
      pendingCount: pendingCount ?? 0,
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      count: 0,
      pendingCount: 0,
      error: err?.message || 'Database health check failed',
    };
  }
};

/**
 * SQL Schema for vendor_applications table
 */
export const VENDOR_APPLICATIONS_SCHEMA_SQL = `-- ==============================================================================
-- AbtalQuest: Parent Vendors (Parent Vendeurs) Applications Table
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  shop_name TEXT NOT NULL,
  category TEXT NOT NULL,
  product_description TEXT NOT NULL,
  target_age_group TEXT,
  website_or_social TEXT,
  sample_images TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on vendor_applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Allow public read on vendor_applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Allow update on vendor_applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Allow delete on vendor_applications" ON public.vendor_applications;

CREATE POLICY "Allow public insert on vendor_applications"
  ON public.vendor_applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public read on vendor_applications"
  ON public.vendor_applications FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow update on vendor_applications"
  ON public.vendor_applications FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete on vendor_applications"
  ON public.vendor_applications FOR DELETE TO anon, authenticated USING (true);
`;
