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
  Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceFooterProps {
  onFilterPlanet: (planetKey: string) => void;
}

export const MarketplaceFooter: React.FC<MarketplaceFooterProps> = ({
  onFilterPlanet,
}) => {
  const { t, direction } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubscribed(false), 4000);
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
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('marketplace.mp_footer_newsletter_placeholder')}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/70 outline-none text-sm transition-all focus:border-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                {newsletterSubscribed ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>{t('marketplace.mp_footer_newsletter_btn')}</span>
                    <Send className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
                  </>
                )}
              </button>
            </div>
            {newsletterSubscribed && (
              <p className="text-xs text-amber-200 mt-2 font-semibold text-center md:text-start">
                {t('marketplace.mp_footer_newsletter_success')}
              </p>
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
