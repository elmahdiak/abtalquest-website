import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Smartphone, 
  Star, 
  Heart, 
  CheckCircle2,
  Lock,
  Play
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { useLanguage } from '../../context/LanguageContext';

export interface HeroProps {
  onExploreClick?: () => void;
  onWorldsClick?: () => void;
  onDownloadClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onWorldsClick, onDownloadClick }) => {
  const { t } = useLanguage();

  const handleWorldsClick = () => {
    if (onWorldsClick) {
      onWorldsClick();
    } else if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('planet-worlds') || document.getElementById('planets');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#016ba5]/10 via-white to-slate-50/60 dark:from-[#0A2540] dark:via-[#071727] dark:to-[#0A2540] pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-100 dark:border-slate-800">
      {/* Ambient background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-[#016ba5]/15 via-[#fa8221]/12 to-[#7C3AED]/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & Actions (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right">
            
            {/* Core Brand Creed Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fa8221]/10 dark:bg-[#fa8221]/20 border border-[#fa8221]/30 text-[#e87313] dark:text-[#fb923c] text-xs sm:text-sm font-bold mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#fa8221] flex-shrink-0 animate-pulse" />
              <span>"{t('hero.creed')}"</span>
            </div>

            {/* Security & Values Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <Badge variant="success" size="md" icon={<ShieldCheck className="w-4 h-4" />}>
                {t('hero.badge_safe')}
              </Badge>
              <Badge variant="warning" size="md" icon={<Lock className="w-3.5 h-3.5" />}>
                {t('nav.safety_ticker_bold_1')} • {t('nav.safety_ticker_bold_2')}
              </Badge>
              <Badge variant="gamification" size="md" icon={<Star className="w-3.5 h-3.5" />}>
                {t('hero.badge_kids')}
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#1E293B] dark:text-white tracking-tight leading-[1.15] mb-5 break-words">
              {t('hero.title_prefix')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221]">
                {t('hero.title_highlight')}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="font-body text-base sm:text-lg text-[#475569] dark:text-slate-200 leading-relaxed mb-4 max-w-2xl font-medium">
              {t('hero.subtitle')}
            </p>

            {/* Ad-Free Standard Motto Callout */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-8 max-w-2xl">
              <ShieldCheck className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-white">{t('hero.ad_free_motto')}</span>
            </div>

            {/* Primary Call-to-Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              {/* CTA Button 1: Start Your Adventure */}
              <Button
                variant="cta"
                size="lg"
                icon={<Compass className="w-5 h-5" />}
                iconPosition="left"
                onClick={onExploreClick}
                className="w-full sm:w-auto shadow-cta hover:shadow-cta-hover transform hover:-translate-y-0.5 bg-[#016ba5] hover:bg-[#015684] text-white"
              >
                {t('hero.cta_adventure')}
              </Button>

              {/* CTA Button 2: Explore the Planet Worlds */}
              <Button
                variant="outline"
                size="lg"
                icon={<Sparkles className="w-5 h-5 text-[#fa8221]" />}
                iconPosition="left"
                onClick={handleWorldsClick}
                className="w-full sm:w-auto transform hover:-translate-y-0.5"
              >
                {t('hero.cta_worlds')}
              </Button>

              {/* CTA Button 3: Download App */}
              <Button
                variant="cta"
                size="lg"
                icon={<Smartphone className="w-5 h-5" />}
                iconPosition="left"
                onClick={onDownloadClick}
                className="w-full sm:w-auto bg-[#fa8221] hover:bg-[#e87313] text-white shadow-cta hover:shadow-cta-hover transform hover:-translate-y-0.5"
              >
                {t('hero.cta_download')}
              </Button>
            </div>

            {/* Safe Childhood Assurance Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 w-full text-xs font-body text-[#64748B] dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>{t('hero.stat_ad_free_desc')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>{t('hero.stat_values_desc')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>{t('hero.stat_offline_desc')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Universe Card (Cols 8-12) */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            
            {/* Ambient decorative glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#016ba5]/40 via-[#fa8221]/30 to-[#7C3AED]/30 rounded-[32px] blur-2xl opacity-60" />

            {/* Interactive Universe Showcase Card */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-white to-slate-50 dark:from-[#0F2F4E] dark:to-[#0A2540] border-2 border-white/80 dark:border-[#1E4068] shadow-2xl rounded-3xl p-6 sm:p-7 overflow-hidden">
              
              {/* Top Card Navigation / Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#016ba5] text-white flex items-center justify-center shadow-brand">
                    <Compass className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-headline text-xs font-bold text-[#016ba5] dark:text-[#38BDF8] uppercase tracking-wider block">
                      {t('hero.preview_badge')}
                    </span>
                    <span className="font-headline text-base font-extrabold text-[#1E293B] dark:text-white">
                      {t('hero.preview_title')}
                    </span>
                  </div>
                </div>

                <Badge variant="gamification" size="sm" icon={<Star className="w-3.5 h-3.5 fill-current" />}>
                  {t('hero.preview_xp')}
                </Badge>
              </div>

              {/* Dynamic Child Hero Illustration Container */}
              <div className="relative rounded-2xl bg-[#0A2540] p-6 text-white overflow-hidden shadow-inner mb-5 border border-[#016ba5]/30">
                {/* Background Stars / Sparks */}
                <div className="absolute top-2 right-4 text-amber-300 opacity-60">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="absolute bottom-3 left-4 text-sky-400 opacity-50">
                  <Heart className="w-4 h-4" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center py-2">
                  {/* Guardian Character Emblem */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#016ba5] to-[#38BDF8] p-1 shadow-lg mb-3 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-[#0A2540] flex items-center justify-center text-white">
                      {/* Official AbtalQuest Character Emblem */}
                      <AbtalQuestLogo mode="emblem" variant="dark" size="sm" showText={false} />
                    </div>
                  </div>

                  <span className="font-headline text-lg font-bold text-white mb-1">
                    {t('hero.preview_tag_1')}
                  </span>
                  <span className="font-body text-xs text-slate-300">
                    {t('hero.preview_tag_2')}
                  </span>

                  {/* Gamified progress bar */}
                  <div className="w-full mt-4 space-y-1">
                    <div className="flex justify-between font-body text-[11px] text-slate-300">
                      <span>{t('hero.stat_values')}</span>
                      <span className="text-[#38BDF8] font-semibold">{t('hero.preview_xp')}</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#016ba5] via-[#38BDF8] to-[#22C55E] rounded-full w-[80%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Feature Badges below card */}
              <div className="grid grid-cols-2 gap-3 font-body text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 block text-[11px]">{t('hero.stat_ad_free')}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{t('nav.safety_ticker_bold_1')}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100 block text-[11px]">{t('hero.stat_values')}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{t('hero.stat_values_desc')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
