import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  Building2
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { 
  detectCardBrand, 
  formatCardNumberDisplay, 
  processPayzoneCardPayment,
  type CardBrand
} from '../../services/payzoneService';
import { formatPrice } from '../../services/marketplaceService';
import { cn } from '../../lib/utils';

export interface PayzoneHostedModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  orderId?: string;
  customerName: string;
  customerEmail: string;
  onPaymentSuccess: (result: {
    token: string;
    paymentRef: string;
    cardBrand: string;
    last4: string;
  }) => void;
}

export const PayzoneHostedModal: React.FC<PayzoneHostedModalProps> = ({
  isOpen,
  onClose,
  orderTotal,
  orderId = 'AQ-PAYZONE-ORDER',
  customerName,
  customerEmail,
  onPaymentSuccess,
}) => {
  const { t, direction, language } = useLanguage();

  // Local-only card credentials (strictly isolated, NEVER emitted or saved)
  const [cardHolder, setCardHolder] = useState(customerName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('28');
  const [cvv, setCvv] = useState('');

  const [cardBrand, setCardBrand] = useState<CardBrand>('cmi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stage, setStage] = useState<'form' | '3d_secure' | 'success'>('form');

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatCardNumberDisplay(raw);
    setCardNumber(formatted);
    setCardBrand(detectCardBrand(raw));
    if (errorMessage) setErrorMessage(null);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 19) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال رقم بطاقة بنكية صحيح (١٦ رقماً).'
          : language === 'fr'
          ? 'Veuillez saisir un numéro de carte valide à 16 chiffres.'
          : 'Please enter a valid 16-digit card number.'
      );
      return;
    }

    if (!cardHolder.trim()) {
      setErrorMessage(
        language === 'ar'
          ? 'يرجى إدخال اسم حامل البطاقة.'
          : language === 'fr'
          ? 'Veuillez renseigner le nom du titulaire.'
          : 'Please enter the cardholder name.'
      );
      return;
    }

    if (cvv.length < 3) {
      setErrorMessage(
        language === 'ar'
          ? 'رمز الأمان (CVV) غير صالح.'
          : language === 'fr'
          ? 'Code de sécurité (CVV) invalide.'
          : 'Invalid CVV code.'
      );
      return;
    }

    setIsProcessing(true);
    setStage('3d_secure');

    try {
      const result = await processPayzoneCardPayment(
        {
          orderId,
          amount: orderTotal,
          currency: 'MAD',
          customerName,
          customerEmail,
        },
        {
          cardHolder,
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
        }
      );

      if (result.success && result.token && result.paymentRef) {
        setStage('success');
        setTimeout(() => {
          setIsProcessing(false);
          onPaymentSuccess({
            token: result.token!,
            paymentRef: result.paymentRef!,
            cardBrand: result.cardBrand || 'cmi',
            last4: result.last4 || '4242',
          });
        }, 800);
      } else {
        setIsProcessing(false);
        setStage('form');
        setErrorMessage(
          result.error ||
            (language === 'ar'
              ? 'فشلت عملية التحقق البنكي. يرجى المحاولة مرة أخرى.'
              : language === 'fr'
              ? 'Échec de l’authentification bancaire. Veuillez réessayer.'
              : 'Card verification failed. Please try again.')
        );
      }
    } catch {
      setIsProcessing(false);
      setStage('form');
      setErrorMessage(
        language === 'ar'
          ? 'حدث خطأ في الاتصال ببوابة الدفع Payzone.'
          : language === 'fr'
          ? 'Erreur de connexion avec la passerelle Payzone.'
          : 'Connection error with Payzone gateway.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#0B1E32] rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[95vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isProcessing && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
              direction === 'rtl' ? 'left-5' : 'right-5'
            )}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header with Payzone & CMI Branding */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#016ba5]/10 dark:bg-[#016ba5]/20 flex items-center justify-center text-[#016ba5] dark:text-[#38BDF8]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-black text-lg text-slate-900 dark:text-white">
                  {t('marketplace.payzone_modal_title')}
                </h3>
                <Badge variant="success" size="sm">
                  3D Secure
                </Badge>
              </div>
              <p className="text-[11px] font-body text-slate-500 dark:text-slate-400">
                {t('marketplace.payzone_modal_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Order Amount Bar */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-slate-50 via-[#016ba5]/5 to-slate-50 dark:from-[#081827] dark:via-[#016ba5]/15 dark:to-[#081827] rounded-2xl border border-slate-200/80 dark:border-slate-700/80 mb-5">
          <span className="text-xs font-body text-slate-600 dark:text-slate-300">
            {language === 'ar' ? 'المبلغ المستحق للدفع:' : language === 'fr' ? 'Montant à régler :' : 'Total Amount to Pay:'}
          </span>
          <span className="font-headline font-black text-xl text-[#016ba5] dark:text-[#38BDF8]">
            {formatPrice(orderTotal, language)}
          </span>
        </div>

        {/* Accepted Card Badges */}
        <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl mb-5 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[11px] font-headline font-semibold">
            {language === 'ar' ? 'البطاقات المقبولة:' : language === 'fr' ? 'Cartes acceptées :' : 'Accepted Cards:'}
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded font-black text-[10px] tracking-wider transition-all",
              cardBrand === 'cmi' 
                ? "bg-amber-500 text-white ring-2 ring-amber-400" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            )}>
              CMI
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded font-black text-[10px] tracking-wider transition-all",
              cardBrand === 'visa' 
                ? "bg-blue-600 text-white ring-2 ring-blue-400" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            )}>
              VISA
            </span>
            <span className={cn(
              "px-2 py-0.5 rounded font-black text-[10px] tracking-wider transition-all",
              cardBrand === 'mastercard' 
                ? "bg-red-600 text-white ring-2 ring-red-400" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
            )}>
              MASTERCARD
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs rounded-xl border border-red-200 dark:border-red-800/70 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3D-Secure Processing State */}
        {stage === '3d_secure' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#016ba5]/20 border-t-[#016ba5] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#016ba5]" />
              </div>
            </div>
            <div>
              <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {t('marketplace.payzone_processing')}
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                {language === 'ar'
                  ? 'جاري التحويل والمصادقة مع البنك المصدر عبر المركز المغربي للنقديات CMI...'
                  : language === 'fr'
                  ? 'Authentification auprès de votre banque marocaine via le CMI...'
                  : 'Authenticating with your card issuing bank via CMI Morocco...'}
              </p>
            </div>
          </div>
        )}

        {/* Success Confirmation State */}
        {stage === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
              {language === 'ar' ? 'تمت المصادقة البنكية بنجاح!' : language === 'fr' ? 'Authentification 3D-Secure validée !' : '3D-Secure Authentication Approved!'}
            </h4>
            <p className="font-body text-xs text-slate-500 dark:text-slate-400">
              {language === 'ar' ? 'جاري تسجيل وتثبيت الطلب...' : language === 'fr' ? 'Enregistrement sécurisé de votre commande...' : 'Securing your order confirmation...'}
            </p>
          </div>
        )}

        {/* Form State */}
        {stage === 'form' && (
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('marketplace.payzone_card_holder')} *
              </label>
              <input
                type="text"
                required
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="e.g. MOHAMMED ALAOUI"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-body text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#071727] text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('marketplace.payzone_card_number')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="5043 •••• •••• ••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-mono text-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#071727] text-slate-900 dark:text-white"
                />
                <CreditCard className="w-5 h-5 absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('marketplace.payzone_expiry')} *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#071727] text-slate-900 dark:text-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    className="w-full px-2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#071727] text-slate-900 dark:text-white"
                  >
                    {['26', '27', '28', '29', '30', '31', '32'].map((y) => (
                      <option key={y} value={y}>20{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('marketplace.payzone_cvv')} *
                </label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  placeholder="•••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#071727] text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Pay Button */}
            <div className="pt-2">
              <Button
                variant="cta"
                size="lg"
                fullWidth
                disabled={isProcessing}
                icon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                iconPosition={direction === 'rtl' ? 'right' : 'left'}
              >
                {t('marketplace.payzone_submit_btn', { amount: formatPrice(orderTotal, language) })}
              </Button>
            </div>

            {/* PCI-DSS Level 1 Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{t('marketplace.payzone_pci_guarantee')}</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PayzoneHostedModal;
