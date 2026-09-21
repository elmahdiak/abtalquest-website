import React, { useState } from 'react';
import { X, Send, ShieldCheck, Mail, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { sendContactMessage } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialSubject = 'General Inquiry',
}) => {
  const { t, direction } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('auth.err_name');
    if (!email.trim() || !email.includes('@')) errs.email = t('auth.err_email');
    if (!message.trim() || message.length < 10) errs.message = t('auth.err_password_len');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name,
        email,
        subject,
        message,
      });
      setIsSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      alert('Could not submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            'absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            direction === 'rtl' ? 'left-5' : 'right-5'
          )}
          aria-label={t('nav.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <Badge variant="success" size="md" className="mb-2">
              {t('contact.success_badge')}
            </Badge>

            <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-2">
              {t('contact.success_title')}
            </h3>

            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-8 max-w-sm mx-auto leading-relaxed">
              {t('contact.success_desc')}
            </p>

            <Button
              variant="cta"
              size="md"
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
            >
              {t('contact.btn_back')}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#016ba5]/10 dark:bg-[#016ba5]/25 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <Badge variant="primary" size="sm">
                {t('contact.badge')}
              </Badge>
            </div>

            <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-1">
              {t('contact.title')}
            </h3>

            <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-6">
              {t('contact.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('contact.full_name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah Mansour"
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                    errors.name ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {errors.name && <span className="text-[11px] text-red-500 mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('contact.email')}
                </label>
                <div className="relative">
                  <Mail className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className={`w-full py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                    } ${
                      errors.email ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                </div>
                {errors.email && <span className="text-[11px] text-red-500 mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('contact.topic')}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 font-body text-xs bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#016ba5] cursor-pointer"
                >
                  <option value="Learning Kits & Delivery">{t('contact.topic_1')}</option>
                  <option value="Parental Controls & Safety">{t('contact.topic_2')}</option>
                  <option value="Curriculum & School Inquiries">{t('contact.topic_3')}</option>
                  <option value="General Inquiry">{t('contact.topic_4')}</option>
                  <option value="Partnership & Outreach">{t('contact.topic_5')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('contact.message')}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('contact.message_placeholder')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                    errors.message ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {errors.message && <span className="text-[11px] text-red-500 mt-1 block">{errors.message}</span>}
              </div>

              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-body text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>{t('contact.spam_guarantee')}</span>
              </div>

              <div className="pt-2">
                <Button
                  variant="cta"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                  icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rtl-flip" />}
                  iconPosition="right"
                >
                  {isSubmitting ? t('contact.btn_sending') : t('contact.btn_send')}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
