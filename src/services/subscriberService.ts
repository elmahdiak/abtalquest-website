/**
 * AbtalQuest Explorer Club & Newsletter Subscriber Service
 * Handles persistence to Supabase PostgreSQL `public.subscribers` table,
 * email validation, duplicate prevention, and CSV exports for the Admin Dashboard.
 */

import { supabase, isSupabaseConfigured } from '../supabaseClient';

export interface Subscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = 'abtalquest_subscribers_cache';

/**
 * Idempotent SQL script for provisioning public.subscribers in Supabase SQL Editor
 */
export const SUBSCRIBERS_SCHEMA_SQL = `-- 1. Create Subscribers table for Explorer Club
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'explorer_club',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Case-insensitive unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email_lower 
  ON public.subscribers (LOWER(email));

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- 4. Clean existing policies
DROP POLICY IF EXISTS "Allow anon insert on subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow admin read on subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow admin delete on subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow admin update on subscribers" ON public.subscribers;

-- 5. Set up RLS policies
CREATE POLICY "Allow anon insert on subscribers"
  ON public.subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow admin read on subscribers"
  ON public.subscribers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin delete on subscribers"
  ON public.subscribers FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin update on subscribers"
  ON public.subscribers FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Grant permissions & reload schema cache
GRANT ALL ON public.subscribers TO anon, authenticated, service_role;
NOTIFY pgrst, 'reload schema';`;

/**
 * Standard RFC 5322 compatible email validation regex
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
};

/**
 * Helper to get local subscribers cache
 */
const getLocalSubscribers = (): Subscriber[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Helper to save local subscribers cache
 */
const saveLocalSubscribers = (list: Subscriber[]): void => {
  if (typeof window === 'undefined') return;
  try {
    // Only store minimal fields to guarantee zero quota issues
    const sanitized = list.slice(0, 500).map((s) => ({
      id: s.id,
      email: s.email,
      source: s.source,
      createdAt: s.createdAt,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('[SubscriberService] Failed to save local cache:', err);
  }
};

/**
 * Subscribe an email address to the Explorer Club / Community Digest
 */
export const subscribeEmail = async (
  email: string,
  source: string = 'explorer_club'
): Promise<{ success: boolean; isDuplicate?: boolean; message: string; subscriber?: Subscriber }> => {
  if (!email || !isValidEmail(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  const normalized = email.trim().toLowerCase();
  const sourceClean = source.trim() || 'explorer_club';

  if (!isSupabaseConfigured()) {
    // Offline / unconfigured mode
    const localList = getLocalSubscribers();
    const existing = localList.find((s) => s.email.toLowerCase() === normalized);
    if (existing) {
      return {
        success: true,
        isDuplicate: true,
        message: "You're already subscribed to the Explorer Club!",
        subscriber: existing,
      };
    }

    const newSub: Subscriber = {
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalized,
      source: sourceClean,
      createdAt: new Date().toISOString(),
    };
    localList.unshift(newSub);
    saveLocalSubscribers(localList);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('abtalquest:subscriber_added', { detail: newSub }));
    }

    return {
      success: true,
      isDuplicate: false,
      message: 'Welcome to the Explorer Club!',
      subscriber: newSub,
    };
  }

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email: normalized,
        source: sourceClean,
      })
      .select()
      .single();

    if (error) {
      // Check for PostgreSQL Unique Violation (23505) or duplicate message
      const isUniqueError =
        error.code === '23505' ||
        error.message?.toLowerCase().includes('duplicate') ||
        error.message?.toLowerCase().includes('unique') ||
        error.message?.toLowerCase().includes('already exists');

      if (isUniqueError) {
        return {
          success: true,
          isDuplicate: true,
          message: "You're already subscribed to the Explorer Club!",
        };
      }

      // Check if table does not exist in schema cache
      if (error.code === 'PGRST205' || error.message?.toLowerCase().includes('schema cache')) {
        console.warn('[SubscriberService] Table "subscribers" not yet created in Supabase. Falling back to local cache.');
        const localList = getLocalSubscribers();
        const existing = localList.find((s) => s.email.toLowerCase() === normalized);
        if (existing) {
          return {
            success: true,
            isDuplicate: true,
            message: "You're already subscribed to the Explorer Club!",
          };
        }
        const fallbackSub: Subscriber = {
          id: `temp_${Date.now()}`,
          email: normalized,
          source: sourceClean,
          createdAt: new Date().toISOString(),
        };
        localList.unshift(fallbackSub);
        saveLocalSubscribers(localList);
        return {
          success: true,
          isDuplicate: false,
          message: 'Welcome to the Explorer Club!',
          subscriber: fallbackSub,
        };
      }

      console.error('[SubscriberService] Supabase insert error:', error);
      return {
        success: false,
        message: error.message || 'Unable to complete subscription. Please try again.',
      };
    }

    const createdSub: Subscriber = {
      id: data.id,
      email: data.email,
      source: data.source || sourceClean,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at,
    };

    // Mirror to local cache for instant offline responsiveness
    const currentList = getLocalSubscribers();
    if (!currentList.some((s) => s.id === createdSub.id)) {
      currentList.unshift(createdSub);
      saveLocalSubscribers(currentList);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('abtalquest:subscriber_added', { detail: createdSub }));
    }

    return {
      success: true,
      isDuplicate: false,
      message: 'Welcome to the Explorer Club!',
      subscriber: createdSub,
    };
  } catch (err: any) {
    console.error('[SubscriberService] Unexpected error during subscription:', err);
    return {
      success: false,
      message: err?.message || 'A network error occurred while subscribing.',
    };
  }
};

/**
 * Fetch all subscribers for the Admin Dashboard
 */
export const fetchSubscribers = async (): Promise<{
  subscribers: Subscriber[];
  isFromSupabase: boolean;
  isTableMissing?: boolean;
  error?: string;
}> => {
  if (!isSupabaseConfigured()) {
    return {
      subscribers: getLocalSubscribers(),
      isFromSupabase: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[SubscriberService] Error fetching subscribers from Supabase:', error);
      const isMissing = error.code === 'PGRST205' || error.message?.toLowerCase().includes('schema cache');
      return {
        subscribers: getLocalSubscribers(),
        isFromSupabase: false,
        isTableMissing: isMissing,
        error: isMissing
          ? "The 'subscribers' table does not exist in Supabase yet. Please run the setup SQL script in your Supabase SQL Editor."
          : error.message,
      };
    }

    const formatted: Subscriber[] = (data || []).map((row: any) => ({
      id: row.id,
      email: row.email,
      source: row.source || 'explorer_club',
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at,
    }));

    // Update local cache
    saveLocalSubscribers(formatted);

    return {
      subscribers: formatted,
      isFromSupabase: true,
    };
  } catch (err: any) {
    console.error('[SubscriberService] Fetch exception:', err);
    return {
      subscribers: getLocalSubscribers(),
      isFromSupabase: false,
      error: err?.message || 'Failed to retrieve subscribers.',
    };
  }
};

/**
 * Delete a subscriber by ID
 */
export const deleteSubscriber = async (id: string): Promise<boolean> => {
  if (!id) return false;

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('subscribers').delete().eq('id', id);
      if (error && error.code !== 'PGRST205') {
        console.error('[SubscriberService] Error deleting subscriber:', error);
        throw new Error(`Failed to delete subscriber: ${error.message}`);
      }
    } catch (err) {
      console.error('[SubscriberService] Delete exception:', err);
      throw err;
    }
  }

  // Remove from local cache
  const current = getLocalSubscribers();
  const updated = current.filter((s) => s.id !== id);
  saveLocalSubscribers(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('abtalquest:subscriber_deleted', { detail: { id } }));
  }

  return true;
};

/**
 * Export subscriber records to a formatted CSV file and trigger download
 */
export const exportSubscribersToCSV = (subscribers: Subscriber[]): void => {
  if (!subscribers || subscribers.length === 0) {
    alert('No subscribers to export.');
    return;
  }

  const headers = ['ID', 'Email', 'Source', 'Subscribed Date (UTC)', 'Subscribed Date (Local)'];
  const rows = subscribers.map((s) => [
    `"${s.id}"`,
    `"${s.email}"`,
    `"${s.source || 'explorer_club'}"`,
    `"${s.createdAt}"`,
    `"${new Date(s.createdAt).toLocaleString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `abtalquest_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
