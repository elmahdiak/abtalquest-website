import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { submitWaitlist } from '../../services/subscriberService';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const { direction } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [device, setDevice] = useState('Not sure yet');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'duplicate'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !email.includes('@')) {
      setFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await submitWaitlist({
        firstName,
        email,
        phoneNumber: phone,
        whatsappNumber: whatsapp || phone,
        device,
      });

      if (res.success) {
        setFeedback({
          type: res.isDuplicate ? 'duplicate' : 'success',
          message: res.isDuplicate 
            ? "You're already registered on our early access waitlist!" 
            : "Welcome to the adventure! We've reserved your early access spot.",
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Something went wrong. Please try again.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'A network error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setFeedback(null);
    setFirstName('');
    setEmail('');
    setPhone('');
    setWhatsapp('');
    setDevice('Not sure yet');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={handleResetAndClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0c2238] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-700/80 my-8 text-left rtl:text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className={cn(
            'absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer',
            direction === 'rtl' ? 'left-5' : 'right-5'
          )}
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Peach Sparkle Badge */}
        <div className="w-12 h-12 rounded-2xl bg-amber-100/90 dark:bg-amber-900/30 text-[#fa8221] flex items-center justify-center shadow-xs mb-4">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>

        {/* Eyebrow */}
        <span className="font-headline text-xs font-bold text-[#0284c7] uppercase tracking-wider block mb-1">
          EARLY ACCESS
        </span>

        {/* Headline */}
        <h2 className="font-headline text-2xl sm:text-3xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2">
          Be first to enter the world.
        </h2>

        {/* Subhead */}
        <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          Join the AbtalQuest waitlist and be among the first families invited to try the app.
        </p>

        {feedback && feedback.type !== 'error' ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline text-lg font-bold text-emerald-900 dark:text-emerald-100">
              {feedback.type === 'duplicate' ? 'Already on the List!' : 'Spot Reserved!'}
            </h3>
            <p className="font-body text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
              {feedback.message}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold transition-all shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {feedback?.type === 'error' && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* First Name (optional) */}
            <div>
              <label className="block font-headline text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                First name <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-headline text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-headline text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent transition-all"
              />
            </div>

            {/* WhatsApp Number (optional) */}
            <div>
              <label className="block font-headline text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                WhatsApp number <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent transition-all"
              />
            </div>

            {/* Which device do you use? */}
            <div>
              <label className="block font-headline text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                Which device do you use?
              </label>
              <div className="relative">
                <select
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent appearance-none transition-all pr-10 rtl:pr-4 rtl:pl-10"
                >
                  <option value="Not sure yet">Not sure yet</option>
                  <option value="iOS (iPhone / iPad)">iOS (iPhone / iPad)</option>
                  <option value="Android">Android</option>
                  <option value="Both iOS & Android">Both iOS & Android</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-headline font-bold text-base shadow-[0_4px_14px_rgba(250,130,33,0.38)] hover:shadow-[0_6px_22px_rgba(250,130,33,0.48)] transition-all cursor-pointer disabled:opacity-70 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Join the waitlist</span>
                  </>
                )}
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-[11px] font-body text-slate-500 dark:text-slate-400 text-center leading-relaxed pt-2">
              We'll only use your email and phone number for AbtalQuest launch and early-access updates.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default WaitlistModal;
