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

const LOCAL_STORAGE_KEY = 'abtalquest_blogs_local';

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

const getLocalBlogs = (): BlogPost[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_BLOG_POSTS));
      return DEFAULT_BLOG_POSTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BLOG_POSTS;
  } catch {
    return DEFAULT_BLOG_POSTS;
  }
};

const saveLocalBlogs = (blogs: BlogPost[]): void => {
  try {
    // Strip heavy base64 strings if any exist to protect localStorage quota
    const sanitized = blogs.map((b) => ({
      ...b,
      imageUrl: b.imageUrl?.startsWith('data:') ? undefined : b.imageUrl,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[AbtalQuest BlogService] Error saving to localStorage:', err);
  }
};

const emitBlogUpdateEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('abtalquest_blog_updated'));
  }
};

/**
 * Fetches all blog posts from Supabase (with fallback to local storage / default seed).
 */
export const fetchBlogs = async (options?: {
  onlyPublished?: boolean;
  category?: string;
  search?: string;
}): Promise<BlogPost[]> => {
  if (isSupabaseConfigured()) {
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

      if (!error && data && data.length > 0) {
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

        saveLocalBlogs(blogs);
        return blogs;
      }

      if (error) {
        console.warn('[AbtalQuest BlogService] Supabase fetch error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('[AbtalQuest BlogService] Remote query error, using local cache:', err);
    }
  }

  // Fallback to local storage
  let localBlogs = getLocalBlogs();
  if (options?.onlyPublished) {
    localBlogs = localBlogs.filter((b) => b.isPublished);
  }
  if (options?.category && options.category !== 'all') {
    localBlogs = localBlogs.filter((b) => b.category === options.category);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    localBlogs = localBlogs.filter(
      (b) =>
        b.title.toLowerCase().includes(s) ||
        b.excerpt.toLowerCase().includes(s) ||
        b.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  return localBlogs;
};

/**
 * Fetches a single blog post by its slug or ID
 */
export const fetchBlogBySlug = async (slugOrId: string): Promise<BlogPost | null> => {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (!error && data) {
        return mapRowToBlogPost(data as SupabaseBlogRow);
      }
    } catch (err) {
      console.warn('[AbtalQuest BlogService] Error fetching blog by slug from Supabase:', err);
    }
  }

  const local = getLocalBlogs();
  return local.find((b) => b.slug === slugOrId || b.id === slugOrId) || null;
};

/**
 * Creates a new blog post in Supabase and local storage
 */
export const createBlog = async (input: CreateBlogPostInput): Promise<BlogPost> => {
  const generatedId = `blog-${Date.now()}`;
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title) || generatedId;
  const now = new Date().toISOString();

  const newPost: BlogPost = {
    id: generatedId,
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category.trim() || 'Parenting & Values',
    tags: input.tags || [],
    imageUrl: input.imageUrl?.trim() || undefined,
    authorName: input.authorName.trim() || 'AbtalQuest Editorial Team',
    authorRole: input.authorRole?.trim() || 'Child Development Specialist',
    authorAvatar: input.authorAvatar?.trim() || undefined,
    readTime: input.readTime?.trim() || '5 min read',
    isPublished: input.isPublished ?? true,
    featured: input.featured ?? false,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Insert into Supabase
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .insert({
          id: newPost.id,
          title: newPost.title,
          slug: newPost.slug,
          excerpt: newPost.excerpt,
          content: newPost.content,
          category: newPost.category,
          tags: newPost.tags,
          image_url: newPost.imageUrl || null,
          author_name: newPost.authorName,
          author_role: newPost.authorRole || null,
          author_avatar: newPost.authorAvatar || null,
          read_time: newPost.readTime,
          is_published: newPost.isPublished,
          featured: newPost.featured,
          views_count: 0,
        })
        .select()
        .single();

      if (!error && data) {
        const savedPost = mapRowToBlogPost(data as SupabaseBlogRow);
        const current = getLocalBlogs();
        saveLocalBlogs([savedPost, ...current.filter((b) => b.id !== savedPost.id)]);
        emitBlogUpdateEvent();
        return savedPost;
      }

      if (error) {
        console.warn('[AbtalQuest BlogService] Supabase insert warning:', error.message);
      }
    } catch (err) {
      console.warn('[AbtalQuest BlogService] Remote insert error:', err);
    }
  }

  // 2. Save to local fallback
  const current = getLocalBlogs();
  const updated = [newPost, ...current];
  saveLocalBlogs(updated);
  emitBlogUpdateEvent();
  return newPost;
};

/**
 * Updates an existing blog post in Supabase and local storage
 */
export const updateBlog = async (
  id: string,
  updates: UpdateBlogPostInput
): Promise<BlogPost | null> => {
  const now = new Date().toISOString();

  // 1. Update in Supabase
  if (isSupabaseConfigured()) {
    try {
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

      if (!error && data) {
        const updatedPost = mapRowToBlogPost(data as SupabaseBlogRow);
        const current = getLocalBlogs();
        const updatedList = current.map((b) => (b.id === id ? updatedPost : b));
        saveLocalBlogs(updatedList);
        emitBlogUpdateEvent();
        return updatedPost;
      }

      if (error) {
        console.warn('[AbtalQuest BlogService] Supabase update warning:', error.message);
      }
    } catch (err) {
      console.warn('[AbtalQuest BlogService] Remote update error:', err);
    }
  }

  // 2. Update in local storage
  const current = getLocalBlogs();
  const existingIndex = current.findIndex((b) => b.id === id);
  if (existingIndex === -1) return null;

  const currentItem = current[existingIndex];
  const updatedItem: BlogPost = {
    ...currentItem,
    ...updates,
    slug: updates.slug ? slugify(updates.slug) : currentItem.slug,
    updatedAt: now,
  };

  current[existingIndex] = updatedItem;
  saveLocalBlogs(current);
  emitBlogUpdateEvent();
  return updatedItem;
};

/**
 * Deletes a blog post from Supabase and local storage
 */
export const deleteBlog = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) {
        console.warn('[AbtalQuest BlogService] Supabase delete warning:', error.message);
      }
    } catch (err) {
      console.warn('[AbtalQuest BlogService] Remote delete error:', err);
    }
  }

  const current = getLocalBlogs();
  const filtered = current.filter((b) => b.id !== id);
  saveLocalBlogs(filtered);
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
      throw new Error('Storage Bucket Missing: The "blog-images" bucket does not exist in Supabase. Please run the schema.sql script in your Supabase SQL editor to create it.');
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
 * Increments view count for an article
 */
export const incrementBlogViews = async (id: string): Promise<void> => {
  const current = getLocalBlogs();
  const post = current.find((b) => b.id === id);
  if (post) {
    post.viewsCount = (post.viewsCount || 0) + 1;
    saveLocalBlogs(current);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.rpc('increment_blog_views', { blog_id: id });
    } catch {
      // RPC might not exist, ignore silently
    }
  }
};
