import React from 'react';
import { 
  Compass, 
  Map, 
  Footprints, 
  Network, 
  Sprout, 
  RefreshCw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface HowItWorksJourneyProps {
  onExploreClick?: () => void;
  className?: string;
}

export interface StepItem {
  id: string;
  number: string;
  stepIndex: number;
  titleKey: string;
  descKey: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
}

export const HowItWorksJourney: React.FC<HowItWorksJourneyProps> = ({ 
  onExploreClick,
  className = '' 
}) => {
  const { t } = useLanguage();

  const steps: StepItem[] = [
    {
      id: 'step-01',
      number: '01',
      stepIndex: 1,
      titleKey: 'how_it_works.step1_title',
      descKey: 'how_it_works.step1_desc',
      icon: <Compass className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#016ba5',
      accentBg: 'bg-sky-500/10 text-[#016ba5] dark:text-[#38bdf8] border-sky-300/60 dark:border-sky-800/60',
    },
    {
      id: 'step-02',
      number: '02',
      stepIndex: 2,
      titleKey: 'how_it_works.step2_title',
      descKey: 'how_it_works.step2_desc',
      icon: <Map className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#fa8221',
      accentBg: 'bg-orange-500/10 text-[#fa8221] dark:text-[#ff983d] border-orange-300/60 dark:border-orange-800/60',
    },
    {
      id: 'step-03',
      number: '03',
      stepIndex: 3,
      titleKey: 'how_it_works.step3_title',
      descKey: 'how_it_works.step3_desc',
      icon: <Footprints className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#10B981',
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300/60 dark:border-emerald-800/60',
    },
    {
      id: 'step-04',
      number: '04',
      stepIndex: 4,
      titleKey: 'how_it_works.step4_title',
      descKey: 'how_it_works.step4_desc',
      icon: <Network className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#7C3AED',
      accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300/60 dark:border-purple-800/60',
    },
    {
      id: 'step-05',
      number: '05',
      stepIndex: 5,
      titleKey: 'how_it_works.step5_title',
      descKey: 'how_it_works.step5_desc',
      icon: <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#0284c7',
      accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300/60 dark:border-cyan-800/60',
    },
    {
      id: 'step-06',
      number: '06',
      stepIndex: 6,
      titleKey: 'how_it_works.step6_title',
      descKey: 'how_it_works.step6_desc',
      icon: <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />,
      accentColor: '#EC4899',
      accentBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-300/60 dark:border-pink-800/60',
    },
  ];

  const handleExplore = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('continuous-world');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section 
      id="how-it-works" 
      className={cn(
        "group py-16 sm:py-20 md:py-24 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-colors",
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-b from-sky-100/40 dark:from-sky-950/20 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Centered & High Impact */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs text-[11px] sm:text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-3.5">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('how_it_works.eyebrow')}</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-3">
            {t('how_it_works.title')}
          </h2>

          <p className="font-body text-sm sm:text-base md:text-lg text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
            {t('how_it_works.subtitle')}
          </p>
        </div>

      </div>

      {/* Continuous Horizontal Scrolling Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle side fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-white dark:from-[#071727] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-white dark:from-[#071727] to-transparent z-20" />

        {/* Marquee Track: Double clone for continuous infinite loop */}
        <div className="flex w-max select-none py-2">
          {/* Primary Track Set */}
          <div 
            className="flex shrink-0 items-stretch gap-5 sm:gap-6 pe-5 sm:pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: '36s' }}
          >
            {steps.map((step) => (
              <StepCard key={`primary-${step.id}`} step={step} t={t} />
            ))}
          </div>

          {/* Duplicate Track Set for seamless infinite loop */}
          <div 
            className="flex shrink-0 items-stretch gap-5 sm:gap-6 pe-5 sm:pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: '36s' }}
            aria-hidden="true"
          >
            {steps.map((step) => (
              <StepCard key={`duplicate-${step.id}`} step={step} t={t} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom Call-to-Action Bar */}
        <div className="text-center flex justify-center mt-10 sm:mt-12">
          <button
            type="button"
            onClick={handleExplore}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#016ba5] hover:bg-[#015786] active:bg-[#00466c] text-white font-headline font-bold text-xs sm:text-sm tracking-wide shadow-[0_6px_20px_rgba(1,107,165,0.3)] hover:shadow-[0_8px_25px_rgba(1,107,165,0.4)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
          >
            <span>{t('how_it_works.cta_explore')}</span>
            <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  step: StepItem;
  t: (key: string) => string;
}

const StepCard: React.FC<StepCardProps> = ({ step, t }) => {
  return (
    <div 
      className="group/card relative flex flex-col justify-between w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-white/95 dark:bg-[#0c2238]/90 backdrop-blur-sm p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-300 hover:-translate-y-1 select-none text-left rtl:text-right"
    >
      {/* Top accent line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl sm:rounded-t-3xl opacity-80"
        style={{ backgroundColor: step.accentColor }}
      />

      {/* Header: Step Number Badge & Node Icon */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {/* Step Number Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-headline font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 text-[#fa8221] dark:text-[#ff983d] shadow-2xs">
            <span>{t('how_it_works.step_label') || 'Step'}</span>
            <span>{step.number}</span>
          </span>

          {/* Rounded Icon Node */}
          <div className={cn(
            "w-11 h-11 rounded-xl border flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover/card:scale-110",
            step.accentBg
          )}>
            {step.icon}
          </div>
        </div>

        {/* Step Title */}
        <h3 className="font-headline text-lg sm:text-xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2 group-hover/card:text-[#016ba5] dark:group-hover/card:text-[#38bdf8] transition-colors leading-snug">
          {t(step.titleKey)}
        </h3>

        {/* Step Description */}
        <p className="font-body text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
          {t(step.descKey)}
        </p>
      </div>

      {/* Bottom Progress Connector Row */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
        <span className="font-mono">
          {step.number} {t('how_it_works.step_of') || 'of 6'}
        </span>
        <div className="inline-flex items-center gap-1 text-[#016ba5] dark:text-[#38bdf8] opacity-80 group-hover/card:opacity-100 group-hover/card:translate-x-1 rtl:group-hover/card:-translate-x-1 transition-all">
          <span className="text-[10px] uppercase tracking-wider font-headline">AbtalQuest</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </div>
      </div>
    </div>
  );
};

export default HowItWorksJourney;
