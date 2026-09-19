import React from 'react';
import { Check, Database } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import type { OrderConfirmation } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';

export interface MarketplaceConfirmationModalProps {
  orderConfirmation: OrderConfirmation | null;
  onClose: () => void;
}

export const MarketplaceConfirmationModal: React.FC<MarketplaceConfirmationModalProps> = ({
  orderConfirmation,
  onClose,
}) => {
  const { t, direction } = useLanguage();

  if (!orderConfirmation) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-slate-100 dark:border-slate-700"
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
        
        <p className="font-body text-xs text-slate-500 dark:text-slate-300 mb-6">
          {t('marketplace.order_confirmed_desc')}
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 text-left space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_id_label')}</span>
            <strong className="font-headline text-slate-800 dark:text-slate-100 tracking-wider">
              {orderConfirmation.orderId}
            </strong>
          </div>

          <div className="flex justify-between items-center text-xs font-body">
            <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_total_paid')}</span>
            <strong className="font-headline text-slate-800 dark:text-slate-100">
              ${orderConfirmation.totalAmount.toFixed(2)}
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
              {direction === 'rtl' ? 'قاعدة البيانات:' : 'Database Storage:'}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
              <Database className="w-3 h-3" />
              {orderConfirmation.isSupabaseSaved
                ? t('marketplace.order_storage_supabase')
                : t('marketplace.order_storage_local')}
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
