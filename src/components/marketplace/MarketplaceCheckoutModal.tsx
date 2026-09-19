import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  PackageCheck 
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { formatPrice } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface MarketplaceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartTotalXp: number;
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  formErrors: Record<string, string>;
  submittingOrder: boolean;
  onSubmitOrder: (e: React.FormEvent) => void;
}

export const MarketplaceCheckoutModal: React.FC<MarketplaceCheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth,
  cartTotalCount,
  cartSubtotal,
  cartTotalXp,
  formData,
  setFormData,
  formErrors,
  submittingOrder,
  onSubmitOrder,
}) => {
  const { t, direction, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
            direction === 'rtl' ? 'left-5' : 'right-5'
          )}
          aria-label={t('profile.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <Badge variant="primary" size="sm">{t('marketplace.checkout_verified')}</Badge>
        </div>

        <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-2">
          {t('marketplace.checkout_title')}
        </h3>
        <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-6">
          {t('marketplace.checkout_subtitle')}
        </p>

        {/* Order summary mini table */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span>{t('marketplace.checkout_items_in_order', { count: cartTotalCount })}</span>
            <span className="font-headline font-bold text-slate-800 dark:text-slate-100">{formatPrice(cartSubtotal, language)}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 py-1.5 border-b border-slate-200 dark:border-slate-700">
            <span>{t('marketplace.checkout_delivery')}</span>
            <span className="font-headline font-bold text-emerald-600 dark:text-emerald-400">{t('marketplace.checkout_free')}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-headline font-black text-slate-900 dark:text-white pt-2">
            <span>{t('marketplace.checkout_total_due')}</span>
            <span>{formatPrice(cartSubtotal, language)}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-gamification text-[#7C3AED] dark:text-purple-400 font-bold">
            <span>{t('marketplace.checkout_xp_to_unlock')}</span>
            <span>+{cartTotalXp} Quest XP ✨</span>
          </div>
        </div>

        {/* Guest vs Member Account Banner */}
        {user ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-body text-emerald-800 dark:text-emerald-200 mb-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>
              {t('marketplace.checkout_logged_in_as', { email: user.email || '' })}
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-gradient-to-r from-[#016ba5]/10 via-slate-50 to-[#fa8221]/10 dark:from-[#016ba5]/20 dark:via-[#0A2540] dark:to-[#fa8221]/15 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body mb-5">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-[#fa8221] flex-shrink-0" />
              <span><strong>{t('marketplace.checkout_guest_badge')}</strong> {t('marketplace.checkout_guest_desc')}</span>
            </div>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="text-[#016ba5] dark:text-[#38BDF8] font-headline font-bold hover:underline self-start sm:self-auto text-[11px] cursor-pointer"
              >
                {t('marketplace.checkout_sign_in_2x')}
              </button>
            )}
          </div>
        )}

        {/* Checkout Form */}
        <form onSubmit={onSubmitOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('marketplace.checkout_name')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder={t('marketplace.checkout_name_placeholder')}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                formErrors.name ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formErrors.name && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.name}</span>}
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('marketplace.checkout_email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder={t('marketplace.checkout_email_placeholder')}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                formErrors.email ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formErrors.email && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.email}</span>}
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('marketplace.checkout_address')}
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              placeholder={t('marketplace.checkout_address_placeholder')}
              className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                formErrors.address ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
              }`}
            />
            {formErrors.address && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.address}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('marketplace.checkout_city')}
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Casablanca"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                  formErrors.city ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                }`}
              />
              {formErrors.city && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.city}</span>}
            </div>

            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('marketplace.checkout_postal')}
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="20000"
                className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                  formErrors.postalCode ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                }`}
              />
              {formErrors.postalCode && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.postalCode}</span>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2.5">
            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submittingOrder}
              icon={submittingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
              iconPosition={direction === 'rtl' ? 'right' : 'left'}
            >
              {submittingOrder
                ? t('marketplace.checkout_saving')
                : t('marketplace.checkout_confirm_btn', { total: formatPrice(cartSubtotal, language) })}
            </Button>

            <p className="text-[11px] font-body text-slate-400 dark:text-slate-500 text-center">
              {t('marketplace.checkout_security_note')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
