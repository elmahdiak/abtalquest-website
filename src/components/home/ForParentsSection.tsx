import React, { useState } from 'react';
import { 
  Compass, 
  Lightbulb, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface ForParentsSectionProps {
  id?: string;
  className?: string;
  onDiscoverClick?: () => void;
}

type PillarType = 'guidance' | 'insight' | 'connection';

export const ForParentsSection: React.FC<ForParentsSectionProps> = ({
  id = 'for-parents',
  className = '',
  onDiscoverClick,
}) => {
  const { t, direction } = useLanguage();
  const [activePillar, setActivePillar] = useState<PillarType>('guidance');

  const pillarsConfig = [
    {
      id: 'guidance' as PillarType,
      title: t('for_parents.badge_guidance_title') || 'Guidance',
      subtitle: t('for_parents.badge_guidance_desc') || 'Ages 4–7 • Social-Emotional Learning',
      icon: Compass,
      imgPosition: '0% center',
      summary: t('for_parents.pillar_1') || 'Science-backed educational psychology',
      ageBracket: 'Ages 4–7',
      metaTitle: t('for_parents.guidance_meta_title') || 'GUIDANCE',
      metaSubtitle: t('for_parents.guidance_meta_subtitle') || 'Ages 4–7 • Social-Emotional Learning',
      metaDesc: t('for_parents.guidance_meta_desc') || 'Personalized screen-free daily family quests and behavioral habit tracking for early childhood development.',
    },
    {
      id: 'insight' as PillarType,
      title: t('for_parents.badge_insight_title') || 'Insight',
      subtitle: t('for_parents.badge_insight_desc') || 'Ages 8–10 • Critical Thinking & Logic',
      icon: Lightbulb,
      imgPosition: '50% center',
      summary: t('for_parents.pillar_2') || 'Balanced screen-time reorientation',
      ageBracket: 'Ages 8–10',
      metaTitle: 'INSIGHT',
      metaSubtitle: t('for_parents.badge_insight_desc') || 'Ages 8–10 • Critical Thinking & Logic',
      metaDesc: 'Interactive milestone mapping, curiosity-driven challenges, and cognitive autonomy diagnostics.',
    },
    {
      id: 'connection' as PillarType,
      title: t('for_parents.badge_connection_title') || 'Connection',
      subtitle: t('for_parents.badge_connection_desc') || 'Ages 11–13+ • Real-World Character & Bonding',
      icon: Users,
      imgPosition: '100% center',
      summary: t('for_parents.pillar_3') || 'Character & emotional resilience',
      ageBracket: 'Ages 11–13+',
      metaTitle: 'CONNECTION',
      metaSubtitle: t('for_parents.badge_connection_desc') || 'Ages 11–13+ • Real-World Character & Bonding',
      metaDesc: 'Shared co-op quests and parent-child collaborative milestones to strengthen lasting bonds before adolescence.',
    },
  ];

  const currentPillar = pillarsConfig.find((p) => p.id === activePillar) || pillarsConfig[0];

  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-28 pb-28 sm:pb-28 bg-gradient-to-b from-[#F9FAFC] via-white to-[#F9FAFC] dark:from-[#07162c] dark:via-[#091E3A] dark:to-[#07162c] border-b border-slate-100 dark:border-slate-800/80 overflow-hidden transition-colors',
        className
      )}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#fa8221]/5 dark:bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#016ba5]/5 dark:bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Editorial, Headline, Pillars & Action Button      */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right">
            
            {/* 1. Category Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 text-xs font-headline font-black text-[#fa8221] dark:text-orange-400 uppercase tracking-widest mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#fa8221]" />
              <span>{t('for_parents.eyebrow')}</span>
            </div>

            {/* 2. Main Headline */}
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-[1.18] mb-5">
              {t('for_parents.headline')}
            </h2>

            {/* 3. Descriptive Paragraph */}
            <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
              {t('for_parents.description')}
            </p>

            {/* 4. Three Pillars Interactive Micro-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-8">
              {pillarsConfig.map((pillar) => {
                const Icon = pillar.icon;
                const isActive = activePillar === pillar.id;

                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillar(pillar.id)}
                    className={cn(
                      'p-3.5 rounded-2xl border text-left rtl:text-right transition-all duration-200 cursor-pointer flex flex-col justify-between group',
                      isActive
                        ? 'bg-slate-50 dark:bg-slate-800/90 border-[#fa8221] shadow-sm ring-1 ring-[#fa8221]/30'
                        : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={cn(
                        'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs',
                        pillar.id === 'guidance' 
                          ? 'bg-[#fa8221] text-white' 
                          : pillar.id === 'insight'
                          ? 'bg-[#016ba5] text-white'
                          : 'bg-emerald-600 text-white'
                      )}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {pillar.title}
                      </span>
                    </div>
                    <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {pillar.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* 5. CTA Button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onDiscoverClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white font-headline text-sm sm:text-base font-black tracking-wider uppercase shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
              >
                <span>{t('for_parents.cta_button')}</span>
                <ArrowRight 
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:translate-x-1.5',
                    direction === 'rtl' ? 'rtl:rotate-180 rtl:group-hover:-translate-x-1.5' : ''
                  )} 
                />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{t('for_parents.pillar_1')}</span>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Realistic Phone Mockup & Floating Badges         */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 flex justify-center items-center relative pt-10 pb-8 sm:py-8 mt-6 lg:mt-0">
            <div className="relative w-full max-w-[280px] xs:max-w-[305px] sm:max-w-[340px]">

              {/* Ambient radial blur backlight behind the smartphone */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-[#016ba5]/15 via-[#fa8221]/15 to-[#38bdf8]/15 rounded-[56px] blur-3xl opacity-75 pointer-events-none" />

              {/* -------------------------------------------------------- */}
              {/* FLOATING CARD 1: Guidance (Top-Left)                     */}
              {/* Non-overlapping, responsive coordinates & clear Z-index  */}
              {/* -------------------------------------------------------- */}
              <div
                onClick={() => setActivePillar('guidance')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePillar('guidance');
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Guidance: Ages 4-7 Social-Emotional Learning"
                className={cn(
                  'absolute -top-4 xs:-top-5 sm:-top-7 -left-1.5 xs:-left-2 sm:-left-6 lg:-left-8 cursor-pointer select-none',
                  'rtl:-left-auto rtl:-right-1.5 xs:rtl:-right-2 sm:rtl:-right-6 lg:rtl:-right-8',
                  'transition-all duration-300 transform rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5',
                  'w-auto max-w-[215px] xs:max-w-[235px] sm:max-w-[275px]',
                  activePillar === 'guidance'
                    ? 'bg-white dark:bg-slate-900 border-2 border-[#fa8221] shadow-xl shadow-orange-500/20 ring-2 ring-[#fa8221]/20 scale-[1.02] z-40'
                    : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:border-[#fa8221]/50 hover:scale-[1.01] z-30'
                )}
              >
                {/* Orange-accented square icon */}
                <div className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs',
                  activePillar === 'guidance'
                    ? 'bg-[#fa8221] text-white'
                    : 'border-2 border-[#fa8221] bg-orange-50 dark:bg-orange-950/60 text-[#fa8221]'
                )}>
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                
                {/* Text Content */}
                <div className="text-left rtl:text-right min-w-0 flex-1">
                  <div className="font-headline font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate">
                    {t('for_parents.badge_guidance_title')}
                  </div>
                  <div className="font-body text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 leading-snug line-clamp-1">
                    {t('for_parents.badge_guidance_desc')}
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* FLOATING CARD 2: Insight (Upper-Right)                   */}
              {/* Perfectly staggered vertically & horizontally            */}
              {/* -------------------------------------------------------- */}
              <div
                onClick={() => setActivePillar('insight')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActivePillar('insight');
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Insight: Ages 8-10 Critical Thinking & Logic"
                className={cn(
                  'absolute top-20 xs:top-24 sm:top-20 -right-1.5 xs:-right-2 sm:-right-6 lg:-right-8 cursor-pointer select-none',
                  'rtl:-right-auto rtl:-left-1.5 xs:rtl:-left-2 sm:rtl:-left-6 lg:rtl:-left-8',
                  'transition-all duration-300 transform rounded-2xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5',
                  'w-auto max-w-[205px] xs:max-w-[225px] sm:max-w-[265px]',
                  activePillar === 'insight'
                    ? 'bg-white dark:bg-slate-900 border-2 border-[#016ba5] shadow-xl shadow-sky-500/20 ring-2 ring-[#016ba5]/20 scale-[1.02] z-40'
                    : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/80 shadow-md hover:border-[#016ba5]/50 hover:scale-[1.01] z-30'
                )}
              >
                {/* Blue-accented square icon */}
                <div className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs',
                  activePillar === 'insight'
                    ? 'bg-[#016ba5] text-white'
                    : 'border-2 border-[#016ba5] bg-sky-50 dark:bg-sky-950/60 text-[#016ba5]'
                )}>
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>

                {/* Text Content */}
                <div className="text-left rtl:text-right min-w-0 flex-1">
                  <div className="font-headline font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate">
                    {t('for_parents.badge_insight_title')}
                  </div>
                  <div className="font-body text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 leading-snug line-clamp-1">
                    {t('for_parents.badge_insight_desc')}
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------- */}
              {/* Realistic Smartphone Chassis Frame                       */}
              {/* Clean bezels, layered below floating cards at z-10       */}
              {/* -------------------------------------------------------- */}
              <div className="relative rounded-[44px] sm:rounded-[48px] bg-slate-950 p-2 sm:p-2.5 shadow-2xl border-4 border-slate-800 ring-1 ring-black/40 overflow-hidden mt-3 z-10">
                
                {/* Inner Screen Container */}
                <div className="relative rounded-[36px] sm:rounded-[40px] overflow-hidden bg-slate-950 aspect-[9/16] flex flex-col justify-between">
                  
                  {/* Main Art Showcase Display */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src="/for-parents-mockup.jpg"
                      alt="When parents grow, children grow with them - AbtalQuest Graphic"
                      className="w-full h-full object-cover transition-all duration-700 ease-out select-none"
                      style={{
                        objectPosition: currentPillar.imgPosition,
                      }}
                    />

                    {/* Gradient overlay for bottom card legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                    {/* ---------------------------------------------------- */}
                    {/* Bottom Info Panel: Cleanly Layered at z-20          */}
                    {/* Non-overlapping, compact typography, developmental  */}
                    {/* ---------------------------------------------------- */}
                    <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2.5 sm:inset-x-3 p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-white z-20 shadow-xl">
                      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                        <span className={cn(
                          'text-[10px] sm:text-[11px] font-headline font-black tracking-wider uppercase',
                          activePillar === 'guidance'
                            ? 'text-[#fa8221]'
                            : activePillar === 'insight'
                            ? 'text-[#38bdf8]'
                            : 'text-emerald-400'
                        )}>
                          {currentPillar.metaTitle}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono font-medium">
                          Pillar {pillarsConfig.findIndex(p => p.id === activePillar) + 1} / 3
                        </span>
                      </div>
                      
                      {/* Subtitle matching active pillar */}
                      <h4 className="text-xs sm:text-sm font-headline font-bold text-white leading-snug line-clamp-1">
                        {currentPillar.metaSubtitle}
                      </h4>
                      
                      {/* Description */}
                      <p className="text-[10px] sm:text-[11px] font-body text-slate-300 mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">
                        {currentPillar.metaDesc}
                      </p>

                      {/* Consolidated Developmental Age Bracket Metadata Tabs */}
                      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 pt-2 border-t border-slate-800">
                        {pillarsConfig.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setActivePillar(p.id)}
                            className={cn(
                              'py-1 sm:py-1.5 px-1 rounded-lg text-[9px] sm:text-[10px] font-headline font-bold text-center transition-all cursor-pointer truncate',
                              activePillar === p.id
                                ? p.id === 'guidance'
                                  ? 'bg-[#fa8221] text-white shadow-xs'
                                  : p.id === 'insight'
                                  ? 'bg-[#016ba5] text-white shadow-xs'
                                  : 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-800/80 text-slate-400 hover:text-white'
                            )}
                          >
                            {p.ageBracket}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Phone Home Indicator Bar */}
                  <div className="pb-1.5 pt-1 flex justify-center z-30 bg-slate-950">
                    <div className="w-24 h-1 bg-white/40 rounded-full" />
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

export default ForParentsSection;
