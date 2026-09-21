import React from 'react';
import { 
  Film, 
  Compass, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Quote, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export interface FeatureItem {
  id: string;
  titleKey: string;
  descKey: string;
  badgeKey: string;
  badgeVariant: 'gamification' | 'success' | 'secondary';
  icon: React.ReactNode;
  iconBg: string;
  accentBorder: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'cartoons',
    titleKey: 'feat_cartoons_title',
    descKey: 'feat_cartoons_desc',
    badgeKey: 'feat_4_title',
    badgeVariant: 'secondary',
    icon: <Film className="w-8 h-8" />,
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    accentBorder: 'hover:border-[#fa8221]/40 hover:shadow-[0_15px_30px_-5px_rgba(250,130,33,0.2)]',
  },
  {
    id: 'quests',
    titleKey: 'feat_quests_title',
    descKey: 'feat_quests_desc',
    badgeKey: 'feat_5_title',
    badgeVariant: 'gamification',
    icon: <Compass className="w-8 h-8" />,
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    accentBorder: 'hover:border-[#7C3AED]/40 hover:shadow-[0_15px_30px_-5px_rgba(124,58,237,0.2)]',
  },
  {
    id: 'social',
    titleKey: 'feat_3_title',
    descKey: 'feat_3_desc',
    badgeKey: 'feat_6_title',
    badgeVariant: 'success',
    icon: <Users className="w-8 h-8" />,
    iconBg: 'bg-[#22C55E]/10 text-[#16a34a]',
    accentBorder: 'hover:border-[#22C55E]/40 hover:shadow-[0_15px_30px_-5px_rgba(34,197,94,0.2)]',
  },
];

export const CoreFeatures: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="core-features" className="py-20 sm:py-28 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      {/* Soft ambient lighting */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#016ba5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#fa8221]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" size="md" icon={<Sparkles className="w-4 h-4" />}>
            {t('features.badge')}
          </Badge>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mt-4 mb-4">
            {t('features.title_revolutionary') || t('features.title')}
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
            {t('features.subtitle_revolutionary') || t('features.subtitle')}
          </p>
        </div>

        {/* 3 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className={`bg-white dark:bg-[#0F2F4E] rounded-3xl p-8 border-2 border-slate-200/90 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${feat.accentBorder}`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${feat.iconBg} flex items-center justify-center shadow-sm`}>
                    {feat.icon}
                  </div>
                  <Badge variant={feat.badgeVariant} size="sm">
                    {t(`features.${feat.badgeKey}`)}
                  </Badge>
                </div>

                {/* Subtitle & Title (Montserrat) */}
                <span className="font-body text-xs font-semibold text-[#016ba5] dark:text-[#38BDF8] uppercase tracking-wider block mb-1">
                  {t('vision.badge')}
                </span>
                <h3 className="font-headline text-2xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-4">
                  {t(`features.${feat.titleKey}`)}
                </h3>

                {/* Description (Roboto Mono) */}
                <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed mb-6">
                  {t(`features.${feat.descKey}`)}
                </p>

                {/* Key Bullet Highlights */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/80">
                  <div className="flex items-start gap-2.5 text-xs font-body text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <span>{t('hero.stat_ad_free_desc')}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs font-body text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                    <span>{t('hero.stat_values_desc')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <span className="font-body text-xs text-slate-500 dark:text-slate-400">
                  {t('hero.badge_safe')}
                </span>
                <a
                  href="#explore-demo"
                  className="font-headline text-xs font-bold text-[#fa8221] hover:text-[#e87313] inline-flex items-center gap-1 group"
                >
                  {t('planets.explore_planet')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl-flip transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A2540] via-[#016ba5] to-[#0A2540] p-8 sm:p-12 lg:p-14 text-white shadow-2xl border border-[#016ba5]/40 overflow-hidden">
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
          <Quote className="w-24 h-24 text-white/5 absolute -bottom-4 right-8 rtl:right-auto rtl:left-8 pointer-events-none select-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 mb-6 shadow-inner">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <blockquote className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug mb-6 text-white">
              {t('vision.quote')}
            </blockquote>

            <div className="flex flex-wrap items-center justify-center gap-3 font-body text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-white">— {t('vision.quote_author')}</span>
              <span>•</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> {t('hero.badge_safe')}
              </span>
            </div>

            <div className="mt-8">
              <Button
                variant="cta"
                size="lg"
                icon={<ArrowRight className="w-4 h-4 rtl-flip" />}
                iconPosition="right"
                onClick={() => {
                  const el = document.getElementById('explore-demo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('hero.cta_explore')}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoreFeatures;
