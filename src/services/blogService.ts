import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  isPublished: boolean;
  featured: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime?: string;
  isPublished?: boolean;
  featured?: boolean;
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime?: string;
  isPublished?: boolean;
  featured?: boolean;
}

export interface SupabaseBlogRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[] | null;
  image_url: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;
  read_time: string | null;
  is_published: boolean;
  featured: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_BLOG_CATEGORIES = [
  'Emotional Wellness',
  'Digital Safety',
  'Family Bonding',
  'STEM & Curiosity',
  'Values & Morals',
  'Parenting Tips',
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-resilient-kids',
    title: 'Raising Resilient Kids in the Digital Age',
    slug: 'raising-resilient-kids-digital-age',
    excerpt: 'Discover actionable emotional wellness strategies from child psychologists to help your children thrive amidst digital overload and constant stimulation.',
    content: `In today's hyper-connected environment, children are exposed to unprecedented cognitive stimuli. As parents and educators, nurturing emotional resilience is no longer an optional skill—it is foundational.

### 1. Fostering a Growth Mindset
Children who view challenges as learning opportunities develop psychological fortitude. Instead of praising innate abilities like "you are so smart," praise perseverance: "I noticed how hard you worked to solve that riddle."

### 2. Digital Boundaries & Unplugged Reflection
Set designated screen-free sanctuaries in your home. Replace passive scrolling with tactile problem-solving, board games, or mindful storytelling.

### 3. Emotional Literacy
Give children the vocabulary to name complex feelings. Whether it is frustration, anxiety, or excitement, acknowledging emotions without judgment builds lasting self-regulation.

### 4. Co-Regulation Over Correction
When emotional storms erupt, children mirror their parents' emotional regulation. Taking deep, audible breaths and offering a calm physical presence helps regulate their nervous system before engaging in problem-solving dialogue.`,
    category: 'Emotional Wellness',
    tags: ['parenting', 'resilience', 'screen-free', 'mental-health'],
    imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Dr. Amina Mansour',
    authorRole: 'Child Psychologist',
    readTime: '5 min read',
    isPublished: true,
    featured: true,
    viewsCount: 1420,
    createdAt: '2026-03-14T10:00:00.000Z',
    updatedAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 'blog-digital-safety',
    title: 'Navigating Screen Time & Online Safety with Confidence',
    slug: 'navigating-screen-time-online-safety',
    excerpt: 'Practical insights and family agreements to safeguard young minds against digital vulnerabilities while empowering healthy curiosity.',
    content: `Digital safety begins with proactive dialogue rather than restrictive punishment. When children understand the reasons behind boundaries, they become active guardians of their own wellbeing.

### 1. The Power of Family Technology Agreements
Create a shared pact outlining screen time limits, approved platforms, and guidelines for asking permission before downloading new applications. Involve children in setting these agreements so they feel ownership and agency.

### 2. Identifying Dark Patterns & Manipulative Algorithms
Teach older children to recognize app design tricks engineered to induce addictive loops. Discuss why commercial games push instant gratification and how deliberate mindfulness preserves personal autonomy.

### 3. Cultivating Safe Online Spaces
Prioritize educational, violence-free, and ad-free ecosystems where young minds can explore STEM, art, and values without predatory targeted advertisements.`,
    category: 'Digital Safety',
    tags: ['cyber-safety', 'parenting', 'digital-literacy'],
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Tariq Al-Farooq',
    authorRole: 'Cybersecurity Researcher',
    readTime: '7 min read',
    isPublished: true,
    featured: false,
    viewsCount: 980,
    createdAt: '2026-03-10T14:30:00.000Z',
    updatedAt: '2026-03-10T14:30:00.000Z',
  },
  {
    id: 'blog-family-bonding',
    title: 'The Power of Play: Building Unbreakable Family Bonds',
    slug: 'power-of-play-building-family-bonds',
    excerpt: 'Why unplugged cooperative games and imaginative family challenges foster lifelong empathy, teamwork, and mutual trust.',
    content: `Play is the universal language through which children decipher relationships, ethics, and emotional bonds. Cooperative family play bridges generational divides and reinforces mutual trust.

### 1. Screen-Free Tabletop Adventures
Engaging in tactile quests and collaborative challenges teaches children to communicate effectively under low-stakes pressure. Unlike competitive games where one winner leaves others frustrated, cooperative games celebrate collective triumphs.

### 2. Active Listening Through Storytelling
Shared family reading rituals cultivate profound empathy. Prompting children to evaluate character decisions in moral chronicles develops their innate ethical compass and critical judgment.

### 3. Celebrating Effort Over Perfection
When parents participate alongside children—embracing mistakes with humor and curiosity—children internalize the confidence to tackle real-world challenges without the crippling fear of failure.`,
    category: 'Family Bonding',
    tags: ['family-time', 'cooperative-play', 'empathy', 'values'],
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
    authorName: 'Fatima Zohra',
    authorRole: 'Family Life Coach',
    readTime: '4 min read',
    isPublished: true,
    featured: false,
    viewsCount: 1120,
    createdAt: '2026-03-04T09:15:00.000Z',
    updatedAt: '2026-03-04T09:15:00.000Z',
  },
];

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const mapRowToBlogPost = (row: SupabaseBlogRow): BlogPost => {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category || 'Parenting & Values',
    tags: Array.isArray(row.tags) ? row.tags : [],
    imageUrl: row.image_url || undefined,
    authorName: row.author_name,
    authorRole: row.author_role || undefined,
    authorAvatar: row.author_avatar || undefined,
    readTime: row.read_time || '5 min read',
    isPublished: row.is_published ?? true,
    featured: row.featured ?? false,
    viewsCount: row.views_count ?? 0,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
};

const emitBlogUpdateEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('abtalquest_blog_updated'));
  }
};

/**
 * Real-time synchronization subscription for blog updates across clients.
 * Subscribes to:
 * 1. Supabase Realtime (postgres_changes on public.blogs)
 * 2. Window CustomEvent ('abtalquest_blog_updated') for zero-latency local feedback
 */
export const subscribeToBlogChanges = (onUpdate: () => void): (() => void) => {
  const localHandler = () => onUpdate();
  if (typeof window !== 'undefined') {
    window.addEventListener('abtalquest_blog_updated', localHandler);
  }

  if (!isSupabaseConfigured()) {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('abtalquest_blog_updated', localHandler);
      }
    };
  }

  const channel = supabase
    .channel('realtime_blogs_feed')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'blogs' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('abtalquest_blog_updated', localHandler);
    }
    void supabase.removeChannel(channel);
  };
};

/**
 * Fetches all blog posts directly from Supabase database.
 * No localStorage fallback.
 */
export const fetchBlogs = async (options?: {
  onlyPublished?: boolean;
  category?: string;
  search?: string;
}): Promise<BlogPost[]> => {
  if (!isSupabaseConfigured()) {
    let fallback = [...DEFAULT_BLOG_POSTS];
    if (options?.onlyPublished) fallback = fallback.filter((b) => b.isPublished);
    if (options?.category && options.category !== 'all') {
      fallback = fallback.filter((b) => b.category === options.category);
    }
    if (options?.search) {
      const s = options.search.toLowerCase();
      fallback = fallback.filter((b) => b.title.toLowerCase().includes(s) || b.excerpt.toLowerCase().includes(s));
    }
    return fallback;
  }

  try {
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.onlyPublished) {
      query = query.eq('is_published', true);
    }

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }

    const { data, error } = await query;

    if (error) {
      // If table is not provisioned in Supabase schema (PGRST205), show default seed
      if (error.code === 'PGRST205' || error.message?.includes('not found')) {
        console.warn('[AbtalQuest BlogService] blogs table not found in Supabase. Using default seed articles.');
        let fallback = [...DEFAULT_BLOG_POSTS];
        if (options?.onlyPublished) fallback = fallback.filter((b) => b.isPublished);
        if (options?.category && options.category !== 'all') {
          fallback = fallback.filter((b) => b.category === options.category);
        }
        return fallback;
      }
      console.error('[AbtalQuest BlogService] Supabase fetch error:', error.message);
      throw new Error(`Failed to fetch blogs from database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    const blogs = data.map((row) => mapRowToBlogPost(row as SupabaseBlogRow));

    if (options?.search) {
      const s = options.search.toLowerCase();
      return blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.excerpt.toLowerCase().includes(s) ||
          b.tags.some((t) => t.toLowerCase().includes(s))
      );
    }

    return blogs;
  } catch (err: any) {
    if (err?.message?.includes('PGRST205')) {
      return DEFAULT_BLOG_POSTS;
    }
    throw err;
  }
};

/**
 * Fetches a single blog post by slug or ID directly from Supabase
 */
export const fetchBlogBySlug = async (slugOrId: string): Promise<BlogPost | null> => {
  if (!isSupabaseConfigured()) {
    return DEFAULT_BLOG_POSTS.find((b) => b.slug === slugOrId || b.id === slugOrId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205') {
        return DEFAULT_BLOG_POSTS.find((b) => b.slug === slugOrId || b.id === slugOrId) || null;
      }
      console.error('[AbtalQuest BlogService] Error fetching blog by slug:', error.message);
      return null;
    }

    if (data) {
      return mapRowToBlogPost(data as SupabaseBlogRow);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Creates a new blog post directly in Supabase (Strict Cloud Persistence)
 */
export const createBlog = async (input: CreateBlogPostInput): Promise<BlogPost> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured. Cannot create blog post.');
  }

  const generatedId = `blog-${Date.now()}`;
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title) || generatedId;

  const payload = {
    id: generatedId,
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category.trim() || 'Parenting & Values',
    tags: input.tags || [],
    image_url: input.imageUrl?.trim() || null,
    author_name: input.authorName.trim() || 'AbtalQuest Editorial Team',
    author_role: input.authorRole?.trim() || 'Child Development Specialist',
    author_avatar: input.authorAvatar?.trim() || null,
    read_time: input.readTime?.trim() || '5 min read',
    is_published: input.isPublished ?? true,
    featured: input.featured ?? false,
    views_count: 0,
  };

  const { data, error } = await supabase
    .from('blogs')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[AbtalQuest BlogService] Supabase insert error:', error.message);
    throw new Error(`Failed to save blog post to Supabase: ${error.message}`);
  }

  if (!data) {
    throw new Error('Supabase did not return the created blog post record.');
  }

  const savedPost = mapRowToBlogPost(data as SupabaseBlogRow);
  emitBlogUpdateEvent();
  return savedPost;
};

/**
 * Updates an existing blog post directly in Supabase (Strict Cloud Persistence)
 */
export const updateBlog = async (
  id: string,
  updates: UpdateBlogPostInput
): Promise<BlogPost> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured. Cannot update blog post.');
  }

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    updated_at: now,
  };

  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.slug !== undefined) payload.slug = slugify(updates.slug);
  if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt.trim();
  if (updates.content !== undefined) payload.content = updates.content.trim();
  if (updates.category !== undefined) payload.category = updates.category.trim();
  if (updates.tags !== undefined) payload.tags = updates.tags;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl.trim() || null;
  if (updates.authorName !== undefined) payload.author_name = updates.authorName.trim();
  if (updates.authorRole !== undefined) payload.author_role = updates.authorRole.trim() || null;
  if (updates.authorAvatar !== undefined) payload.author_avatar = updates.authorAvatar.trim() || null;
  if (updates.readTime !== undefined) payload.read_time = updates.readTime.trim();
  if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
  if (updates.featured !== undefined) payload.featured = updates.featured;

  const { data, error } = await supabase
    .from('blogs')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[AbtalQuest BlogService] Supabase update error:', error.message);
    throw new Error(`Failed to update blog post in Supabase: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Blog post with ID "${id}" was not found in Supabase.`);
  }

  const updatedPost = mapRowToBlogPost(data as SupabaseBlogRow);
  emitBlogUpdateEvent();
  return updatedPost;
};

/**
 * Deletes a blog post directly from Supabase (Strict Cloud Persistence)
 */
export const deleteBlog = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured. Cannot delete blog post.');
  }

  const { error } = await supabase.from('blogs').delete().eq('id', id);

  if (error) {
    console.error('[AbtalQuest BlogService] Supabase delete error:', error.message);
    throw new Error(`Failed to delete blog post in Supabase: ${error.message}`);
  }

  emitBlogUpdateEvent();
  return true;
};

/**
 * Uploads a blog cover image to Supabase Storage ('blog-images' bucket)
 */
export const uploadBlogImage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase Storage is not configured. Please paste a public image URL instead of uploading local files.');
  }

  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `covers/${fileName}`;

  // Try uploading to 'blog-images' bucket
  const { error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    // Fallback: try 'product-images' bucket if blog-images is not provisioned yet
    const { error: fallbackError } = await supabase.storage
      .from('product-images')
      .upload(`blogs/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (!fallbackError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(`blogs/${fileName}`);
      if (data?.publicUrl) return data.publicUrl;
    }

    console.error('[AbtalQuest Storage] Blog upload failed:', uploadError);
    if (uploadError.message?.toLowerCase().includes('bucket not found') || (uploadError as any)?.statusCode === '404') {
      throw new Error('Storage Bucket Missing: The "blog-images" bucket does not exist in Supabase. Please run the schema migration in your Supabase SQL editor.');
    }
    throw new Error(`Failed to upload blog image: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('Failed to resolve public URL for uploaded blog image.');
  }

  return data.publicUrl;
};

/**
 * Increments view count for an article in Supabase
 */
export const incrementBlogViews = async (id: string): Promise<void> => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.rpc('increment_blog_views', { blog_id: id });
    } catch {
      // RPC may not exist, ignore silently
    }
  }
};

/**
 * Database health check for the blogs table
 */
export interface BlogsDatabaseHealth {
  configured: boolean;
  tableReady: boolean;
  errorMessage?: string;
  count: number;
}

export const checkBlogsDatabaseHealth = async (): Promise<BlogsDatabaseHealth> => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      tableReady: false,
      errorMessage: 'Supabase credentials are not configured.',
      count: 0,
    };
  }

  try {
    const { count, error } = await supabase
      .from('blogs')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return {
        configured: true,
        tableReady: false,
        errorMessage: error.message,
        count: 0,
      };
    }

    return {
      configured: true,
      tableReady: true,
      count: count || 0,
    };
  } catch (err: any) {
    return {
      configured: true,
      tableReady: false,
      errorMessage: err?.message || 'Database connectivity error.',
      count: 0,
    };
  }
};

/**
 * Copy-paste ready SQL migration to provision the blogs table, RLS, Realtime publication, and storage bucket
 */
export const BLOGS_SCHEMA_SQL = `-- ==============================================================================
-- AbtalQuest: Full Blogs & Storage Bucket Migration
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/sdatbzgyqwxburnsjbax/sql/new)
-- ==============================================================================

-- 1. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Parenting & Values',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'AbtalQuest Editorial Team',
  author_role TEXT DEFAULT 'Child Development Specialist',
  author_avatar TEXT,
  read_time TEXT DEFAULT '5 min read',
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON public.blogs(is_published);

-- 2. ROW LEVEL SECURITY
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin insert on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin update on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin delete on blogs" ON public.blogs;

CREATE POLICY "Allow public read on blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admin insert on blogs" ON public.blogs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update on blogs" ON public.blogs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete on blogs" ON public.blogs FOR DELETE TO anon, authenticated USING (true);

-- 3. REALTIME BROADCAST
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'blogs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.blogs;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- 4. STORAGE BUCKET FOR BLOG IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public read on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on blog images" ON storage.objects;

CREATE POLICY "Allow public read on blog images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'blog-images');
CREATE POLICY "Allow upload on blog images" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'blog-images');
CREATE POLICY "Allow update on blog images" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'blog-images');
CREATE POLICY "Allow delete on blog images" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'blog-images');

-- 5. RPC FOR VIEW COUNT INCREMENT
CREATE OR REPLACE FUNCTION public.increment_blog_views(blog_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.blogs SET views_count = COALESCE(views_count, 0) + 1 WHERE id = blog_id;
END;
$$;

-- 6. GRANT PERMISSIONS & RELOAD SCHEMA CACHE
GRANT ALL ON public.blogs TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';
`;
