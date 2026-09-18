import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  LogOut, 
  Loader2
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { getUserOrders, type AdminOrder } from '../../services/marketplaceService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
}) => {
  const { t, direction } = useLanguage();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function loadUserOrders() {
      if (!user?.email) {
        if (mounted) setLoadingOrders(false);
        return;
      }
      try {
        const userOrders = await getUserOrders(user.email, user.id);
        if (mounted) {
          setOrders(userOrders);
        }
      } catch (err) {
        console.warn('Error loading user orders:', err);
      } finally {
        if (mounted) {
          setLoadingOrders(false);
        }
      }
    }

    if (isOpen) {
      loadUserOrders();
    }

    return () => {
      mounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Family Hero';
  const totalXpEarned = orders.reduce((sum, o) => sum + o.totalXp, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
            direction === 'rtl' ? 'left-5' : 'right-5'
          )}
          aria-label={t('profile.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#016ba5]/10 via-slate-50 to-[#fa8221]/10 dark:from-[#016ba5]/20 dark:via-[#0A2540] dark:to-[#fa8221]/15 border border-slate-200 dark:border-slate-700 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#016ba5] text-white font-headline font-black text-2xl flex items-center justify-center shadow-md">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" size="sm">
                  {t('profile.badge_active')}
                </Badge>
                <Badge variant="gamification" size="sm">
                  {t('profile.badge_hero_level', { level: Math.max(1, Math.floor(totalXpEarned / 300) + 1) })}
                </Badge>
              </div>
              <h3 className="font-headline text-2xl font-black text-slate-900 dark:text-white">
                {fullName}
              </h3>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
            </div>
          </div>

          <div className={cn(
            direction === 'rtl'
              ? 'text-right sm:border-r sm:border-slate-200 dark:sm:border-slate-700 sm:pr-6'
              : 'text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-6'
          )}>
            <span className="font-body text-[11px] text-slate-500 dark:text-slate-400 uppercase block font-semibold">
              {t('profile.accumulated_xp')}
            </span>
            <span className="font-gamification text-2xl font-black text-[#7C3AED] dark:text-purple-400">
              +{totalXpEarned.toLocaleString()} XP ✨
            </span>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#016ba5] dark:text-[#38BDF8]" />
              <h4 className="font-headline text-lg font-bold text-slate-900 dark:text-white">
                {t('profile.orders_title', { count: orders.length })}
              </h4>
            </div>
          </div>

          {loadingOrders ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 text-[#016ba5] dark:text-[#38BDF8] animate-spin mx-auto mb-2" />
              <span className="font-body text-xs text-slate-400">{t('profile.orders_loading')}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 dark:bg-[#0A2540] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
              <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h5 className="font-headline font-bold text-sm text-slate-700 dark:text-slate-200 mb-1">
                {t('profile.no_orders_title')}
              </h5>
              <p className="font-body text-xs text-slate-400 dark:text-slate-400 mb-4 max-w-xs mx-auto">
                {t('profile.no_orders_desc')}
              </p>
              <Button
                variant="cta"
                size="sm"
                onClick={() => {
                  onClose();
                  window.location.hash = '#marketplace';
                }}
              >
                {t('profile.explore_marketplace')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">
                        {order.id}
                      </span>
                      <span className="text-[11px] font-body text-slate-400 dark:text-slate-500">
                        • {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-headline font-bold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <p className="font-body text-xs text-slate-600 dark:text-slate-300">
                      {order.items.map((i) => `${i.productTitle} (×${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className={cn(
                    "flex sm:flex-col items-center justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700",
                    direction === 'rtl' ? 'sm:items-start' : 'sm:items-end'
                  )}>
                    <span className="font-headline font-black text-sm text-slate-900 dark:text-white">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                    <span className="font-gamification text-xs text-[#7C3AED] dark:text-purple-400 font-bold">
                      +{order.totalXp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-headline font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <LogOut className={cn("w-4 h-4", direction === 'rtl' && 'rtl-flip')} />
            <span>{t('profile.sign_out')}</span>
          </button>

          <Button variant="outline" size="sm" onClick={onClose}>
            {t('profile.close')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
