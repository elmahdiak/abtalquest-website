import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface OneContinuousWorldProps {
  onJoinQuestClick?: () => void;
}

export const OneContinuousWorld: React.FC<OneContinuousWorldProps> = ({ onJoinQuestClick }) => {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t('continuous_world.pillar_quests_title'),
      description: t('continuous_world.pillar_quests_desc'),
      color: 'border-l-[#016ba5] rtl:border-r-[#016ba5]',
    },
    {
      title: t('continuous_world.pillar_stories_title'),
      description: t('continuous_world.pillar_stories_desc'),
      color: 'border-l-[#fa8221] rtl:border-r-[#fa8221]',
    },
    {
      title: t('continuous_world.pillar_games_title'),
      description: t('continuous_world.pillar_games_desc'),
      color: 'border-l-[#7C3AED] rtl:border-r-[#7C3AED]',
    },
    {
      title: t('continuous_world.pillar_missions_title'),
      description: t('continuous_world.pillar_missions_desc'),
      color: 'border-l-[#22C55E] rtl:border-r-[#22C55E]',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F4F9FD]/60 dark:bg-[#06152B]/60 relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Visual Mockup with Adventurer & Badges (Cols 1-6) */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Background ambient lighting */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#016ba5]/20 via-[#38bdf8]/15 to-[#fa8221]/15 rounded-[48px] blur-2xl opacity-60" />

              {/* Phone Frame Mockup */}
              <div className="relative rounded-[44px] bg-slate-900 p-3 sm:p-3.5 shadow-2xl border-4 border-slate-800/90 ring-1 ring-black/40 overflow-hidden">
                
                {/* Dynamic island notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                </div>

                {/* Inner Screen Display */}
                <div className="relative rounded-[36px] overflow-hidden bg-slate-950 aspect-[9/15]">
                  <img
                    src="/hero-running.jpg"
                    alt="AbtalQuest Boy Adventurer Running"
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-10 left-3 sm:left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#0284c7]/30 text-[#0284c7] dark:text-[#38bdf8] font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                      <Compass className="w-3 h-3 text-[#0284c7]" />
                      <span>{t('hero.badge_quests')}</span>
                    </span>
                  </div>

                  <div className="absolute top-16 right-3 sm:right-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#016ba5]/30 text-[#016ba5] dark:text-[#38bdf8] font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{t('hero.badge_missions')}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-20 left-3 sm:left-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-[#7C3AED]/30 text-[#7C3AED] dark:text-purple-300 font-headline font-black text-[11px] tracking-wider uppercase shadow-md">
                      <span>★</span>
                      <span>{t('hero.badge_rewards')}</span>
                    </span>
                  </div>

                  {/* Action button inside phone */}
                  <div className="absolute bottom-6 left-0 right-0 px-6 z-20 flex justify-center">
                    <button
                      type="button"
                      onClick={onJoinQuestClick}
                      className="w-full py-2.5 px-5 rounded-full bg-gradient-to-r from-[#fa8221] to-[#ff983d] text-white font-headline font-black text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      {t('hero.btn_join_quest')}
                    </button>
                  </div>

                  {/* Vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Headings & 4 Pillars (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-8 order-1 lg:order-2 text-left rtl:text-right">
            <div>
              <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-3">
                {t('continuous_world.eyebrow')}
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-4">
                {t('continuous_world.title')}
              </h2>
              <p className="font-body text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
                {t('continuous_world.subtitle')}
              </p>
            </div>

            {/* 4 Feature Items */}
            <div className="space-y-4 pt-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className={`bg-white dark:bg-[#0c2238] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-card-soft transition-all duration-200 pl-5 rtl:pl-6 rtl:pr-5 border-l-4 rtl:border-l-0 rtl:border-r-4 ${pillar.color}`}
                >
                  <h3 className="font-headline text-lg sm:text-xl font-bold text-[#0F2A4A] dark:text-white mb-1">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default OneContinuousWorld;
