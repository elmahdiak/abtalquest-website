import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  Sparkles, 
  Send, 
  Check, 
  Brain,
  Compass,
  Wrench,
  Heart,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { subscribeEmail, isValidEmail } from '../../services/subscriberService';

export interface MarketplaceFooterProps {
  onFilterPlanet: (planetKey: string) => void;
}

export const MarketplaceFooter: React.FC<MarketplaceFooterProps> = ({
  onFilterPlanet,
}) => {
  const { t, direction } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'duplicate' | 'error'; message: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterSubmitting) return;

    if (!isValidEmail(newsletterEmail)) {
      setFeedback({
        type: 'error',
        message: t('marketplace.mp_footer_newsletter_invalid'),
      });
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    setNewsletterSubmitting(true);
    setFeedback(null);

    try {
      const res = await subscribeEmail(newsletterEmail, 'explorer_club');
      if (res.success) {
        if (res.isDuplicate) {
          setFeedback({
            type: 'duplicate',
            message: t('marketplace.mp_footer_newsletter_already'),
          });
        } else {
          setFeedback({
            type: 'success',
            message: t('marketplace.mp_footer_newsletter_success'),
          });
          setNewsletterEmail(''); // Clear input on successful subscription
        }
      } else {
        setFeedback({
          type: 'error',
          message: res.message || t('marketplace.mp_footer_newsletter_error'),
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || t('marketplace.mp_footer_newsletter_error'),
      });
    } finally {
      setNewsletterSubmitting(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  return (
    <footer className="w-full mt-16 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 transition-colors">
      
      {/* Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200 dark:border-slate-800">
        <div className="rounded-3xl bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221] p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('marketplace.mp_footer_newsletter_title')}</span>
            </div>
            <h3 className="font-headline font-extrabold text-2xl sm:text-3xl text-white mb-2">
              {t('marketplace.mp_footer_newsletter_title')}
            </h3>
            <p className="text-sm text-white/90">
              {t('marketplace.mp_footer_newsletter_desc')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                disabled={newsletterSubmitting}
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder={t('marketplace.mp_footer_newsletter_placeholder')}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/70 outline-none text-sm transition-all focus:border-white disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-75"
              >
                {newsletterSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 text-[#016ba5] animate-spin" />
                    <span>{t('marketplace.mp_footer_newsletter_btn')}...</span>
                  </>
                ) : feedback?.type === 'success' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Subscribed!</span>
                  </>
                ) : feedback?.type === 'duplicate' ? (
                  <>
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>{t('marketplace.mp_footer_newsletter_btn')}</span>
                    <Send className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
                  </>
                )}
              </button>
            </div>
            {feedback && (
              <div className="mt-2.5 text-xs font-semibold text-center md:text-start flex items-center justify-center md:justify-start gap-1.5 animate-fadeIn">
                {feedback.type === 'success' && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-emerald-100">{feedback.message}</span>
                  </>
                )}
                {feedback.type === 'duplicate' && (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-amber-100">{feedback.message}</span>
                  </>
                )}
                {feedback.type === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
                    <span className="text-rose-100">{feedback.message}</span>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Store Brand Creed */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#fa8221] text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                A
              </div>
              <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {t('marketplace.mp_footer_tagline')}
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              {t('marketplace.mp_footer_desc')}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified 100% Screen-Free</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="mt-5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2.5">
                {t('footer.follow_title')}
              </span>
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/abtal.quest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@AbtalQUEST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#FF0000] hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@abtal.quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-black hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/abtalquest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 hover:bg-[#0A66C2] hover:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Shop Worlds */}
          <div>
            <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {t('marketplace.mp_footer_col_shop')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onFilterPlanet('thinkers')}
                  className="hover:text-[#016ba5] dark:hover:text-[#0284c7] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Brain className="w-3.5 h-3.5 text-[#016ba5]" />
                  <span>Thinkers&apos; Planet (Birchwood STEM)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterPlanet('brave')}
                  className="hover:text-[#fa8221] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#fa8221]" />
                  <span>Brave Planet (Trail Navigation)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterPlanet('solvers')}
                  className="hover:text-[#0284c7] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Solvers&apos; Planet (Hydraulic Logic)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onFilterPlanet('heart')}
                  className="hover:text-[#7C3AED] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Heart Planet (Kindness Games)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Parent Guarantees */}
          <div>
            <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {t('marketplace.mp_footer_col_guarantee')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Non-Toxic Soy Inks & FSC Paper</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>EN71 & ASTM F963 Toy Safety Tested</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Joyful Growth Guarantee</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Ads & Zero Commercial Trackers</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Secure Checkout Badges */}
          <div>
            <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {t('marketplace.mp_footer_col_help')}
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#016ba5]" />
                <span className="font-semibold">{t('marketplace.mp_footer_payment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{t('marketplace.mp_footer_delivery')}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                For curriculum orders or parent questions, reach us through the Contact form or family portal.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>&copy; {new Date().getFullYear()} AbtalQuest Universe. {t('footer.rights')}</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">COPPA Compliance</span>
            <span>•</span>
            <span className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
