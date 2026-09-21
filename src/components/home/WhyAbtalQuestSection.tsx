import React from 'react';
import { 
  Sparkles, 
  Quote, 
  ShieldCheck, 
  Heart, 
  Compass, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface WhyAbtalQuestSectionProps {
  onLearnMore?: () => void;
}

export const WhyAbtalQuestSection: React.FC<WhyAbtalQuestSectionProps> = ({ onLearnMore }) => {
  const { t } = useLanguage();

  return (
    <section 
      id="why-abtalquest" 
      className="py-20 sm:py-28 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
    >
      {/* Soft ambient cosmic backdrop */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <Badge variant="warning" size="md" icon={<Sparkles className="w-4 h-4" />}>
            {t('philosophy.why_title') || 'Why AbtalQuest?'}
          </Badge>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mt-4 mb-5">
            {t('philosophy.why_title') || 'Why AbtalQuest?'}
          </h2>

          <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('philosophy.why_desc')}
          </p>
        </div>

        {/* Big Founding Quote Banner Box */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0A2540] via-[#0E3558] to-[#0A2540] text-white shadow-2xl border border-[#016ba5]/40 mb-12 overflow-hidden">
          {/* Subtle background glow rings */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#fa8221]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#016ba5]/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-[#fa8221]/20 border border-[#fa8221]/40 flex items-center justify-center text-[#fa8221] flex-shrink-0 shadow-inner">
              <Quote className="w-10 h-10" />
            </div>

            <div className="flex-1 text-center md:text-left rtl:md:text-right">
              <blockquote className="font-headline text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug mb-3">
                "{t('philosophy.founding_quote') || "We didn't want to raise kids in fear. So we built a space for courage!"}"
              </blockquote>
              <span className="font-body text-xs sm:text-sm text-slate-300 uppercase tracking-wider font-semibold">
                — {t('about.creed_author') || 'The AbtalQuest Founding Team'}
              </span>
            </div>
          </div>
        </div>

        {/* Founding Narrative & Guiding Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Mission Statement Paragraphs (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 font-body text-sm sm:text-base leading-relaxed text-left rtl:text-right">
            <h3 className="font-headline text-2xl font-bold text-[#1E293B] dark:text-white tracking-tight">
              {t('about.founding_title') || 'Born Out of Concern. Built With Love.'}
            </h3>

            <p>
              {t('philosophy.mission_statement')}
            </p>

            <p>
              {t('about.founding_p2') || 'Watching our own children navigate a digital landscape filled with predatory screen algorithms, commercial advertising loops, and mindless passive scrolling, we asked ourselves: What if technology inspired courage instead of dependency?'}
            </p>

            <div className="pt-2">
              <a
                href="#about"
                onClick={(e) => {
                  if (onLearnMore) {
                    e.preventDefault();
                    onLearnMore();
                  }
                }}
                className="inline-flex items-center gap-2 font-headline font-bold text-sm text-[#016ba5] dark:text-[#38BDF8] hover:text-[#fa8221] transition-colors group"
              >
                <span>Read our full founding story</span>
                <ArrowRight className="w-4 h-4 rtl-flip group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right: 4 Assurance Pill Pillars (Cols 8-12) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1">
                Zero Ads. Zero Popups.
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                Children explore in peace without commercial monetization or behavioral nudges.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1">
                Real-World Quests
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                Digital achievements unlock physical acts of service, chores, and family bonding.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 text-[#7C3AED] flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1">
                Character Over Clicks
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                Rooted in universal virtues: courage, patience, empathy, honesty, and wisdom.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#016ba5]/15 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1">
                COPPA Compliance
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                Data privacy strictly protected with total parental oversight and no trackers.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyAbtalQuestSection;
