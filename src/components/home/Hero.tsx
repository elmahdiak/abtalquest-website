import React from 'react';
import { 
  Sparkles, 
  ArrowRight,
  Compass,
  Star
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-white dark:from-[#06152B] dark:via-[#091E3A] dark:to-[#06152B] pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24 border-b border-slate-100 dark:border-slate-800">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#016ba5]/10 dark:bg-[#016ba5]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-[#fa8221]/10 dark:bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right">
            
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-xs text-xs font-headline font-bold text-[#016ba5] dark:text-[#38bdf8] mb-6 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
              <span className="tracking-wide uppercase">{t('hero.eyebrow_world')}</span>
            </div>

            {/* Main Headline (H1 on two lines) */}
            <h1 className="font-headline text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-[1.12] mb-5">
              <span>{t('hero.title_turn_screen_time')}</span>
              <span className="block text-[#016ba5] dark:text-[#38bdf8] mt-1 sm:mt-1.5">
                {t('hero.title_into_growth')}
              </span>
            </h1>

            {/* Clear Descriptive Paragraph */}
            <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl font-normal">
              {t('hero.subtitle_growth')}
            </p>

            {/* Two Side-by-Side Call-To-Action (CTA) Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto mb-8">
              {/* Primary Action Button (Orange Filled) */}
              <button
                type="button"
                onClick={onDownloadClick}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-headline font-bold text-sm sm:text-base shadow-[0_8px_20px_rgba(250,130,33,0.38)] hover:shadow-[0_10px_25px_rgba(250,130,33,0.48)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
              >
                <span>{t('hero.btn_download_app')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              {/* Secondary Action Button (Elegant Bordered) */}
              <button
                type="button"
                onClick={handleSeeHowItWorks}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300/90 dark:border-slate-700 font-headline font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xs hover:shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
              >
                <span>{t('hero.btn_see_how_it_works')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>
            </div>

            {/* Informative Text Line with Separator Dots */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm font-body font-semibold text-slate-600 dark:text-slate-300">
              <span>{t('hero.bullet_ages')}</span>
              <span className="text-[#fa8221] font-black text-base leading-none">•</span>
              <span>{t('hero.bullet_child_first')}</span>
              <span className="text-[#fa8221] font-black text-base leading-none">•</span>
              <span>{t('hero.bullet_real_world')}</span>
            </div>

          </div>

          {/* Right Column: Interactive Smartphone Mockup & Floating Badges (col-span-5) */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-8 lg:py-6">
            
            {/* Visual Center Wrapper */}
            <div className="relative w-full max-w-[280px] xs:max-w-[300px] sm:max-w-[320px] md:max-w-[330px] flex items-center justify-center">
              
              {/* Soft Radial Backlight Glow */}
              <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-tr from-[#016ba5]/25 via-[#38bdf8]/20 to-[#fa8221]/25 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Floating Badge 1: Quests (Top-Left) */}
              <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-8 lg:-left-10 z-30 animate-float-slow">
                <div className="relative flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-sky-200/90 dark:border-sky-800/80 shadow-[0_10px_25px_rgba(1,107,165,0.18)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.6)] group hover:scale-105 transition-transform duration-200 select-none">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-400 to-[#016ba5] flex items-center justify-center text-white shadow-sm shadow-sky-500/30 shrink-0">
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-headline font-black text-xs sm:text-sm text-[#0F2A4A] dark:text-white uppercase tracking-wider block">
                      {t('hero.badge_quests')}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                      {t('hero.badge_quests_status')}
                    </span>
                  </div>
                  {/* Subtle connecting dotted cue */}
                  <div className="hidden sm:block absolute -right-3 top-1/2 w-3 border-b-2 border-dashed border-sky-400/60 pointer-events-none rtl:right-auto rtl:-left-3" />
                </div>
              </div>

              {/* Floating Badge 2: Missions (Middle-Upper Right) */}
              <div className="absolute top-1/4 -right-4 sm:-right-8 lg:-right-10 z-30 animate-float-alt">
                <div className="relative flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-200/90 dark:border-amber-800/80 shadow-[0_10px_25px_rgba(250,130,33,0.2)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.6)] group hover:scale-105 transition-transform duration-200 select-none">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#fa8221] flex items-center justify-center text-white shadow-sm shadow-orange-500/30 shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="font-headline font-black text-xs sm:text-sm text-[#0F2A4A] dark:text-white uppercase tracking-wider block">
                      {t('hero.badge_missions')}
                    </span>
                    <span className="text-[10px] font-bold text-[#fa8221] dark:text-amber-400 block">
                      {t('hero.badge_missions_status')}
                    </span>
                  </div>
                  {/* Subtle connecting dotted cue */}
                  <div className="hidden sm:block absolute -left-3 top-1/2 w-3 border-b-2 border-dashed border-amber-400/60 pointer-events-none rtl:left-auto rtl:-right-3" />
                </div>
              </div>

              {/* Floating Badge 3: Rewards (Bottom-Left) */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-8 lg:-left-8 z-30 animate-float-slow">
                <div className="relative flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-purple-200/90 dark:border-purple-800/80 shadow-[0_10px_25px_rgba(124,58,237,0.2)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.6)] group hover:scale-105 transition-transform duration-200 select-none">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-400 to-[#7C3AED] flex items-center justify-center text-white shadow-sm shadow-purple-500/30 shrink-0">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  </div>
                  <div>
                    <span className="font-headline font-black text-xs sm:text-sm text-[#0F2A4A] dark:text-white uppercase tracking-wider block">
                      {t('hero.badge_rewards')}
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 font-mono block">
                      {t('hero.badge_rewards_status')}
                    </span>
                  </div>
                  {/* Subtle connecting dotted cue */}
                  <div className="hidden sm:block absolute -right-3 top-1/2 w-3 border-b-2 border-dashed border-purple-400/60 pointer-events-none rtl:right-auto rtl:-left-3" />
                </div>
              </div>

              {/* iPhone Mockup Frame */}
              <div className="relative w-full rounded-[46px] bg-slate-950 p-2.5 sm:p-3 shadow-[0_25px_60px_-15px_rgba(15,42,74,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-[5px] border-slate-800 ring-1 ring-slate-700/60 select-none">
                
                {/* Left Side Volume / Silent Switch */}
                <div className="absolute -left-[7px] top-24 w-[3px] h-7 bg-slate-700 rounded-l-xs" />
                <div className="absolute -left-[7px] top-36 w-[3px] h-11 bg-slate-700 rounded-l-xs" />
                <div className="absolute -left-[7px] top-50 w-[3px] h-11 bg-slate-700 rounded-l-xs" />

                {/* Right Side Power Button */}
                <div className="absolute -right-[7px] top-32 w-[3px] h-14 bg-slate-700 rounded-r-xs" />

                {/* Dynamic Island Pill */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30 flex items-center justify-end pr-2.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700/80" />
                </div>

                {/* Screen Display Container */}
                <div className="relative rounded-[36px] overflow-hidden bg-slate-950 aspect-[9/18] group">
                  {/* Character in Floating Islands Portal Artwork */}
                  <img
                    src="/hero-portal.jpg"
                    alt="AbtalQuest Hero Adventure World"
                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />

                  {/* Bottom Interactive CTA Pill inside Phone */}
                  <div className="absolute bottom-5 left-0 right-0 px-5 z-20 flex justify-center">
                    <button
                      type="button"
                      onClick={onDownloadClick}
                      className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#fa8221] to-[#ff983d] text-white font-headline font-black text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-orange-500/40 hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      {t('hero.btn_join_quest')}
                    </button>
                  </div>

                  {/* Soft bottom vignette overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
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
