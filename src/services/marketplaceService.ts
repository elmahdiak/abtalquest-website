import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface SkillLearned {
  name: string;
  level: string;
}

export interface ProductReview {
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'thinkers' | 'brave' | 'solvers' | 'heart';
  planetName: string;
  productType: 'Physical Kit' | 'Storybook' | 'Quest Gear' | 'Family Game' | 'Learning Tool';
  ageGroup: '6-8' | '9-11' | '12+';
  ageLabel: string;
  price: number;
  xpBonus: number;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  fullDescription: string;
  iconBg?: string;
  accentColor?: string;
  tags: string[];
  safetyGuidelines: string[];
  skillsLearned: SkillLearned[];
  reviews: ProductReview[];
}

export interface OrderItemInput {
  productId: string;
  productTitle: string;
  quantity: number;
  unitPrice: number;
  xpBonus: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  country: string;
  items: OrderItemInput[];
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  totalXp: number;
}

export interface OrderConfirmation {
  orderId: string;
  status: 'confirmed' | 'processing' | 'saved_locally';
  createdAt: string;
  totalAmount: number;
  totalXp: number;
  isSupabaseSaved: boolean;
}

export interface SupabaseHealth {
  connected: boolean;
  tableReady: boolean;
  message: string;
  productCount: number;
}

/**
 * Curated default catalog of 8 official AbtalQuest products.
 * Used as high-reliability fallback if Supabase tables are awaiting SQL migration.
 */
export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: "Thinkers' Clockwork Waterwheel Kit",
    category: 'thinkers',
    planetName: "Thinkers' Planet",
    productType: 'Physical Kit',
    ageGroup: '9-11',
    ageLabel: 'Ages 9–11',
    price: 29.99,
    xpBonus: 400,
    rating: 4.9,
    reviewsCount: 42,
    shortDescription: 'Build real wooden gear ratios to power the Great Oasis water pumps with clean mechanical logic.',
    fullDescription: 'An exquisite STEM building experience inspired by ancient waterwheel engineering. Children assemble precision-cut birchwood gears to learn mechanical advantage, rotational torque, and patient problem-solving without screens.',
    iconBg: 'bg-[#016ba5]/10 text-[#016ba5]',
    accentColor: '#016ba5',
    tags: ['Birchwood Gears', 'No Batteries', 'Mechanical Logic'],
    safetyGuidelines: [
      '100% sustainably harvested natural birchwood',
      'Smooth hand-sanded edges with zero splinter hazards',
      'Child-safe non-toxic organic vegetable stain',
      'Certified EN71 & ASTM F963 Toy Safety Compliant',
    ],
    skillsLearned: [
      { name: 'Mechanical Reasoning', level: 'Mastery' },
      { name: 'Spatial Calculation', level: 'Proficient' },
      { name: 'Patience & Focus (Sabr)', level: 'Advanced' },
    ],
    reviews: [
      {
        author: 'Dr. Youssef K.',
        role: 'Parent & Educator',
        rating: 5,
        date: 'March 2, 2026',
        comment: 'My 10-year-old spent 3 straight afternoons assembling this without asking for a screen once. The instruction booklet emphasizes patience and curiosity beautifully.',
      },
      {
        author: 'Sarah M.',
        role: 'Homeschooling Mother of 3',
        rating: 5,
        date: 'Feb 18, 2026',
        comment: 'Top-tier craftsmanship. The gears turn with a satisfying smooth click. Wonderful addition to our science and values lessons.',
      },
    ],
  },
  {
    id: 'prod-2',
    title: 'The Scribe of Wisdom Illustrated Chronicle',
    category: 'thinkers',
    planetName: "Thinkers' Planet",
    productType: 'Storybook',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8',
    price: 18.50,
    xpBonus: 250,
    rating: 4.8,
    reviewsCount: 38,
    shortDescription: 'A grand hardcover tale of young Zeid deciphering ancient riddles of astronomy, navigation, and moral courage.',
    fullDescription: 'Packed with luminous hand-painted illustrations, this storybook invites children into an ancient desert observatory. Every chapter includes interactive moral checkpoints asking children how they would resolve dilemmas with honesty and kindness.',
    iconBg: 'bg-[#016ba5]/10 text-[#016ba5]',
    accentColor: '#016ba5',
    tags: ['FSC Paper', 'Soy Inks', 'Moral Riddles'],
    safetyGuidelines: [
      'Printed with plant-based, non-toxic soy inks',
      'FSC certified heavyweight matte paper (200gsm)',
      'Rounded child-safe corner covers',
      'Zero glare coating for relaxed night-time reading',
    ],
    skillsLearned: [
      { name: 'Critical Reading', level: 'Proficient' },
      { name: 'Moral Discernment', level: 'Mastery' },
      { name: 'Cultural Vocabulary', level: 'Advanced' },
    ],
    reviews: [
      {
        author: 'Amina R.',
        role: 'Elementary Librarian',
        rating: 5,
        date: 'Jan 29, 2026',
        comment: 'The narrative voice is poetic yet thoroughly engaging. The dialogue between characters demonstrates genuine respect and humility.',
      },
    ],
  },
  {
    id: 'prod-3',
    title: 'Mount Sabr Trail Compass & Weather Journal',
    category: 'brave',
    planetName: 'Brave Planet',
    productType: 'Quest Gear',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8',
    price: 24.00,
    xpBonus: 350,
    rating: 5.0,
    reviewsCount: 64,
    shortDescription: "Durable brass pocket compass with sighting mirror, lanyard, and a waterproof explorer's field journal.",
    fullDescription: 'Designed for real-world family hikes and outdoor navigation quests. Children learn cardinal bearings, track cloud formations, and record acts of fortitude when confronting natural challenges with resilience and calm.',
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    accentColor: '#fa8221',
    tags: ['Solid Brass', 'Breakaway Lanyard', 'Weather Journal'],
    safetyGuidelines: [
      'Breakaway safety neck lanyard to eliminate choking risk',
      'Lead-free solid brass with soft silicone protective bumper',
      'Shatterproof acrylic liquid-filled compass capsule',
      'Waterproof stone-paper journal made without tree logging',
    ],
    skillsLearned: [
      { name: 'Trail Navigation', level: 'Proficient' },
      { name: 'Emotional Resilience', level: 'Mastery' },
      { name: 'Environmental Care', level: 'Advanced' },
    ],
    reviews: [
      {
        author: 'Tariq H.',
        role: 'Scout Leader & Father',
        rating: 5,
        date: 'March 10, 2026',
        comment: 'Unbelievable build quality. We took it into the Rocky Mountains; my daughter tracked our entire 4-mile loop and proudly filled her journal.',
      },
    ],
  },
  {
    id: 'prod-4',
    title: 'The Resilience Sand-Timer & Calm Chamber',
    category: 'brave',
    planetName: 'Brave Planet',
    productType: 'Learning Tool',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8',
    price: 16.00,
    xpBonus: 200,
    rating: 4.7,
    reviewsCount: 29,
    shortDescription: 'A 5-minute tactile hourglass with mineral sand that helps children self-regulate emotional storms.',
    fullDescription: 'A therapeutic tactile mindfulness tool crafted for quiet corners. When big feelings arise, children turn the hourglass, breathe deeply with the rhythmic sand cascade, and reflect on their inner courage before reacting.',
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    accentColor: '#fa8221',
    tags: ['Drop-Tested Glass', 'Calm Regulation', 'Natural Minerals'],
    safetyGuidelines: [
      'Drop-tested high-density borosilicate glass',
      'Soft dual-end silicone shock absorbers for accidental tumbles',
      '100% natural inert silicate sand (dust-free, hypoallergenic)',
      'Smooth tactile exterior with no sharp facets',
    ],
    skillsLearned: [
      { name: 'Self-Regulation', level: 'Mastery' },
      { name: 'Emotional Awareness', level: 'Mastery' },
      { name: 'Patience Interval Training', level: 'Proficient' },
    ],
    reviews: [
      {
        author: 'Leila B.',
        role: 'Child Behavioral Counselor',
        rating: 5,
        date: 'Feb 5, 2026',
        comment: 'I prescribe this to families dealing with emotional dysregulation. Having a concrete, beautiful anchor transforms temper tantrums into self-calming.',
      },
    ],
  },
  {
    id: 'prod-5',
    title: 'Hydraulic Aquifer Robotic Sluice Arm',
    category: 'solvers',
    planetName: "Solvers' Planet",
    productType: 'Physical Kit',
    ageGroup: '12+',
    ageLabel: 'Ages 12+',
    price: 36.50,
    xpBonus: 500,
    rating: 4.9,
    reviewsCount: 51,
    shortDescription: 'Assemble a 4-axis water-pressurized robotic arm with syringe pistons that moves blocks across obstacle mazes.',
    fullDescription: "Master Pascal's law through hands-on pneumatic and hydraulic engineering. Zero batteries required: pistons utilize clean tap water to articulate three robotic joint axes and a grippy claw that manipulates quest tokens.",
    iconBg: 'bg-[#0284c7]/10 text-[#0284c7]',
    accentColor: '#0284c7',
    tags: ['100% Water Powered', 'No Motor Hazards', 'Fluid Mechanics'],
    safetyGuidelines: [
      'Completely water-driven with food-grade medical syringes',
      'Laser-cut sustainable bamboo structural trusses',
      'Safe blunt push-rivets for secure tool-free assembly',
      'Lead-free, PVC-free flexible silicone fluid tubing',
    ],
    skillsLearned: [
      { name: 'Fluid Mechanics', level: 'Mastery' },
      { name: 'Complex Assembly', level: 'Advanced' },
      { name: 'Iterative Debugging', level: 'Mastery' },
    ],
    reviews: [
      {
        author: 'Prof. Omar D.',
        role: 'Robotics Researcher',
        rating: 5,
        date: 'March 12, 2026',
        comment: 'Remarkably accurate kinematic linkages for a wood and syringe kit. It teaches fluid power far better than an animated computer app ever could.',
      },
    ],
  },
  {
    id: 'prod-6',
    title: 'Labyrinth Logic Algorithm Card Deck',
    category: 'solvers',
    planetName: "Solvers' Planet",
    productType: 'Family Game',
    ageGroup: '9-11',
    ageLabel: 'Ages 9–11',
    price: 22.00,
    xpBonus: 320,
    rating: 4.8,
    reviewsCount: 33,
    shortDescription: 'Screen-free algorithmic thinking game where players program cooperative explorer paths through shifting canyon walls.',
    fullDescription: 'Kids lay sequence cards (Step Forward, Loop If, Branch When Safe) to guide each other through dynamic modular board terrain. Teaches conditional logic, nested loops, and communicative teamwork without screens.',
    iconBg: 'bg-[#0284c7]/10 text-[#0284c7]',
    accentColor: '#0284c7',
    tags: ['Screen-Free Coding', 'Cooperative Play', 'Logical Sequencing'],
    safetyGuidelines: [
      'Laminated with organic food-safe moisture-proof finish',
      'Rounded safety radius on all 120 card corners',
      'Sturdy magnetic-latch travel storage case',
      'Vegetable-based printing inks certified odorless',
    ],
    skillsLearned: [
      { name: 'Algorithmic Thinking', level: 'Mastery' },
      { name: 'Pattern Decomposition', level: 'Advanced' },
      { name: 'Logic Sequencing', level: 'Mastery' },
    ],
    reviews: [
      {
        author: 'Nadia S.',
        role: 'Computer Science Educator',
        rating: 5,
        date: 'Feb 22, 2026',
        comment: 'The finest unplugged computational thinking game on the market. It intuitively grounds concepts like recursion and condition checks in cooperative narrative.',
      },
    ],
  },
  {
    id: 'prod-7',
    title: 'The Caravan of Kindness Cooperative Game',
    category: 'heart',
    planetName: 'Heart Planet',
    productType: 'Family Game',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8',
    price: 34.00,
    xpBonus: 450,
    rating: 5.0,
    reviewsCount: 77,
    shortDescription: 'A heartwarming cooperative board game where players share water, dates, and blankets to help an entire village flourish.',
    fullDescription: 'Unlike zero-sum cutthroat board games, every player in The Caravan of Kindness succeeds only when the entire oasis community is sheltered and fed. Encourages mutual aid, active listening, and generosity over greed.',
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    accentColor: '#7C3AED',
    tags: ['100% Cooperative', 'Empathy First', 'Wood Tokens'],
    safetyGuidelines: [
      'Handcrafted solid rubberwood milestone figures',
      'Zero plastic components in packaging or tokens',
      'Non-toxic watercolor finishes on all pieces',
      'Extra-thick 3mm recycled cardboard gameboard',
    ],
    skillsLearned: [
      { name: 'Empathic Decision Making', level: 'Mastery' },
      { name: 'Cooperative Consensus', level: 'Mastery' },
      { name: 'Generosity & Altruism', level: 'Advanced' },
    ],
    reviews: [
      {
        author: 'Farah & Bilal Q.',
        role: 'Parents of 4',
        rating: 5,
        date: 'March 15, 2026',
        comment: 'Our Friday game night used to end in sibling squabbles over Monopoly. Caravan of Kindness has them clapping and scheming together to help the villagers. Simply priceless.',
      },
    ],
  },
  {
    id: 'prod-8',
    title: 'The Gratitude Lantern & Friendship Scroll Craft',
    category: 'heart',
    planetName: 'Heart Planet',
    productType: 'Physical Kit',
    ageGroup: '6-8',
    ageLabel: 'Ages 6–8',
    price: 19.99,
    xpBonus: 280,
    rating: 4.9,
    reviewsCount: 45,
    shortDescription: 'Assemble a glowing wooden night lantern surrounded by interchangeable scrolls where kids write daily thanks to family.',
    fullDescription: 'An uplifting evening bedroom ritual. Children interlock geometric laser-cut wood filigree panels around a warm, flickering LED candle, sliding in handwritten gratitude notes that illuminate from within.',
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    accentColor: '#7C3AED',
    tags: ['Cool-Touch LED', 'Plywood Filigree', 'Gratitude Ritual'],
    safetyGuidelines: [
      'Low-voltage battery-operated cool-touch LED candle (CR2032 included with child-proof screw casing)',
      'Smooth birch filigree with zero splinters or rough edges',
      'Non-toxic watercolor markers included',
      'Flame-resistant heavy parchment scrolls',
    ],
    skillsLearned: [
      { name: 'Gratitude Reflection', level: 'Mastery' },
      { name: 'Written Expression', level: 'Proficient' },
      { name: 'Fine-Motor Craftsmanship', level: 'Advanced' },
    ],
    reviews: [
      {
        author: 'Hassan E.',
        role: 'Grandparent',
        rating: 5,
        date: 'Jan 14, 2026',
        comment: 'My grandson gifted me one of the completed scrolls with a message that melted my heart. It now sits by my reading desk as a constant reminder of our bond.',
      },
    ],
  },
];

/**
 * Retrieves or generates a persistent anonymous session ID for the user's cart
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  const storageKey = 'abtalquest_session_id';
  let sessionId = localStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = `abq_sess_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    localStorage.setItem(storageKey, sessionId);
  }
  return sessionId;
};

/**
 * Maps a Supabase database row to the UI Product interface
 */
interface SupabaseProductRow {
  id: string;
  title: string;
  category: 'thinkers' | 'brave' | 'solvers' | 'heart';
  planet_name: string;
  product_type: Product['productType'];
  age_group: '6-8' | '9-11' | '12+';
  age_label: string;
  price: number | string;
  xp_bonus: number;
  rating?: number;
  reviews_count?: number;
  short_description: string;
  full_description: string;
  icon_bg?: string;
  accent_color?: string;
  tags?: string[];
  safety_guidelines?: string[];
  skills_learned?: SkillLearned[];
  reviews?: ProductReview[];
}

const mapRowToProduct = (row: SupabaseProductRow): Product => {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    planetName: row.planet_name,
    productType: row.product_type,
    ageGroup: row.age_group,
    ageLabel: row.age_label,
    price: Number(row.price),
    xpBonus: Number(row.xp_bonus || 0),
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    iconBg: row.icon_bg || 'bg-slate-100 text-slate-700',
    accentColor: row.accent_color || '#016ba5',
    tags: Array.isArray(row.tags) ? row.tags : [],
    safetyGuidelines: Array.isArray(row.safety_guidelines) ? row.safety_guidelines : [],
    skillsLearned: Array.isArray(row.skills_learned) ? row.skills_learned : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
  };
};

/**
 * Check Supabase health & schema readiness
 */
export const checkSupabaseHealth = async (): Promise<SupabaseHealth> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      tableReady: false,
      message: 'Local Offline Mode (Supabase not configured)',
      productCount: DEFAULT_PRODUCTS.length,
    };
  }

  try {
    const { data, error } = await supabase.from('products').select('id');
    if (error) {
      if (error.code === 'PGRST205') {
        return {
          connected: true,
          tableReady: false,
          message: 'Supabase Connected (Awaiting schema.sql execution)',
          productCount: DEFAULT_PRODUCTS.length,
        };
      }
      return {
        connected: false,
        tableReady: false,
        message: `Connection issue: ${error.message}`,
        productCount: DEFAULT_PRODUCTS.length,
      };
    }

    return {
      connected: true,
      tableReady: true,
      message: 'Supabase Live Connected',
      productCount: data?.length ?? 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return {
      connected: false,
      tableReady: false,
      message: `Network error: ${message}`,
      productCount: DEFAULT_PRODUCTS.length,
    };
  }
};

/**
 * Fetch marketplace products dynamically from Supabase
 * With automatic fallback to curated catalog if database table is not yet seeded.
 */
export const fetchMarketplaceProducts = async (): Promise<{ products: Product[]; isFromSupabase: boolean }> => {
  if (!isSupabaseConfigured()) {
    return { products: DEFAULT_PRODUCTS, isFromSupabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.info('[AbtalQuest Supabase] Products query returned notice:', error.message);
      return { products: DEFAULT_PRODUCTS, isFromSupabase: false };
    }

    if (data && data.length > 0) {
      return {
        products: data.map((row) => mapRowToProduct(row as unknown as SupabaseProductRow)),
        isFromSupabase: true,
      };
    }

    // If table exists but is empty, fallback to defaults
    return { products: DEFAULT_PRODUCTS, isFromSupabase: false };
  } catch (err) {
    console.warn('[AbtalQuest Supabase] Error fetching products:', err);
    return { products: DEFAULT_PRODUCTS, isFromSupabase: false };
  }
};

/**
 * Sync active cart state to Supabase cart_items table
 */
export const syncCartToSupabase = async (cart: Record<string, number>): Promise<void> => {
  const sessionId = getSessionId();

  // Always save locally in localStorage as mirror
  if (typeof window !== 'undefined') {
    localStorage.setItem(`abtalquest_cart_${sessionId}`, JSON.stringify(cart));
  }

  if (!isSupabaseConfigured()) return;

  try {
    // Delete items with 0 quantity from Supabase
    const activeEntries = Object.entries(cart).filter(([, qty]) => qty > 0);

    // Upsert active cart items
    for (const [productId, quantity] of activeEntries) {
      await supabase
        .from('cart_items')
        .upsert(
          {
            session_id: sessionId,
            product_id: productId,
            quantity,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'session_id,product_id' }
        );
    }

    // Remove zeroed entries
    const zeroEntries = Object.entries(cart).filter(([, qty]) => qty <= 0);
    for (const [productId] of zeroEntries) {
      await supabase
        .from('cart_items')
        .delete()
        .match({ session_id: sessionId, product_id: productId });
    }
  } catch (err) {
    // Graceful error handling - non-blocking
    console.warn('[AbtalQuest Supabase] Cart sync notice:', err);
  }
};

/**
 * Load cart items from Supabase or localStorage
 */
export const loadCartFromSupabase = async (): Promise<Record<string, number>> => {
  const sessionId = getSessionId();
  let localCart: Record<string, number> = {};

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(`abtalquest_cart_${sessionId}`);
    if (raw) {
      try {
        localCart = JSON.parse(raw);
      } catch {
        localCart = {};
      }
    }
  }

  if (!isSupabaseConfigured()) return localCart;

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('session_id', sessionId);

    if (error || !data || data.length === 0) {
      return localCart;
    }

    const remoteCart: Record<string, number> = {};
    for (const item of data) {
      if (item.quantity > 0) {
        remoteCart[item.product_id] = item.quantity;
      }
    }
    return remoteCart;
  } catch {
    return localCart;
  }
};

/**
 * Place and record an order in Supabase
 */
export const placeOrder = async (input: CreateOrderInput): Promise<OrderConfirmation> => {
  const sessionId = getSessionId();
  const orderId = `ABQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const createdAt = new Date().toISOString();

  let isSupabaseSaved = false;

  if (isSupabaseConfigured()) {
    try {
      // 1. Insert order record
      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        session_id: sessionId,
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        shipping_address: input.shippingAddress,
        city: input.city,
        postal_code: input.postalCode,
        country: input.country || 'United States',
        subtotal: input.subtotal,
        shipping_cost: input.shippingCost,
        total_amount: input.totalAmount,
        total_xp: input.totalXp,
        status: 'confirmed',
      });

      if (!orderError) {
        // 2. Insert order items
        const lineItems = input.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId,
          product_title: item.productTitle,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          xp_bonus: item.xpBonus,
        }));

        await supabase.from('order_items').insert(lineItems);
        isSupabaseSaved = true;

        // 3. Clear cart in Supabase
        await supabase.from('cart_items').delete().eq('session_id', sessionId);
      } else {
        console.warn('[AbtalQuest Supabase] Order insert notice:', orderError.message);
      }
    } catch (err) {
      console.warn('[AbtalQuest Supabase] Order creation caught error:', err);
    }
  }

  // Backup to localStorage
  if (typeof window !== 'undefined') {
    const ordersHistoryKey = 'abtalquest_orders_history';
    const existingRaw = localStorage.getItem(ordersHistoryKey);
    const existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
    existingOrders.unshift({
      orderId,
      ...input,
      createdAt,
      isSupabaseSaved,
      status: 'confirmed',
    });
    localStorage.setItem(ordersHistoryKey, JSON.stringify(existingOrders));

    // Clear local cart
    localStorage.removeItem(`abtalquest_cart_${sessionId}`);
  }

  return {
    orderId,
    status: isSupabaseSaved ? 'confirmed' : 'saved_locally',
    createdAt,
    totalAmount: input.totalAmount,
    totalXp: input.totalXp,
    isSupabaseSaved,
  };
};
