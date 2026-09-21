import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  PackageCheck,
  CreditCard,
  Banknote,
  FileText,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Tag,
  Percent,
  Check
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { formatPrice } from '../../services/marketplaceService';
import { validateCoupon, type Coupon } from '../../services/couponService';
import { 
  CNDP_LEGAL_NOTICE_FR, 
  CNDP_LEGAL_NOTICE_AR 
} from '../../services/payzoneService';
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
  onSubmitOrder: (
    e: React.FormEvent, 
    paymentMethod: 'cod' | 'payzone', 
    cndpConsent: boolean,
    appliedCoupon?: Coupon | null,
    discountAmount?: number
  ) => void;
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

  // Payment method selection: 'cod' (Cash on delivery) or 'payzone' (Credit card via CMI)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'payzone'>('cod');
  
  // Moroccan Law 09-08 / CNDP Consent state
  const [cndpConsent, setCndpConsent] = useState(true);
  const [showCndpNotice, setShowCndpNotice] = useState(false);
  const [cndpError, setCndpError] = useState<string | null>(null);

  // Promo code / Coupon state
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [validatingPromo, setValidatingPromo] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const finalTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

  if (!isOpen) return null;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError(language === 'ar' ? 'يرجى إدخال رمز ترويجي' : language === 'fr' ? 'Veuillez saisir un code promo' : 'Please enter a promo code');
      return;
    }
    setValidatingPromo(true);
    setPromoError(null);
    try {
      const res = await validateCoupon(promoInput, cartSubtotal);
      if (res.isValid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discountAmount);
        setPromoError(null);
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setPromoError(res.errorMessage || (language === 'ar' ? 'رمز ترويجي غير صالح' : 'Code promo non valide'));
      }
    } catch {
      setPromoError(language === 'ar' ? 'فشل التحقق من الرمز الترويجي' : 'Erreur lors de la validation du code');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setPromoInput('');
    setPromoError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cndpConsent) {
      setCndpError(
        language === 'ar'
          ? 'يرجى الموافقة على معالجة البيانات وفق القانون 09-08 لمتابعة الطلب.'
          : language === 'fr'
          ? 'Veuillez accepter le traitement des données conformément à la loi 09-08.'
          : 'Please consent to data processing under Moroccan Law 09-08 to proceed.'
      );
      return;
    }
    setCndpError(null);
    onSubmitOrder(e, paymentMethod, cndpConsent, appliedCoupon, discountAmount);
  };

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
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 mb-6 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
              <span>{t('marketplace.checkout_items_in_order', { count: cartTotalCount })}</span>
              <span className="font-headline font-bold text-slate-800 dark:text-slate-100">{formatPrice(cartSubtotal, language)}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 py-1 border-b border-slate-200 dark:border-slate-700">
              <span>{t('marketplace.checkout_delivery')}</span>
              <span className="font-headline font-bold text-emerald-600 dark:text-emerald-400">{t('marketplace.checkout_free')}</span>
            </div>

            {/* Applied Promo Discount Line */}
            {appliedCoupon && discountAmount > 0 && (
              <div className="flex justify-between items-center text-xs font-body text-emerald-600 dark:text-emerald-400 py-1.5 border-b border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 px-2 rounded-lg">
                <span className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{t('marketplace.checkout_promo_discount')} ({appliedCoupon.code})</span>
                </span>
                <span className="font-headline font-black">
                  -{formatPrice(discountAmount, language)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-headline font-black text-slate-900 dark:text-white pt-1">
              <span>{t('marketplace.checkout_total_due')}</span>
              <div className="text-right">
                {appliedCoupon && discountAmount > 0 && (
                  <span className="text-xs line-through text-slate-400 mr-2 font-body font-normal">
                    {formatPrice(cartSubtotal, language)}
                  </span>
                )}
                <span>{formatPrice(finalTotal, language)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-gamification text-[#7C3AED] dark:text-purple-400 font-bold">
              <span>{t('marketplace.checkout_xp_to_unlock')}</span>
              <span>+{cartTotalXp} Quest XP ✨</span>
            </div>
          </div>

          {/* Promo Code Input & Management Card */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
            {!appliedCoupon ? (
              <div>
                <label className="block text-[11px] font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />
                  <span>{t('marketplace.checkout_promo_label')}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      if (promoError) setPromoError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyPromo();
                      }
                    }}
                    placeholder={t('marketplace.checkout_promo_placeholder')}
                    className="flex-1 uppercase font-mono px-3 py-2 rounded-xl bg-white dark:bg-[#071727] border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                  <button
                    type="button"
                    disabled={validatingPromo || !promoInput.trim()}
                    onClick={handleApplyPromo}
                    className="px-3.5 py-2 rounded-xl bg-[#016ba5] hover:bg-[#0284c7] disabled:opacity-50 text-white font-headline font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {validatingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Percent className="w-3.5 h-3.5" />}
                    <span>{t('marketplace.checkout_promo_apply')}</span>
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1 font-body">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{promoError}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-headline font-black text-emerald-800 dark:text-emerald-200 truncate">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-[10px] font-body text-emerald-600 dark:text-emerald-400">
                      {appliedCoupon.discountType === 'percentage'
                        ? `-${appliedCoupon.discountValue}% (${formatPrice(discountAmount, language)})`
                        : `-${formatPrice(discountAmount, language)}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 border border-slate-200 dark:border-slate-700 text-[11px] font-headline font-bold transition-colors cursor-pointer shrink-0"
                >
                  {t('marketplace.checkout_promo_remove')}
                </button>
              </div>
            )}
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
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* DUAL PAYMENT METHOD SELECTOR */}
          <div className="pt-2">
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-2">
              {t('marketplace.checkout_payment_method')}
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Cash on Delivery (COD) */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all",
                  paymentMethod === 'cod'
                    ? "border-[#016ba5] bg-[#016ba5]/5 dark:bg-[#016ba5]/15 dark:border-[#38BDF8]"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-[#016ba5] focus:ring-[#016ba5]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-headline font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('marketplace.checkout_cod_title')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {t('marketplace.checkout_cod_badge')}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t('marketplace.checkout_cod_desc')}
                  </p>
                </div>
              </label>

              {/* Option 2: Credit Card via Payzone / CMI */}
              <label
                onClick={() => setPaymentMethod('payzone')}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all",
                  paymentMethod === 'payzone'
                    ? "border-[#016ba5] bg-[#016ba5]/5 dark:bg-[#016ba5]/15 dark:border-[#38BDF8]"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payzone"
                  checked={paymentMethod === 'payzone'}
                  onChange={() => setPaymentMethod('payzone')}
                  className="mt-1 text-[#016ba5] focus:ring-[#016ba5]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-headline font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8]" />
                      {t('marketplace.checkout_payzone_title')}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500 text-white">
                        CMI
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white">
                        VISA
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white">
                        MC
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] font-body text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {t('marketplace.checkout_payzone_desc')}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* CNDP Law No. 09-08 Compliance Checkbox & Disclosure */}
          <div className="p-3 bg-slate-50 dark:bg-[#071727] rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-body text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={cndpConsent}
                onChange={(e) => {
                  setCndpConsent(e.target.checked);
                  if (e.target.checked) setCndpError(null);
                }}
                className="mt-0.5 w-4 h-4 text-[#016ba5] rounded border-slate-300 dark:border-slate-600 focus:ring-[#016ba5]"
              />
              <span className="flex-1 text-[11px] leading-relaxed">
                {t('marketplace.checkout_cndp_consent_label')}
              </span>
            </label>

            {cndpError && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{cndpError}</span>
              </div>
            )}

            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowCndpNotice(!showCndpNotice)}
                className="text-[10px] font-headline font-semibold text-[#016ba5] dark:text-[#38BDF8] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                {showCndpNotice 
                  ? t('marketplace.checkout_cndp_hide')
                  : t('marketplace.checkout_cndp_read_more')}
                {showCndpNotice ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                CNDP Dahir 1-09-15
              </span>
            </div>

            {showCndpNotice && (
              <div className="p-2.5 bg-white dark:bg-[#0A2540] rounded-xl text-[10px] font-body text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
                {language === 'ar' ? CNDP_LEGAL_NOTICE_AR : CNDP_LEGAL_NOTICE_FR}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2.5">
            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submittingOrder}
              icon={
                submittingOrder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : paymentMethod === 'payzone' ? (
                  <CreditCard className="w-4 h-4" />
                ) : (
                  <PackageCheck className="w-4 h-4" />
                )
              }
              iconPosition={direction === 'rtl' ? 'right' : 'left'}
            >
              {submittingOrder
                ? t('marketplace.checkout_saving')
                : paymentMethod === 'payzone'
                ? t('marketplace.checkout_btn_payzone', { total: formatPrice(finalTotal, language) })
                : t('marketplace.checkout_btn_cod', { total: formatPrice(finalTotal, language) })}
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
