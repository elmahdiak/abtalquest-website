import React from 'react';
import { Check, Database, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import type { OrderConfirmation } from '../../services/marketplaceService';
import { formatPrice } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceConfirmationModalProps {
  orderConfirmation: OrderConfirmation | null;
  onClose: () => void;
}

export const MarketplaceConfirmationModal: React.FC<MarketplaceConfirmationModalProps> = ({
  orderConfirmation,
  onClose,
}) => {
  const { t, direction, language } = useLanguage();

  if (!orderConfirmation) return null;

  const isPayzone = orderConfirmation.paymentMethod === 'payzone';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <Badge variant="success" size="md" className="mb-2">
          {t('marketplace.order_confirmed_badge')}
        </Badge>

        <h3 className="font-headline text-2xl font-black text-slate-900 dark:text-white mb-1">
          {t('marketplace.order_confirmed_title')}
        </h3>
        
        <p className="font-body text-xs text-slate-500 dark:text-slate-300 mb-5">
          {t('marketplace.order_confirmed_desc')}
        </p>

        {/* Payment Specific Notification Box */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-[#071D33] border border-blue-100 dark:border-blue-900/50 text-left mb-5 flex items-start gap-2.5">
          {isPayzone ? (
            <CreditCard className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8] flex-shrink-0 mt-0.5" />
          ) : (
            <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-[11px] font-body text-slate-700 dark:text-slate-300 leading-relaxed">
            {isPayzone ? t('marketplace.order_payzone_note') : t('marketplace.order_cod_note')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 text-left space-y-2.5 mb-6">
          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_id_label')}</span>
            <strong className="font-headline text-slate-800 dark:text-slate-100 tracking-wider">
              {orderConfirmation.orderId}
            </strong>
          </div>

          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_payment_method_label')}</span>
            <span className="font-headline font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1">
              {isPayzone ? (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />
                  Payzone / CMI
                </>
              ) : (
                <>
                  <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Cash on Delivery (COD)
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_payment_status_label')}</span>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold",
              isPayzone
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
            )}>
              {isPayzone ? t('marketplace.order_status_paid') : t('marketplace.order_status_pending_cod')}
            </span>
          </div>

          {orderConfirmation.paymentRef && (
            <div className="flex justify-between items-center text-xs font-body">
              <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_payment_ref_label')}</span>
              <strong className="font-mono text-[11px] text-[#016ba5] dark:text-[#38BDF8] tracking-wider">
                {orderConfirmation.paymentRef}
              </strong>
            </div>
          )}

          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_total_paid')}</span>
            <strong className="font-headline text-slate-800 dark:text-slate-100">
              {formatPrice(orderConfirmation.totalAmount, language)}
            </strong>
          </div>

          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_xp_unlocked')}</span>
            <span className="font-gamification font-bold text-[#7C3AED] dark:text-purple-400">
              +{orderConfirmation.totalXp} XP ✨
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-body pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">
              {direction === 'rtl' ? 'قاعدة البيانات والتوافق:' : 'Database & Compliance:'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
              <Database className="w-3 h-3" />
              {orderConfirmation.isSupabaseSaved
                ? t('marketplace.order_storage_supabase')
                : t('marketplace.order_storage_local')}
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
            <span>CNDP Dahir 1-09-15</span>
            <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3" /> Conforme
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            variant="cta"
            size="md"
            fullWidth
            onClick={onClose}
          >
            {t('marketplace.order_continue_btn')}
          </Button>
        </div>
      </div>
    </div>
  );
};
