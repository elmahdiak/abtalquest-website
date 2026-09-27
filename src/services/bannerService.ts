import { supabase, isSupabaseConfigured } from '../supabaseClient';

export type SlideType = 'image' | 'video';

export interface MarketplaceBanner {
  id: string;
  type: SlideType;
  mediaUrl: string;
  tag?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  planet?: string;
  bgGradient?: string;
  accentColor?: string;
  displayOrder: number;
  isActive: boolean;
  duration?: number; // in seconds (for image auto-advance)
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBannerInput {
  type: SlideType;
  mediaUrl: string;
  tag?: string;
  title: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  planet?: string;
  bgGradient?: string;
  accentColor?: string;
  displayOrder?: number;
  isActive?: boolean;
  duration?: number;
}

export interface BannersDatabaseHealth {
  connected: boolean;
  tableExists: boolean;
  count: number;
  error?: string;
}

const LOCAL_STORAGE_KEY = 'abtalquest_banners_cache';
export const BANNER_UPDATE_EVENT = 'abtalquest_banners_updated';

// Admin Best Size & Format Guidelines
export const BANNER_GUIDELINES = {
  image: {
    recommendedDimensions: '1920x600px',
    aspectRatio: '16:5',
    maxSizeMB: 5,
    maxSizeBytes: 5 * 1024 * 1024,
    formats: ['JPEG', 'PNG', 'WebP'],
    accept: 'image/jpeg,image/png,image/webp,image/avif',
    helperText: 'Recommended Image Size: 1920x600px (16:5 aspect ratio), max 5MB (JPG, PNG, WebP). Ensures sharp display on desktop & mobile.'
  },
  video: {
    recommendedResolution: '1080p horizontal (1920x1080 or 1920x600 crop)',
    maxSizeMB: 15,
    maxSizeBytes: 15 * 1024 * 1024,
    formats: ['MP4', 'WebM'],
    accept: 'video/mp4,video/webm',
    helperText: 'Recommended Video: MP4 or WebM, max 15MB, 1080p horizontal. Plays as an automatically repeating, muted background loop.'
  }
};

export const DEFAULT_BANNERS: MarketplaceBanner[] = [
  {
    id: 'banner_thinkers_1',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    tag: 'Screen-Free Season',
    title: 'Awaken Real Curiosity with Hands-On Engineering',
    description: "Explore the Thinkers' Clockwork Waterwheel and screen-free mechanical kits. 100% sustainably harvested wood.",
    ctaText: 'Shop Thinkers Kits',
    ctaLink: 'thinkers',
    planet: 'thinkers',
    bgGradient: 'from-[#016ba5] via-[#0284c7] to-[#0369a1]',
    accentColor: '#016ba5',
    displayOrder: 1,
    isActive: true,
    duration: 5,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'banner_video_mission_2',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1610-large.mp4',
    tag: 'Dynamic Video Mission',
    title: 'Explore the Infinite AbtalQuest Multiverse',
    description: 'Watch young heroes embark on STEM challenges across uncharted planets. Screen-free adventure meets cinematic wonder.',
    ctaText: 'Explore Planetary Kits',
    ctaLink: 'solvers',
    planet: 'solvers',
    bgGradient: 'from-[#0284c7] via-[#0369a1] to-[#0c4a6e]',
    accentColor: '#0284c7',
    displayOrder: 2,
    isActive: true,
    duration: 6,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 'banner_heart_coop_3',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=1920&q=80',
    tag: 'Cooperative Family Play',
    title: 'Cooperative Board Games that Cultivate Empathy',
    description: 'No losers, only shared triumph. Help the whole oasis village flourish together with The Caravan of Kindness.',
    ctaText: 'Explore Family Games',
    ctaLink: 'heart',
    planet: 'heart',
    bgGradient: 'from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]',
    accentColor: '#7C3AED',
    displayOrder: 3,
    isActive: true,
    duration: 5,
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 'banner_brave_trail_4',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1920&q=80',
    tag: 'Outdoor Fortitude',
    title: 'Real Explorers Brave the Open Trail',
    description: 'Solid brass compasses, weather observation journals, and mindfulness sand-timers built for resilience.',
    ctaText: 'Gear Up for Adventure',
    ctaLink: 'brave',
    planet: 'brave',
    bgGradient: 'from-[#fa8221] via-[#e87313] to-[#c25e0a]',
    accentColor: '#fa8221',
    displayOrder: 4,
    isActive: true,
    duration: 5,
    createdAt: '2026-01-04T00:00:00Z',
  },
];

/**
 * Load banners from localStorage cache
 */
export const getStoredBanners = (): MarketplaceBanner[] => {
  if (typeof window === 'undefined') return DEFAULT_BANNERS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
      return DEFAULT_BANNERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BANNERS;
  } catch {
    return DEFAULT_BANNERS;
  }
};

/**
 * Save banners to localStorage cache and notify subscribers
 */
export const saveStoredBanners = (banners: MarketplaceBanner[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new CustomEvent(BANNER_UPDATE_EVENT, { detail: banners }));
  } catch (err) {
    console.warn('[Banners] Failed to save to localStorage:', err);
  }
};

/**
 * Map Supabase DB row to MarketplaceBanner model
 */
const mapRowToBanner = (row: any): MarketplaceBanner => ({
  id: row.id,
  type: (row.type === 'video' ? 'video' : 'image') as SlideType,
  mediaUrl: row.media_url || row.mediaUrl || '',
  tag: row.tag || '',
  title: row.title || '',
  description: row.description || '',
  ctaText: row.cta_text || row.ctaText || 'Explore Now',
  ctaLink: row.cta_link || row.ctaLink || '#marketplace',
  planet: row.planet || '',
  bgGradient: row.bg_gradient || row.bgGradient || 'from-[#016ba5] via-[#0284c7] to-[#0369a1]',
  accentColor: row.accent_color || row.accentColor || '#016ba5',
  displayOrder: Number(row.display_order ?? row.displayOrder ?? 0),
  isActive: Boolean(row.is_active ?? row.isActive ?? true),
  duration: Number(row.duration ?? 5),
  createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  updatedAt: row.updated_at || row.updatedAt,
});

/**
 * Fetch all marketplace banners (Supabase with localStorage fallback)
 */
export const fetchBanners = async (): Promise<MarketplaceBanner[]> => {
  if (!isSupabaseConfigured()) {
    return getStoredBanners().sort((a, b) => a.displayOrder - b.displayOrder);
  }

  try {
    const { data, error } = await supabase
      .from('marketplace_banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error && !error.message?.includes('does not exist')) {
        console.warn('[Banners] Supabase fetch notice:', error.message);
      }
      return getStoredBanners().sort((a, b) => a.displayOrder - b.displayOrder);
    }

    const banners = data.map(mapRowToBanner);
    saveStoredBanners(banners);
    return banners;
  } catch (err) {
    console.warn('[Banners] Error fetching banners, returning cache:', err);
    return getStoredBanners().sort((a, b) => a.displayOrder - b.displayOrder);
  }
};

/**
 * Upload banner media file (Image or Video) to Supabase Storage ('banner-media' or 'product-images')
 */
export const uploadBannerMedia = async (
  file: File,
  type: SlideType
): Promise<string> => {
  // Validate file size against guidelines
  if (type === 'image' && file.size > BANNER_GUIDELINES.image.maxSizeBytes) {
    throw new Error(`Image exceeds the maximum recommended size of ${BANNER_GUIDELINES.image.maxSizeMB}MB. Please compress or resize the image before uploading.`);
  }

  if (type === 'video' && file.size > BANNER_GUIDELINES.video.maxSizeBytes) {
    throw new Error(`Video exceeds the maximum recommended size of ${BANNER_GUIDELINES.video.maxSizeMB}MB. Please compress the video to ensure fast playback and seamless looping.`);
  }

  if (!isSupabaseConfigured()) {
    // Return local object URL for offline/mock mode
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read local file preview.'));
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split('.').pop() || (type === 'video' ? 'mp4' : 'jpg');
  const fileName = `banner_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `banners/${fileName}`;

  // Try 'banner-media' bucket first
  let { error: uploadError } = await supabase.storage
    .from('banner-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  // Self-heal: If bucket doesn't exist, try creating 'banner-media' or fall back to 'product-images'
  if (uploadError && (uploadError.message?.toLowerCase().includes('bucket not found') || (uploadError as any)?.statusCode === '404')) {
    try {
      await supabase.storage.createBucket('banner-media', {
        public: true,
        fileSizeLimit: 31457280, // 30MB
      });

      const retryResult = await supabase.storage
        .from('banner-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });
      uploadError = retryResult.error;
    } catch {
      // Fallback to product-images
      const fallbackResult = await supabase.storage
        .from('product-images')
        .upload(`banners/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (!fallbackResult.error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(`banners/${fileName}`);
        if (data?.publicUrl) return data.publicUrl;
      }
    }
  }

  if (uploadError) {
    console.error('[Banners] Upload error:', uploadError);
    // If remote storage fails due to permissions or quota, fallback to data URL gracefully
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  const { data } = supabase.storage.from('banner-media').getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error('Could not resolve public URL for uploaded banner media.');
  }

  return data.publicUrl;
};

/**
 * Create a new banner slide
 */
export const createBanner = async (input: CreateBannerInput): Promise<MarketplaceBanner> => {
  const current = getStoredBanners();
  const nextOrder = input.displayOrder ?? (current.length > 0 ? Math.max(...current.map(b => b.displayOrder)) + 1 : 1);
  const now = new Date().toISOString();
  const newId = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newBanner: MarketplaceBanner = {
    id: newId,
    type: input.type,
    mediaUrl: input.mediaUrl,
    tag: input.tag?.trim() || '',
    title: input.title.trim(),
    description: input.description?.trim() || '',
    ctaText: input.ctaText?.trim() || 'Explore Now',
    ctaLink: input.ctaLink?.trim() || '#marketplace',
    planet: input.planet?.trim() || '',
    bgGradient: input.bgGradient || 'from-[#016ba5] via-[#0284c7] to-[#0369a1]',
    accentColor: input.accentColor || '#016ba5',
    displayOrder: nextOrder,
    isActive: input.isActive ?? true,
    duration: input.duration ?? 5,
    createdAt: now,
    updatedAt: now,
  };

  // Sync to Supabase if available
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('marketplace_banners').insert({
        id: newBanner.id,
        type: newBanner.type,
        media_url: newBanner.mediaUrl,
        tag: newBanner.tag,
        title: newBanner.title,
        description: newBanner.description,
        cta_text: newBanner.ctaText,
        cta_link: newBanner.ctaLink,
        planet: newBanner.planet,
        bg_gradient: newBanner.bgGradient,
        accent_color: newBanner.accentColor,
        display_order: newBanner.displayOrder,
        is_active: newBanner.isActive,
        duration: newBanner.duration,
        created_at: newBanner.createdAt,
        updated_at: newBanner.updatedAt,
      });
    } catch (err) {
      console.warn('[Banners] Supabase insert notice:', err);
    }
  }

  const updatedList = [...current, newBanner].sort((a, b) => a.displayOrder - b.displayOrder);
  saveStoredBanners(updatedList);
  return newBanner;
};

/**
 * Update an existing banner slide
 */
export const updateBanner = async (
  id: string,
  updates: Partial<CreateBannerInput>
): Promise<MarketplaceBanner> => {
  const current = getStoredBanners();
  const index = current.findIndex(b => b.id === id);
  if (index === -1) {
    throw new Error('Banner slide not found.');
  }

  const now = new Date().toISOString();
  const updatedBanner: MarketplaceBanner = {
    ...current[index],
    ...updates,
    updatedAt: now,
  };

  // Sync to Supabase if available
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('marketplace_banners').update({
        type: updatedBanner.type,
        media_url: updatedBanner.mediaUrl,
        tag: updatedBanner.tag,
        title: updatedBanner.title,
        description: updatedBanner.description,
        cta_text: updatedBanner.ctaText,
        cta_link: updatedBanner.ctaLink,
        planet: updatedBanner.planet,
        bg_gradient: updatedBanner.bgGradient,
        accent_color: updatedBanner.accentColor,
        display_order: updatedBanner.displayOrder,
        is_active: updatedBanner.isActive,
        duration: updatedBanner.duration,
        updated_at: now,
      }).eq('id', id);
    } catch (err) {
      console.warn('[Banners] Supabase update notice:', err);
    }
  }

  current[index] = updatedBanner;
  saveStoredBanners(current.sort((a, b) => a.displayOrder - b.displayOrder));
  return updatedBanner;
};

/**
 * Toggle active visibility of a banner slide
 */
export const toggleBannerActive = async (id: string, isActive: boolean): Promise<void> => {
  await updateBanner(id, { isActive });
};

/**
 * Reorder banners by their ID sequence
 */
export const reorderBanners = async (orderedIds: string[]): Promise<void> => {
  const current = getStoredBanners();
  const updated = current.map(banner => {
    const newIdx = orderedIds.indexOf(banner.id);
    return newIdx !== -1 ? { ...banner, displayOrder: newIdx + 1 } : banner;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  saveStoredBanners(updated);

  if (isSupabaseConfigured()) {
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        await supabase
          .from('marketplace_banners')
          .update({ display_order: i + 1 })
          .eq('id', orderedIds[i]);
      }
    } catch (err) {
      console.warn('[Banners] Supabase reorder notice:', err);
    }
  }
};

/**
 * Delete a banner slide
 */
export const deleteBanner = async (id: string): Promise<void> => {
  const current = getStoredBanners();
  const filtered = current.filter(b => b.id !== id);
  saveStoredBanners(filtered);

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('marketplace_banners').delete().eq('id', id);
    } catch (err) {
      console.warn('[Banners] Supabase delete notice:', err);
    }
  }
};

/**
 * Subscribe to banner updates across tabs or realtime Supabase
 */
export const subscribeToBannerChanges = (
  callback: (banners: MarketplaceBanner[]) => void
) => {
  const handleUpdate = () => {
    callback(getStoredBanners().sort((a, b) => a.displayOrder - b.displayOrder));
  };

  window.addEventListener(BANNER_UPDATE_EVENT, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  let supabaseChannel: any = null;
  if (isSupabaseConfigured()) {
    try {
      supabaseChannel = supabase
        .channel('marketplace_banners_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'marketplace_banners' },
          async () => {
            const fresh = await fetchBanners();
            callback(fresh);
          }
        )
        .subscribe();
    } catch {
      // Fallback to local listener
    }
  }

  return {
    unsubscribe: () => {
      window.removeEventListener(BANNER_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (supabaseChannel) {
        supabaseChannel.unsubscribe();
      }
    },
  };
};

/**
 * Database health check for banners table
 */
export const checkBannersDatabaseHealth = async (): Promise<BannersDatabaseHealth> => {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      tableExists: false,
      count: getStoredBanners().length,
      error: 'Supabase credentials not configured in environment',
    };
  }

  try {
    const { count, error } = await supabase
      .from('marketplace_banners')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return {
        connected: true,
        tableExists: false,
        count: 0,
        error: error.message,
      };
    }

    return {
      connected: true,
      tableExists: true,
      count: count ?? 0,
    };
  } catch (err) {
    return {
      connected: false,
      tableExists: false,
      count: 0,
      error: err instanceof Error ? err.message : 'Database check failed',
    };
  }
};

export const BANNERS_SCHEMA_SQL = `-- ==============================================================================
-- AbtalQuest: Marketplace Banners Table & Storage Media Setup
-- ==============================================================================

-- 1. Create table for marketplace carousel banners
CREATE TABLE IF NOT EXISTS public.marketplace_banners (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
  media_url TEXT NOT NULL,
  tag TEXT,
  title TEXT NOT NULL,
  description TEXT,
  cta_text TEXT DEFAULT 'Explore Now',
  cta_link TEXT DEFAULT '#marketplace',
  planet TEXT,
  bg_gradient TEXT DEFAULT 'from-[#016ba5] via-[#0284c7] to-[#0369a1]',
  accent_color TEXT DEFAULT '#016ba5',
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  duration INTEGER DEFAULT 5, -- in seconds for image auto-advance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security (RLS)
ALTER TABLE public.marketplace_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on marketplace_banners" ON public.marketplace_banners;
DROP POLICY IF EXISTS "Allow public insert on marketplace_banners" ON public.marketplace_banners;
DROP POLICY IF EXISTS "Allow public update on marketplace_banners" ON public.marketplace_banners;
DROP POLICY IF EXISTS "Allow public delete on marketplace_banners" ON public.marketplace_banners;

CREATE POLICY "Allow public read on marketplace_banners"
  ON public.marketplace_banners FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public insert on marketplace_banners"
  ON public.marketplace_banners FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow public update on marketplace_banners"
  ON public.marketplace_banners FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on marketplace_banners"
  ON public.marketplace_banners FOR DELETE TO anon, authenticated USING (true);

-- 3. Storage bucket for banner media (Images & Video loops)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banner-media',
  'banner-media',
  true,
  31457280, -- 30MB for short video loops & high-res banners
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 31457280,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'];

-- Storage object policies
DROP POLICY IF EXISTS "Allow public read on banner-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload on banner-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on banner-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on banner-media" ON storage.objects;

CREATE POLICY "Allow public read on banner-media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'banner-media');

CREATE POLICY "Allow upload on banner-media"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'banner-media');

CREATE POLICY "Allow update on banner-media"
  ON storage.objects FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'banner-media')
  WITH CHECK (bucket_id = 'banner-media');

CREATE POLICY "Allow delete on banner-media"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'banner-media');
`;
