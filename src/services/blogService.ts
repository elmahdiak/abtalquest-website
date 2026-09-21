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
  author?: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime: string;
  isPublished: boolean;
  featured: boolean;
  viewsCount: number;
  publishedAt?: string;
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
  author?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime?: string;
  isPublished?: boolean;
  featured?: boolean;
  publishedAt?: string;
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  author?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  readTime?: string;
  isPublished?: boolean;
  featured?: boolean;
  publishedAt?: string;
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
  author?: string | null;
  author_name: string;
  author_role: string | null;
  author_avatar: string | null;
  read_time: string | null;
  published_at?: string | null;
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
    title: 'How to Raise Emotionally Resilient Kids',
    slug: 'how-to-raise-emotionally-resilient-kids',
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
    author: 'Dr. Amina Mansour',
    authorName: 'Dr. Amina Mansour',
    authorRole: 'Child Psychologist',
    readTime: '5 min read',
    isPublished: true,
    featured: true,
    viewsCount: 1420,
    publishedAt: '2026-03-14T10:00:00.000Z',
    createdAt: '2026-03-14T10:00:00.000Z',
    updatedAt: '2026-03-14T10:00:00.000Z',
  },
  {
    id: 'blog-digital-safety',
    title: 'Digital Dangers: What You Need to Know',
    slug: 'digital-dangers-what-you-need-to-know',
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
    author: 'Tariq Al-Farooq',
    authorName: 'Tariq Al-Farooq',
    authorRole: 'Cybersecurity Researcher',
    readTime: '7 min read',
    isPublished: true,
    featured: false,
    viewsCount: 980,
    publishedAt: '2026-03-10T14:30:00.000Z',
    createdAt: '2026-03-10T14:30:00.000Z',
    updatedAt: '2026-03-10T14:30:00.000Z',
  },
  {
    id: 'blog-family-bonding',
    title: 'Fun Habits to Try with Your Kids',
    slug: 'fun-habits-to-try-with-your-kids',
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
    author: 'Fatima Zohra',
    authorName: 'Fatima Zohra',
    authorRole: 'Family Life Coach',
    readTime: '4 min read',
    isPublished: true,
    featured: false,
    viewsCount: 1120,
    publishedAt: '2026-03-04T09:15:00.000Z',
    createdAt: '2026-03-04T09:15:00.000Z',
    updatedAt: '2026-03-04T09:15:00.000Z',
  },
];

const LOCAL_BLOGS_KEY = 'abtalquest_blogs_local';

/**
 * Retrieves cached blogs from localStorage with initial default seeds
 */
const getLocalBlogs = (): BlogPost[] => {
  if (typeof window === 'undefined') return [...DEFAULT_BLOG_POSTS];
  try {
    const raw = localStorage.getItem(LOCAL_BLOGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(DEFAULT_BLOG_POSTS));
      return [...DEFAULT_BLOG_POSTS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [...DEFAULT_BLOG_POSTS];
  } catch {
    return [...DEFAULT_BLOG_POSTS];
  }
};

/**
 * Saves blogs to local storage cache
 */
const saveLocalBlogs = (blogs: BlogPost[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(blogs));
  } catch {
    // Ignore storage quota or disabled storage
  }
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const mapRowToBlogPost = (row: SupabaseBlogRow): BlogPost => {
  const authorName = row.author_name || row.author || 'AbtalQuest Editorial Team';
  const createdAt = row.created_at || row.published_at || new Date().toISOString();
  const publishedAt = row.published_at || row.created_at || createdAt;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category || 'Parenting & Values',
    tags: Array.isArray(row.tags) ? row.tags : [],
    imageUrl: row.image_url || undefined,
    author: authorName,
    authorName,
    authorRole: row.author_role || undefined,
    authorAvatar: row.author_avatar || undefined,
    readTime: row.read_time || '5 min read',
    isPublished: row.is_published ?? true,
    featured: row.featured ?? false,
    viewsCount: row.views_count ?? 0,
    publishedAt,
    createdAt,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
};

/**
 * Multi-channel broadcast dispatcher:
 * 1. Window CustomEvent ('abtalquest_blog_updated') for intra-window UI components
 * 2. Storage timestamp for multi-tab synchronization on the same browser
 * 3. BroadcastChannel ('abtalquest_blogs_sync') for instant inter-tab communication
 */
const emitBlogUpdateEvent = () => {
  if (typeof window !== 'undefined') {
    // 1. Same-window custom event
    window.dispatchEvent(new CustomEvent('abtalquest_blog_updated'));

    // 2. Storage event
    try {
      localStorage.setItem('abtalquest_blog_last_updated', Date.now().toString());
    } catch {
      // Ignore
    }

    // 3. BroadcastChannel
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('abtalquest_blogs_sync');
        bc.postMessage({ type: 'BLOG_UPDATED', timestamp: Date.now() });
        bc.close();
      }
    } catch {
      // Ignore
    }
  }
};

/**
 * Real-time synchronization subscription for blog updates across all clients and devices:
 * - Supabase Realtime (postgres_changes on public.blogs)
 * - BroadcastChannel ('abtalquest_blogs_sync')
 * - Window StorageEvent ('storage')
 * - Window CustomEvent ('abtalquest_blog_updated')
 */
export const subscribeToBlogChanges = (onUpdate: () => void): (() => void) => {
  const localHandler = () => onUpdate();
  const storageHandler = (e: StorageEvent) => {
    if (e.key === 'abtalquest_blog_last_updated' || e.key === LOCAL_BLOGS_KEY) {
      onUpdate();
    }
  };

  let broadcastChannel: BroadcastChannel | null = null;
  if (typeof window !== 'undefined') {
    window.addEventListener('abtalquest_blog_updated', localHandler);
    window.addEventListener('storage', storageHandler);

    if ('BroadcastChannel' in window) {
      try {
        broadcastChannel = new BroadcastChannel('abtalquest_blogs_sync');
        broadcastChannel.onmessage = () => {
          onUpdate();
        };
      } catch {
        broadcastChannel = null;
      }
    }
  }

  if (!isSupabaseConfigured()) {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('abtalquest_blog_updated', localHandler);
        window.removeEventListener('storage', storageHandler);
        broadcastChannel?.close();
      }
    };
  }

  // Generate unique channel identifier per subscriber instance to avoid unmount collisions
  const channelId = `realtime_blogs_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const channel = supabase
    .channel(channelId)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'blogs' },
      () => {
        onUpdate();
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Automatically sync on initial subscription or network reconnection
        onUpdate();
      }
    });

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('abtalquest_blog_updated', localHandler);
      window.removeEventListener('storage', storageHandler);
      broadcastChannel?.close();
    }
    void supabase.removeChannel(channel);
  };
};

/**
 * Fetches all blog posts from Supabase database with resilient fallback caching
 */
export const fetchBlogs = async (options?: {
  onlyPublished?: boolean;
  category?: string;
  search?: string;
}): Promise<BlogPost[]> => {
  if (!isSupabaseConfigured()) {
    let fallback = getLocalBlogs();
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
      // If table is not provisioned in Supabase schema (PGRST205), use local fallback
      if (error.code === 'PGRST205' || error.message?.includes('not found')) {
        console.warn('[AbtalQuest BlogService] Remote "blogs" table pending setup. Using local cache.');
        let fallback = getLocalBlogs();
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
      console.error('[AbtalQuest BlogService] Supabase fetch error:', error.message);
      throw new Error(`Failed to fetch blogs from database: ${error.message}`);
    }

    if (!data || data.length === 0) {
      // If table exists but is empty, check if we have local drafts or return empty
      return [];
    }

    const blogs = data.map((row) => mapRowToBlogPost(row as SupabaseBlogRow));

    // Update local cache with latest data
    if (!options?.onlyPublished && !options?.category && !options?.search) {
      saveLocalBlogs(blogs);
    }

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
      return getLocalBlogs();
    }
    throw err;
  }
};

/**
 * Fetches a single blog post by slug or ID
 */
export const fetchBlogBySlug = async (slugOrId: string): Promise<BlogPost | null> => {
  if (!isSupabaseConfigured()) {
    return getLocalBlogs().find((b) => b.slug === slugOrId || b.id === slugOrId) || null;
  }

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205') {
        return getLocalBlogs().find((b) => b.slug === slugOrId || b.id === slugOrId) || null;
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
 * Creates a new blog post directly in Supabase (with resilient local cache sync)
 */
export const createBlog = async (input: CreateBlogPostInput): Promise<BlogPost> => {
  const generatedId = `blog-${Date.now()}`;
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title) || generatedId;
  const author = input.authorName?.trim() || input.author?.trim() || 'AbtalQuest Editorial Team';
  const now = new Date().toISOString();

  const payload = {
    id: generatedId,
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category.trim() || 'Parenting & Values',
    tags: input.tags || [],
    image_url: input.imageUrl?.trim() || null,
    author,
    author_name: author,
    author_role: input.authorRole?.trim() || 'Child Development Specialist',
    author_avatar: input.authorAvatar?.trim() || null,
    read_time: input.readTime?.trim() || '5 min read',
    published_at: input.publishedAt || now,
    is_published: input.isPublished ?? true,
    featured: input.featured ?? false,
    views_count: 0,
    created_at: now,
    updated_at: now,
  };

  const fallbackPost: BlogPost = {
    id: payload.id,
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    tags: payload.tags,
    imageUrl: payload.image_url || undefined,
    author,
    authorName: author,
    authorRole: payload.author_role || undefined,
    authorAvatar: payload.author_avatar || undefined,
    readTime: payload.read_time,
    publishedAt: payload.published_at,
    isPublished: payload.is_published,
    featured: payload.featured,
    viewsCount: 0,
    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };

  let savedPost: BlogPost;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert(payload)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('not found')) {
          console.warn('[AbtalQuest BlogService] Remote table not found. Storing locally.');
          savedPost = fallbackPost;
        } else {
          console.error('[AbtalQuest BlogService] Supabase insert error:', error.message);
          throw new Error(`Failed to save blog post to Supabase: ${error.message}`);
        }
      } else if (data) {
        savedPost = mapRowToBlogPost(data as SupabaseBlogRow);
      } else {
        throw new Error('Supabase did not return the created blog post record.');
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to save blog post to Supabase')) {
        throw err;
      }
      // Fallback local persistence
      savedPost = fallbackPost;
    }
  } else {
    savedPost = fallbackPost;
  }

  // Update local cache
  const local = getLocalBlogs().filter((b) => b.id !== savedPost.id);
  saveLocalBlogs([savedPost, ...local]);

  emitBlogUpdateEvent();
  return savedPost;
};

/**
 * Updates an existing blog post directly in Supabase (with resilient local cache sync)
 */
export const updateBlog = async (
  id: string,
  updates: UpdateBlogPostInput
): Promise<BlogPost> => {
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
  if (updates.authorName !== undefined || updates.author !== undefined) {
    const a = updates.authorName?.trim() || updates.author?.trim() || 'AbtalQuest Editorial Team';
    payload.author_name = a;
    payload.author = a;
  }
  if (updates.authorRole !== undefined) payload.author_role = updates.authorRole.trim() || null;
  if (updates.authorAvatar !== undefined) payload.author_avatar = updates.authorAvatar.trim() || null;
  if (updates.readTime !== undefined) payload.read_time = updates.readTime.trim();
  if (updates.publishedAt !== undefined) payload.published_at = updates.publishedAt;
  if (updates.isPublished !== undefined) payload.is_published = updates.isPublished;
  if (updates.featured !== undefined) payload.featured = updates.featured;

  let updatedPost: BlogPost;

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('not found')) {
          console.warn('[AbtalQuest BlogService] Remote table not found. Updating locally.');
          const currentLocal = getLocalBlogs();
          const target = currentLocal.find((b) => b.id === id);
          if (!target) throw new Error(`Blog post with ID "${id}" was not found.`);
          updatedPost = {
            ...target,
            ...updates,
            authorName: updates.authorName || updates.author || target.authorName,
            updatedAt: now,
          };
        } else {
          console.error('[AbtalQuest BlogService] Supabase update error:', error.message);
          throw new Error(`Failed to update blog post in Supabase: ${error.message}`);
        }
      } else if (data) {
        updatedPost = mapRowToBlogPost(data as SupabaseBlogRow);
      } else {
        throw new Error(`Blog post with ID "${id}" was not found in Supabase.`);
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to update blog post in Supabase')) {
        throw err;
      }
      const currentLocal = getLocalBlogs();
      const target = currentLocal.find((b) => b.id === id);
      if (!target) throw new Error(`Blog post with ID "${id}" was not found.`);
      updatedPost = {
        ...target,
        ...updates,
        authorName: updates.authorName || updates.author || target.authorName,
        updatedAt: now,
      };
    }
  } else {
    const currentLocal = getLocalBlogs();
    const target = currentLocal.find((b) => b.id === id);
    if (!target) throw new Error(`Blog post with ID "${id}" was not found.`);
    updatedPost = {
      ...target,
      ...updates,
      authorName: updates.authorName || updates.author || target.authorName,
      updatedAt: now,
    };
  }

  // Update local cache
  const local = getLocalBlogs().map((b) => (b.id === id ? updatedPost : b));
  saveLocalBlogs(local);

  emitBlogUpdateEvent();
  return updatedPost;
};

/**
 * Deletes a blog post directly from Supabase (with resilient local cache sync)
 */
export const deleteBlog = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error && error.code !== 'PGRST205' && !error.message?.includes('not found')) {
        console.error('[AbtalQuest BlogService] Supabase delete error:', error.message);
        throw new Error(`Failed to delete blog post in Supabase: ${error.message}`);
      }
    } catch (err: any) {
      if (err?.message?.includes('Failed to delete blog post in Supabase')) {
        throw err;
      }
    }
  }

  // Remove from local cache
  const local = getLocalBlogs().filter((b) => b.id !== id);
  saveLocalBlogs(local);

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
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Parenting & Values',
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  author TEXT,
  author_name TEXT NOT NULL DEFAULT 'AbtalQuest Editorial Team',
  author_role TEXT DEFAULT 'Child Development Specialist',
  author_avatar TEXT,
  read_time TEXT DEFAULT '5 min read',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all columns exist for existing installations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'author') THEN
    ALTER TABLE public.blogs ADD COLUMN author TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'published_at') THEN
    ALTER TABLE public.blogs ADD COLUMN published_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'views_count') THEN
    ALTER TABLE public.blogs ADD COLUMN views_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'featured') THEN
    ALTER TABLE public.blogs ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. ROW LEVEL SECURITY
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Full replica identity for real-time UPDATE and DELETE payloads
ALTER TABLE public.blogs REPLICA IDENTITY FULL;

DROP POLICY IF EXISTS "Allow public read on published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow public read on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin insert on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin update on blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admin delete on blogs" ON public.blogs;

CREATE POLICY "Allow public read on blogs" ON public.blogs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow admin insert on blogs" ON public.blogs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow admin update on blogs" ON public.blogs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin delete on blogs" ON public.blogs FOR DELETE TO anon, authenticated USING (true);

-- Indices
CREATE UNIQUE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_created ON public.blogs(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON public.blogs(is_published);

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

-- 6. SEED DEFAULT OFFICIAL ARTICLES
INSERT INTO public.blogs (
  id, title, slug, excerpt, content, category, tags, image_url, author, author_name, author_role, read_time, is_published, featured, views_count
) VALUES
(
  'blog-resilient-kids',
  'Raising Resilient Kids in the Digital Age',
  'raising-resilient-kids-digital-age',
  'Discover actionable emotional wellness strategies from child psychologists to help your children thrive amidst digital overload and constant stimulation.',
  'In today''s hyper-connected environment, children are exposed to unprecedented cognitive stimuli. As parents and educators, nurturing emotional resilience is no longer an optional skill—it is foundational.

### 1. Fostering a Growth Mindset
Children who view challenges as learning opportunities develop psychological fortitude. Instead of praising innate abilities like "you are so smart," praise perseverance: "I noticed how hard you worked to solve that riddle."

### 2. Digital Boundaries & Unplugged Reflection
Set designated screen-free sanctuaries in your home. Replace passive scrolling with tactile problem-solving, board games, or mindful storytelling.

### 3. Emotional Literacy
Give children the vocabulary to name complex feelings. Whether it is frustration, anxiety, or excitement, acknowledging emotions without judgment builds lasting self-regulation.',
  'Emotional Wellness',
  ARRAY['parenting', 'resilience', 'screen-free', 'mental-health'],
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80',
  'Dr. Amina Mansour',
  'Dr. Amina Mansour',
  'Child Psychologist',
  '5 min read',
  true,
  true,
  1420
),
(
  'blog-digital-safety',
  'Navigating Screen Time & Online Safety with Confidence',
  'navigating-screen-time-online-safety',
  'Practical insights and family agreements to safeguard young minds against digital vulnerabilities while empowering healthy curiosity.',
  'Digital safety begins with proactive dialogue rather than restrictive punishment. When children understand the reasons behind boundaries, they become active guardians of their own wellbeing.

### 1. The Power of Family Technology Agreements
Create a shared pact outlining screen time limits, approved platforms, and guidelines for asking permission before downloading new applications. Involve children in setting these agreements so they feel ownership and agency.

### 2. Identifying Dark Patterns & Manipulative Algorithms
Teach older children to recognize app design tricks engineered to induce addictive loops. Discuss why games push instant gratification and how mindfulness preserves autonomy.

### 3. Cultivating Safe Online Spaces
Prioritize educational, violence-free, and ad-free ecosystems where young minds can explore STEM, art, and values without predatory targeted advertisements.',
  'Digital Safety',
  ARRAY['cyber-safety', 'parenting', 'digital-literacy'],
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  'Tariq Al-Farooq',
  'Tariq Al-Farooq',
  'Cybersecurity Researcher',
  '7 min read',
  true,
  false,
  980
),
(
  'blog-family-bonding',
  'The Power of Play: Building Unbreakable Family Bonds',
  'power-of-play-building-family-bonds',
  'Why unplugged cooperative games and imaginative family challenges foster lifelong empathy, teamwork, and mutual trust.',
  'Play is the universal language through which children decipher relationships, ethics, and emotional bonds. Cooperative family play bridges generational divides and reinforces mutual trust.

### 1. Screen-Free Tabletop Adventures
Engaging in tactile quests and collaborative challenges teaches children to communicate effectively under low-stakes pressure. Unlike competitive games where one winner leaves others frustrated, cooperative games celebrate collective triumphs.

### 2. Active Listening Through Storytelling
Shared family reading rituals cultivate profound empathy. Prompting children to evaluate character decisions in moral chronicles develops their innate ethical compass and critical judgment.

### 3. Celebrating Effort Over Perfection
When parents participate alongside children—embracing mistakes with humor and curiosity—children internalize the confidence to tackle real-world challenges without the crippling fear of failure.',
  'Family Bonding',
  ARRAY['family-time', 'cooperative-play', 'empathy', 'values'],
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
  'Fatima Zohra',
  'Fatima Zohra',
  'Family Life Coach',
  '4 min read',
  true,
  false,
  1120
)
ON CONFLICT (id) DO NOTHING;

-- 7. GRANT PERMISSIONS & RELOAD SCHEMA CACHE
GRANT ALL ON public.blogs TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';
`;
