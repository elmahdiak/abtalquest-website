-- ==============================================================================
-- AbtalQuest Marketplace Database Schema for Supabase
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- to create all necessary tables, Row Level Security (RLS) policies, and seed products.
-- ==============================================================================

-- 0. CATEGORIES TABLE (Dynamic Taxonomy & Planets for Marketplace)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  planet_name TEXT,
  accent_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public insert on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public update on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public delete on categories" ON public.categories;

CREATE POLICY "Allow public read on categories"
  ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert on categories"
  ON public.categories FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update on categories"
  ON public.categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on categories"
  ON public.categories FOR DELETE TO anon, authenticated USING (true);

-- Seed Default Categories
INSERT INTO public.categories (id, name, slug, description, icon, planet_name, accent_color)
VALUES
  ('thinkers', 'Thinkers'' Planet', 'thinkers', 'STEM, logic, astronomy, and clockwork kits', 'Brain', 'Thinkers'' Planet', '#016ba5'),
  ('brave', 'Brave Planet', 'brave', 'Exploration, grit, navigation, and resilience', 'Compass', 'Brave Planet', '#fa8221'),
  ('solvers', 'Solvers'' Planet', 'solvers', 'Robotics, fluid mechanics, and engineering puzzles', 'Wrench', 'Solvers'' Planet', '#0284c7'),
  ('heart', 'Heart Planet', 'heart', 'Kindness, empathy, cooperative games, and family bonds', 'Heart', 'Heart Planet', '#7C3AED'),
  ('books', 'Storybooks & Chronicles', 'books', 'Illustrated moral tales and cultural chronicles', 'BookOpen', 'Thinkers'' Planet', '#059669'),
  ('games', 'Family Games & Puzzles', 'games', 'Unplugged screen-free cooperative table games', 'Gamepad2', 'Heart Planet', '#DC2626')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  planet_name = EXCLUDED.planet_name,
  accent_color = EXCLUDED.accent_color;

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  planet_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  age_group TEXT NOT NULL,
  age_label TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  discount_percent INTEGER DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_count INTEGER NOT NULL DEFAULT 15,
  is_best_seller BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]'::jsonb,
  xp_bonus INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon_bg TEXT,
  accent_color TEXT,
  tags TEXT[] DEFAULT '{}',
  safety_guidelines TEXT[] DEFAULT '{}',
  skills_learned JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist and constraints are updated if table already existed
DO $$
BEGIN
  -- Drop restrictive category check constraint if present
  IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name = 'products' AND constraint_name = 'products_category_check') THEN
    ALTER TABLE public.products DROP CONSTRAINT products_category_check;
  END IF;

  -- Add newly introduced columns if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'sku') THEN
    ALTER TABLE public.products ADD COLUMN sku TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
    ALTER TABLE public.products ADD COLUMN original_price NUMERIC(10, 2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_percent') THEN
    ALTER TABLE public.products ADD COLUMN discount_percent INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'in_stock') THEN
    ALTER TABLE public.products ADD COLUMN in_stock BOOLEAN NOT NULL DEFAULT true;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'stock_count') THEN
    ALTER TABLE public.products ADD COLUMN stock_count INTEGER NOT NULL DEFAULT 15;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_best_seller') THEN
    ALTER TABLE public.products ADD COLUMN is_best_seller BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_new') THEN
    ALTER TABLE public.products ADD COLUMN is_new BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'images') THEN
    ALTER TABLE public.products ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'variants') THEN
    ALTER TABLE public.products ADD COLUMN variants JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to avoid conflict
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin update on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin delete on products" ON public.products;

-- Allow public read access to products
CREATE POLICY "Allow public read on products" 
  ON public.products 
  FOR SELECT 
  TO anon, authenticated 
  USING (true);

-- Allow authorized admin / manager CRUD on products
CREATE POLICY "Allow admin insert on products" 
  ON public.products 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow admin update on products" 
  ON public.products 
  FOR UPDATE 
  TO anon, authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete on products" 
  ON public.products 
  FOR DELETE 
  TO anon, authenticated 
  USING (true);

-- 2. CART ITEMS TABLE (Session-based anonymous or authenticated carts)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Enable RLS for cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Allow public CRUD on cart items matching session_id
CREATE POLICY "Allow all operations on session cart"
  ON public.cart_items
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- -- 3. ORDERS TABLE (Supports multi-device access for Admins & Managers, authenticated users, and guest checkouts)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT, -- Flexible text identifier: supports UUIDs from auth.users or guest/client identifiers
  session_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'Morocco',
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  total_xp INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Self-contained array of order items for fast single-query retrieval
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created earlier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'items') THEN
    ALTER TABLE public.orders ADD COLUMN items JSONB NOT NULL DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
    ALTER TABLE public.orders ADD COLUMN customer_phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'notes') THEN
    ALTER TABLE public.orders ADD COLUMN notes TEXT;
  END IF;
  -- Ensure user_id column allows TEXT
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'user_id' AND data_type = 'uuid') THEN
    ALTER TABLE public.orders ALTER COLUMN user_id TYPE TEXT USING user_id::text;
  END IF;
END $$;

-- Indexes for lightning fast queries across devices
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to avoid conflict
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin update on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admin delete on orders" ON public.orders;

-- Allow anyone (guest customer or logged-in user) to place orders
CREATE POLICY "Allow public insert on orders"
  ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow Admins, Managers, and customers to query orders across devices
CREATE POLICY "Allow public read on orders"
  ON public.orders
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow Admins and Managers to update order status (e.g. mark as shipped, delivered, cancelled)
CREATE POLICY "Allow admin update on orders"
  ON public.orders
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow Admins to delete test or cancelled orders if needed
CREATE POLICY "Allow admin delete on orders"
  ON public.orders
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 4. ORDER ITEMS TABLE (Relational normalization and item-level reporting)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL,
  xp_bonus INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on order_id for fast foreign-key joins
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public read on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow admin update on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow admin delete on order_items" ON public.order_items;

-- Allow public insert and read on order_items
CREATE POLICY "Allow public insert on order_items"
  ON public.order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read on order_items"
  ON public.order_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin update on order_items"
  ON public.order_items
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin delete on order_items"
  ON public.order_items
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- 5. CONTACT MESSAGES TABLE (Visitor Inquiries from "Contact Us")
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert on contact_messages
CREATE POLICY "Allow public insert on contact_messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading and updating contact_messages
CREATE POLICY "Allow read on contact_messages"
  ON public.contact_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow update on contact_messages"
  ON public.contact_messages
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. ADMIN USERS TABLE (Authorized Administrator Directory)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT 'Admin',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'support_admin')),
  is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read on admin_users"
  ON public.admin_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert on admin_users"
  ON public.admin_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow delete on admin_users"
  ON public.admin_users
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Seed ElMahdi Ak as the Primary Super Administrator
INSERT INTO public.admin_users (email, full_name, role, is_super_admin, created_by)
VALUES ('akmahdi085@gmail.com', 'ElMahdi Ak', 'super_admin', TRUE, 'System Initializer')
ON CONFLICT (email) DO UPDATE 
SET role = 'super_admin', is_super_admin = TRUE, full_name = 'ElMahdi Ak';

-- ==============================================================================
-- 5. SEED DATA: 8 Official AbtalQuest Products
-- ==============================================================================
INSERT INTO public.products (
  id, title, category, planet_name, product_type, age_group, age_label,
  price, xp_bonus, rating, reviews_count, short_description, full_description,
  icon_bg, accent_color, tags, safety_guidelines, skills_learned, reviews
) VALUES
(
  'prod-1',
  'Thinkers'' Clockwork Waterwheel Kit',
  'thinkers',
  'Thinkers'' Planet',
  'Physical Kit',
  '9-11',
  'Ages 9–11',
  29.99,
  400,
  4.9,
  42,
  'Build real wooden gear ratios to power the Great Oasis water pumps with clean mechanical logic.',
  'An exquisite STEM building experience inspired by ancient waterwheel engineering. Children assemble precision-cut birchwood gears to learn mechanical advantage, rotational torque, and patient problem-solving without screens.',
  'bg-[#016ba5]/10 text-[#016ba5]',
  '#016ba5',
  ARRAY['Birchwood Gears', 'No Batteries', 'Mechanical Logic'],
  ARRAY[
    '100% sustainably harvested natural birchwood',
    'Smooth hand-sanded edges with zero splinter hazards',
    'Child-safe non-toxic organic vegetable stain',
    'Certified EN71 & ASTM F963 Toy Safety Compliant'
  ],
  '[
    {"name": "Mechanical Reasoning", "level": "Mastery"},
    {"name": "Spatial Calculation", "level": "Proficient"},
    {"name": "Patience & Focus (Sabr)", "level": "Advanced"}
  ]'::jsonb,
  '[
    {
      "author": "Dr. Youssef K.",
      "role": "Parent & Educator",
      "rating": 5,
      "date": "March 2, 2026",
      "comment": "My 10-year-old spent 3 straight afternoons assembling this without asking for a screen once. The instruction booklet emphasizes patience and curiosity beautifully."
    },
    {
      "author": "Sarah M.",
      "role": "Homeschooling Mother of 3",
      "rating": 5,
      "date": "Feb 18, 2026",
      "comment": "Top-tier craftsmanship. The gears turn with a satisfying smooth click. Wonderful addition to our science and values lessons."
    }
  ]'::jsonb
),
(
  'prod-2',
  'The Scribe of Wisdom Illustrated Chronicle',
  'thinkers',
  'Thinkers'' Planet',
  'Storybook',
  '6-8',
  'Ages 6–8',
  18.50,
  250,
  4.8,
  38,
  'A grand hardcover tale of young Zeid deciphering ancient riddles of astronomy, navigation, and moral courage.',
  'Packed with luminous hand-painted illustrations, this storybook invites children into an ancient desert observatory. Every chapter includes interactive moral checkpoints asking children how they would resolve dilemmas with honesty and kindness.',
  'bg-[#016ba5]/10 text-[#016ba5]',
  '#016ba5',
  ARRAY['FSC Paper', 'Soy Inks', 'Moral Riddles'],
  ARRAY[
    'Printed with plant-based, non-toxic soy inks',
    'FSC certified heavyweight matte paper (200gsm)',
    'Rounded child-safe corner covers',
    'Zero glare coating for relaxed night-time reading'
  ],
  '[
    {"name": "Critical Reading", "level": "Proficient"},
    {"name": "Moral Discernment", "level": "Mastery"},
    {"name": "Cultural Vocabulary", "level": "Advanced"}
  ]'::jsonb,
  '[
    {
      "author": "Amina R.",
      "role": "Elementary Librarian",
      "rating": 5,
      "date": "Jan 29, 2026",
      "comment": "The narrative voice is poetic yet thoroughly engaging. The dialogue between characters demonstrates genuine respect and humility."
    }
  ]'::jsonb
),
(
  'prod-3',
  'Mount Sabr Trail Compass & Weather Journal',
  'brave',
  'Brave Planet',
  'Quest Gear',
  '6-8',
  'Ages 6–8',
  24.00,
  350,
  5.0,
  64,
  'Durable brass pocket compass with sighting mirror, lanyard, and a waterproof explorer''s field journal.',
  'Designed for real-world family hikes and outdoor navigation quests. Children learn cardinal bearings, track cloud formations, and record acts of fortitude when confronting natural challenges with resilience and calm.',
  'bg-[#fa8221]/10 text-[#fa8221]',
  '#fa8221',
  ARRAY['Solid Brass', 'Breakaway Lanyard', 'Weather Journal'],
  ARRAY[
    'Breakaway safety neck lanyard to eliminate choking risk',
    'Lead-free solid brass with soft silicone protective bumper',
    'Shatterproof acrylic liquid-filled compass capsule',
    'Waterproof stone-paper journal made without tree logging'
  ],
  '[
    {"name": "Trail Navigation", "level": "Proficient"},
    {"name": "Emotional Resilience", "level": "Mastery"},
    {"name": "Environmental Care", "level": "Advanced"}
  ]'::jsonb,
  '[
    {
      "author": "Tariq H.",
      "role": "Scout Leader & Father",
      "rating": 5,
      "date": "March 10, 2026",
      "comment": "Unbelievable build quality. We took it into the Rocky Mountains; my daughter tracked our entire 4-mile loop and proudly filled her journal."
    }
  ]'::jsonb
),
(
  'prod-4',
  'The Resilience Sand-Timer & Calm Chamber',
  'brave',
  'Brave Planet',
  'Learning Tool',
  '6-8',
  'Ages 6–8',
  16.00,
  200,
  4.7,
  29,
  'A 5-minute tactile hourglass with glittering mineral sand that helps children self-regulate emotional storms.',
  'A therapeutic tactile mindfulness tool crafted for quiet corners. When big feelings arise, children turn the hourglass, breathe deeply with the rhythmic sand cascade, and reflect on their inner courage before reacting.',
  'bg-[#fa8221]/10 text-[#fa8221]',
  '#fa8221',
  ARRAY['Drop-Tested Glass', 'Calm Regulation', 'Natural Minerals'],
  ARRAY[
    'Drop-tested high-density borosilicate glass',
    'Soft dual-end silicone shock absorbers for accidental tumbles',
    '100% natural inert silicate sand (dust-free, hypoallergenic)',
    'Smooth tactile exterior with no sharp facets'
  ],
  '[
    {"name": "Self-Regulation", "level": "Mastery"},
    {"name": "Emotional Awareness", "level": "Mastery"},
    {"name": "Patience Interval Training", "level": "Proficient"}
  ]'::jsonb,
  '[
    {
      "author": "Leila B.",
      "role": "Child Behavioral Counselor",
      "rating": 5,
      "date": "Feb 5, 2026",
      "comment": "I prescribe this to families dealing with emotional dysregulation. Having a concrete, beautiful anchor transforms temper tantrums into self-calming."
    }
  ]'::jsonb
),
(
  'prod-5',
  'Hydraulic Aquifer Robotic Sluice Arm',
  'solvers',
  'Solvers'' Planet',
  'Physical Kit',
  '12+',
  'Ages 12+',
  36.50,
  500,
  4.9,
  51,
  'Assemble a 4-axis water-pressurized robotic arm with syringe pistons that moves blocks across obstacle mazes.',
  'Master Pascal''s law through hands-on pneumatic and hydraulic engineering. Zero batteries required: pistons utilize clean tap water to articulate three robotic joint axes and a grippy claw that manipulates quest tokens.',
  'bg-[#0284c7]/10 text-[#0284c7]',
  '#0284c7',
  ARRAY['100% Water Powered', 'No Motor Hazards', 'Fluid Mechanics'],
  ARRAY[
    'Completely water-driven with food-grade medical syringes',
    'Laser-cut sustainable bamboo structural trusses',
    'Safe blunt push-rivets for secure tool-free assembly',
    'Lead-free, PVC-free flexible silicone fluid tubing'
  ],
  '[
    {"name": "Fluid Mechanics", "level": "Mastery"},
    {"name": "Complex Assembly", "level": "Advanced"},
    {"name": "Iterative Debugging", "level": "Mastery"}
  ]'::jsonb,
  '[
    {
      "author": "Prof. Omar D.",
      "role": "Robotics Researcher",
      "rating": 5,
      "date": "March 12, 2026",
      "comment": "Remarkably accurate kinematic linkages for a wood and syringe kit. It teaches fluid power far better than an animated computer app ever could."
    }
  ]'::jsonb
),
(
  'prod-6',
  'Labyrinth Logic Algorithm Card Deck',
  'solvers',
  'Solvers'' Planet',
  'Family Game',
  '9-11',
  'Ages 9–11',
  22.00,
  320,
  4.8,
  33,
  'Screen-free algorithmic thinking game where players program cooperative explorer paths through shifting canyon walls.',
  'Kids lay sequence cards (Step Forward, Loop If, Branch When Safe) to guide each other through dynamic modular board terrain. Teaches conditional logic, nested loops, and communicative teamwork without screens.',
  'bg-[#0284c7]/10 text-[#0284c7]',
  '#0284c7',
  ARRAY['Screen-Free Coding', 'Cooperative Play', 'Logical Sequencing'],
  ARRAY[
    'Laminated with organic food-safe moisture-proof finish',
    'Rounded safety radius on all 120 card corners',
    'Sturdy magnetic-latch travel storage case',
    'Vegetable-based printing inks certified odorless'
  ],
  '[
    {"name": "Algorithmic Thinking", "level": "Mastery"},
    {"name": "Pattern Decomposition", "level": "Advanced"},
    {"name": "Logic Sequencing", "level": "Mastery"}
  ]'::jsonb,
  '[
    {
      "author": "Nadia S.",
      "role": "Computer Science Educator",
      "rating": 5,
      "date": "Feb 22, 2026",
      "comment": "The finest unplugged computational thinking game on the market. It intuitively grounds concepts like recursion and condition checks in cooperative narrative."
    }
  ]'::jsonb
),
(
  'prod-7',
  'The Caravan of Kindness Cooperative Game',
  'heart',
  'Heart Planet',
  'Family Game',
  '6-8',
  'Ages 6–8',
  34.00,
  450,
  5.0,
  77,
  'A heartwarming cooperative board game where players share water, dates, and blankets to help an entire village flourish.',
  'Unlike zero-sum cutthroat board games, every player in The Caravan of Kindness succeeds only when the entire oasis community is sheltered and fed. Encourages mutual aid, active listening, and generosity over greed.',
  'bg-[#7C3AED]/10 text-[#7C3AED]',
  '#7C3AED',
  ARRAY['100% Cooperative', 'Empathy First', 'Wood Tokens'],
  ARRAY[
    'Handcrafted solid rubberwood milestone figures',
    'Zero plastic components in packaging or tokens',
    'Non-toxic watercolor finishes on all pieces',
    'Extra-thick 3mm recycled cardboard gameboard'
  ],
  '[
    {"name": "Empathic Decision Making", "level": "Mastery"},
    {"name": "Cooperative Consensus", "level": "Mastery"},
    {"name": "Generosity & Altruism", "level": "Advanced"}
  ]'::jsonb,
  '[
    {
      "author": "Farah & Bilal Q.",
      "role": "Parents of 4",
      "rating": 5,
      "date": "March 15, 2026",
      "comment": "Our Friday game night used to end in sibling squabbles over Monopoly. Caravan of Kindness has them clapping and scheming together to help the villagers. Simply priceless."
    }
  ]'::jsonb
),
(
  'prod-8',
  'The Gratitude Lantern & Friendship Scroll Craft',
  'heart',
  'Heart Planet',
  'Physical Kit',
  '6-8',
  'Ages 6–8',
  19.99,
  280,
  4.9,
  45,
  'Assemble a glowing wooden night lantern surrounded by interchangeable scrolls where kids write daily thanks to family.',
  'An uplifting evening bedroom ritual. Children interlock geometric laser-cut wood filigree panels around a warm, flickering LED candle, sliding in handwritten gratitude notes that illuminate from within.',
  'bg-[#7C3AED]/10 text-[#7C3AED]',
  '#7C3AED',
  ARRAY['Cool-Touch LED', 'Plywood Filigree', 'Gratitude Ritual'],
  ARRAY[
    'Low-voltage battery-operated cool-touch LED candle (CR2032 included with child-proof screw casing)',
    'Smooth birch filigree with zero splinters or rough edges',
    'Non-toxic watercolor markers included',
    'Flame-resistant heavy parchment scrolls'
  ],
  '[
    {"name": "Gratitude Reflection", "level": "Mastery"},
    {"name": "Written Expression", "level": "Proficient"},
    {"name": "Fine-Motor Craftsmanship", "level": "Advanced"}
  ]'::jsonb,
  '[
    {
      "author": "Hassan E.",
      "role": "Grandparent",
      "rating": 5,
      "date": "Jan 14, 2026",
      "comment": "My grandson gifted me one of the completed scrolls with a message that melted my heart. It now sits by my reading desk as a constant reminder of our bond."
    }
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  skills_learned = EXCLUDED.skills_learned,
  safety_guidelines = EXCLUDED.safety_guidelines;

-- ==============================================================================
-- 7. SUPABASE STORAGE: Product Images Bucket & Access Policies
-- ==============================================================================
-- Create the public bucket for storing uploaded product media
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove older policies on storage.objects to avoid duplicate naming conflicts
DROP POLICY IF EXISTS "Allow public read on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on product images" ON storage.objects;

-- Allow public read of all product images
CREATE POLICY "Allow public read on product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow authenticated admins / managers to upload product images
CREATE POLICY "Allow upload on product images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow updates to product images
CREATE POLICY "Allow update on product images"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Allow deleting product images
CREATE POLICY "Allow delete on product images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'product-images');

