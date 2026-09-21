import { supabase, isSupabaseConfigured } from '../supabaseClient';
import type { AdminOrder, ContactMessage } from './marketplaceService';

export interface AdminNotification {
  id: string;
  type: 'order' | 'message' | 'subscriber' | 'payment_failed' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  linkTab?: 'orders' | 'messages' | 'subscribers' | 'blogs';
  targetId?: string;
  amount?: number;
}

const NOTIFICATIONS_READ_KEY = 'abtalquest_admin_read_notifs';
const NOTIFICATIONS_DISMISSED_KEY = 'abtalquest_admin_dismissed_notifs';

/**
 * Retrieves set of read notification IDs from localStorage
 */
function getReadNotificationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_READ_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Retrieves set of dismissed notification IDs from localStorage
 */
function getDismissedNotificationIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_DISMISSED_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Persists read notification IDs to localStorage
 */
function saveReadNotificationIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore
  }
}

/**
 * Persists dismissed notification IDs to localStorage
 */
function saveDismissedNotificationIds(ids: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIFICATIONS_DISMISSED_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore
  }
}

/**
 * Formats ISO timestamp into friendly relative French time string
 */
export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'À l\'instant';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'À l\'instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  } catch {
    return 'Récemment';
  }
}

/**
 * Aggregates live notifications from Supabase and recent customer activity
 */
export async function fetchAdminNotifications(
  orders: AdminOrder[] = [],
  messages: ContactMessage[] = [],
  subscribers: { id: string; email: string; createdAt: string }[] = []
): Promise<AdminNotification[]> {
  const readIds = getReadNotificationIds();
  const dismissedIds = getDismissedNotificationIds();
  const notifications: AdminNotification[] = [];

  // 1. Check if dedicated notifications table exists in Supabase
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach((row: any) => {
          const id = `db_${row.id}`;
          if (!dismissedIds.has(id)) {
            notifications.push({
              id,
              type: row.type || 'system',
              title: row.title || 'Notification Système',
              message: row.message || '',
              timestamp: row.created_at || new Date().toISOString(),
              isRead: row.is_read || readIds.has(id),
              linkTab: row.data?.linkTab,
              targetId: row.data?.targetId,
              amount: row.data?.amount,
            });
          }
        });
      }
    } catch {
      // Table may not exist yet; gracefully fallback to dynamic event synthesis
    }
  }

  // 2. Synthesize notifications from recent orders
  orders.slice(0, 15).forEach((order) => {
    const notifId = `order_${order.id}`;
    if (!dismissedIds.has(notifId)) {
      const isFailed = order.status === 'cancelled' || order.paymentStatus === 'failed';
      const isPayzone = order.paymentMethod === 'payzone';
      
      notifications.push({
        id: notifId,
        type: isFailed ? 'payment_failed' : 'order',
        title: isFailed
          ? `Échec de paiement: #${order.id.slice(0, 8)}`
          : `Nouvelle commande: #${order.id.slice(0, 8)}`,
        message: `${order.customerName} a passé commande (${order.items.length} article${order.items.length > 1 ? 's' : ''}) • ${order.totalAmount} MAD via ${isPayzone ? 'Carte (Payzone)' : 'Paiement à la livraison'}`,
        timestamp: order.createdAt || new Date().toISOString(),
        isRead: readIds.has(notifId),
        linkTab: 'orders',
        targetId: order.id,
        amount: order.totalAmount,
      });
    }
  });

  // 3. Synthesize notifications from contact messages
  messages.slice(0, 10).forEach((msg) => {
    const notifId = `msg_${msg.id}`;
    if (!dismissedIds.has(notifId)) {
      notifications.push({
        id: notifId,
        type: 'message',
        title: `Nouveau message de ${msg.name}`,
        message: msg.subject ? `${msg.subject}: "${msg.message.slice(0, 60)}..."` : msg.message.slice(0, 80),
        timestamp: msg.createdAt || new Date().toISOString(),
        isRead: msg.status === 'read' || readIds.has(notifId),
        linkTab: 'messages',
        targetId: msg.id,
      });
    }
  });

  // 4. Synthesize notifications from recent newsletter subscribers
  subscribers.slice(0, 8).forEach((sub) => {
    const notifId = `sub_${sub.id}`;
    if (!dismissedIds.has(notifId)) {
      notifications.push({
        id: notifId,
        type: 'subscriber',
        title: 'Nouvel abonné Explorer Club',
        message: `${sub.email} a rejoint le club d'exploration AbtalQuest.`,
        timestamp: sub.createdAt || new Date().toISOString(),
        isRead: readIds.has(notifId),
        linkTab: 'subscribers',
        targetId: sub.id,
      });
    }
  });

  // Sort by timestamp descending
  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Marks single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const readIds = getReadNotificationIds();
  readIds.add(notificationId);
  saveReadNotificationIds(readIds);

  if (notificationId.startsWith('db_') && isSupabaseConfigured()) {
    try {
      const realId = notificationId.replace('db_', '');
      await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('id', realId);
    } catch {
      // ignore
    }
  }
}

/**
 * Marks all notifications as read
 */
export async function markAllNotificationsAsRead(notifications: AdminNotification[]): Promise<void> {
  const readIds = getReadNotificationIds();
  notifications.forEach((n) => readIds.add(n.id));
  saveReadNotificationIds(readIds);

  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from('admin_notifications')
        .update({ is_read: true })
        .eq('is_read', false);
    } catch {
      // ignore
    }
  }
}

/**
 * Dismisses/clears all notifications
 */
export async function clearAllNotifications(notifications: AdminNotification[]): Promise<void> {
  const dismissedIds = getDismissedNotificationIds();
  notifications.forEach((n) => dismissedIds.add(n.id));
  saveDismissedNotificationIds(dismissedIds);
}

/**
 * Sets up Supabase Realtime listeners for new orders, messages, and subscribers
 */
export function setupRealtimeNotificationSubscriptions(
  onNewNotification: (notif: AdminNotification) => void
): () => void {
  if (!isSupabaseConfigured()) {
    return () => {};
  }

  const channel = supabase
    .channel('abtalquest_admin_live_feed')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        const row = payload.new as any;
        if (row) {
          const isPayzone = row.payment_method === 'payzone';
          const notif: AdminNotification = {
            id: `order_${row.id}`,
            type: 'order',
            title: `Nouvelle commande #${String(row.id).slice(0, 8)}`,
            message: `${row.customer_name || 'Un client'} a passé commande • ${row.total_amount || 0} MAD (${isPayzone ? 'Payzone' : 'Paiement à la livraison'})`,
            timestamp: row.created_at || new Date().toISOString(),
            isRead: false,
            linkTab: 'orders',
            targetId: row.id,
            amount: Number(row.total_amount) || 0,
          };
          onNewNotification(notif);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'contact_messages' },
      (payload) => {
        const row = payload.new as any;
        if (row) {
          const notif: AdminNotification = {
            id: `msg_${row.id}`,
            type: 'message',
            title: `Nouveau message de ${row.name || 'Un visiteur'}`,
            message: row.subject || row.message?.slice(0, 80) || 'Nouveau message de contact reçu.',
            timestamp: row.created_at || new Date().toISOString(),
            isRead: false,
            linkTab: 'messages',
            targetId: row.id,
          };
          onNewNotification(notif);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'subscribers' },
      (payload) => {
        const row = payload.new as any;
        if (row) {
          const notif: AdminNotification = {
            id: `sub_${row.id}`,
            type: 'subscriber',
            title: 'Nouvel abonné Explorer Club',
            message: `${row.email} vient de s'abonner à la newsletter.`,
            timestamp: row.created_at || new Date().toISOString(),
            isRead: false,
            linkTab: 'subscribers',
            targetId: row.id,
          };
          onNewNotification(notif);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
