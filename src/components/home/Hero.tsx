import React from 'react';
import { 
  Sparkles, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface HeroProps {
  onDownloadClick?: () => void;
  onSeeHowItWorksClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onDownloadClick,
  onSeeHowItWorksClick,
}) => {
  const { t } = useLanguage();

  const handleSeeHowItWorks = () => {
    if (onSeeHowItWorksClick) {
      onSeeHowItWorksClick();
    } else {
      const el = document.getElementById('how-it-works');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-white dark:from-[#06152B] dark:via-[#091E3A] dark:to-[#06152B] pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-slate-100 dark:border-slate-800">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-r from-[#016ba5]/10 via-[#38bdf8]/15 to-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Centered Content: Eyebrow, Headline, Subtitle, CTAs, Feature Bullets */}
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center mb-10 sm:mb-14">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] mb-6 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8] flex-shrink-0" />
            <span className="tracking-wide uppercase">{t('hero.eyebrow_world')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-[1.12] mb-5">
            {t('hero.title_turn_screen_time')}<br />
            <span className="text-[#016ba5] dark:text-[#38bdf8]">{t('hero.title_into_growth')}</span>
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg text-[#475569] dark:text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
            {t('hero.subtitle_growth')}
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
            {/* Primary CTA: Orange Pill Button */}
            <button
              type="button"
              onClick={onDownloadClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-headline font-bold text-base shadow-[0_6px_20px_rgba(250,130,33,0.38)] hover:shadow-[0_8px_26px_rgba(250,130,33,0.48)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
            >
              <span>{t('hero.btn_download_app')}</span>
              <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {/* Secondary CTA: Clean White Pill Button */}
            <button
              type="button"
              onClick={handleSeeHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 font-headline font-bold text-sm tracking-wider uppercase shadow-xs hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
            >
              <span>{t('hero.btn_see_how_it_works')}</span>
              <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Feature Bullet List / Micro-reassurances */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-body font-semibold text-[#0F2A4A] dark:text-slate-300">
            <span>{t('hero.bullet_ages')}</span>
            <span className="text-[#fa8221] text-base">•</span>
            <span>{t('hero.bullet_child_first')}</span>
            <span className="text-[#fa8221] text-base">•</span>
            <span>{t('hero.bullet_real_world')}</span>
          </div>

        </div>

        {/* Hero Visual Mockup: Realistic Smartphone Frame with Floating Tags */}
        <div className="relative max-w-sm sm:max-w-md mx-auto pt-4 flex justify-center">
          
          {/* Subtle glow underneath phone */}
          <div className="absolute -inset-4 bg-gradient-to-t from-[#016ba5]/25 via-[#38bdf8]/20 to-transparent rounded-full blur-2xl opacity-70 -z-10" />

          {/* Phone Frame */}
          <div className="relative w-full rounded-[44px] bg-slate-900 p-3 sm:p-3.5 shadow-2xl border-4 border-slate-800/90 ring-1 ring-black/40 overflow-hidden">
            
            {/* Dynamic Island / Top Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            </div>

            {/* Screen Inner Display */}
            <div className="relative rounded-[36px] overflow-hidden bg-slate-950 aspect-[9/16] sm:aspect-[9/15]">
              <img
                src="/hero-portal.jpg"
                alt="AbtalQuest Hero Adventure World"
                className="w-full h-full object-cover select-none"
              />

              {/* Floating Badge 1: Top-Left "QUESTS" */}
              <div className="absolute top-10 left-3 sm:left-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#0284c7]/30 text-[#0284c7] dark:text-[#38bdf8] font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                  <Compass className="w-3 h-3 text-[#0284c7] animate-spin-slow" />
                  <span>{t('hero.badge_quests')}</span>
                </span>
              </div>

              {/* Floating Badge 2: Top-Right "MISSIONS" */}
              <div className="absolute top-16 right-3 sm:right-4 z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#016ba5]/30 text-[#016ba5] dark:text-[#38bdf8] font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{t('hero.badge_missions')}</span>
                </span>
              </div>

              {/* Floating Badge 3: Bottom-Left "REWARDS" */}
              <div className="absolute bottom-20 left-3 sm:left-4 z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#7C3AED]/30 text-[#7C3AED] dark:text-purple-300 font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                  <span>★</span>
                  <span>{t('hero.badge_rewards')}</span>
                </span>
              </div>

              {/* Bottom Interactive Button inside phone: "Join the quest" */}
              <div className="absolute bottom-6 left-0 right-0 px-6 z-20 flex justify-center">
                <button
                  type="button"
                  onClick={onDownloadClick}
                  className="w-full py-2.5 px-5 rounded-full bg-gradient-to-r from-[#fa8221] to-[#ff983d] text-white font-headline font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer"
                >
                  {t('hero.btn_join_quest')}
                </button>
              </div>

              {/* Soft bottom vignette overlay */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;
