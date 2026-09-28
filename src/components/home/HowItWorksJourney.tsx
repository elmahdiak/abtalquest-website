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

export interface HowItWorksJourneyProps {
  onExploreClick?: () => void;
  className?: string;
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HowItWorksJourney: React.FC<HowItWorksJourneyProps> = ({ 
  onExploreClick,
  className = '' 
}) => {
  const { t } = useLanguage();

  const steps: StepItem[] = [
    {
      number: '01',
      title: t('how_it_works.step1_title'),
      description: t('how_it_works.step1_desc'),
      icon: <Compass className="w-6 h-6" />,
    },
    {
      number: '02',
      title: t('how_it_works.step2_title'),
      description: t('how_it_works.step2_desc'),
      icon: <Map className="w-6 h-6" />,
    },
    {
      number: '03',
      title: t('how_it_works.step3_title'),
      description: t('how_it_works.step3_desc'),
      icon: <Footprints className="w-6 h-6" />,
    },
    {
      number: '04',
      title: t('how_it_works.step4_title'),
      description: t('how_it_works.step4_desc'),
      icon: <Network className="w-6 h-6" />,
    },
    {
      number: '05',
      title: t('how_it_works.step5_title'),
      description: t('how_it_works.step5_desc'),
      icon: <Sprout className="w-6 h-6" />,
    },
    {
      number: '06',
      title: t('how_it_works.step6_title'),
      description: t('how_it_works.step6_desc'),
      icon: <RefreshCw className="w-6 h-6" />,
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
      className={`py-20 sm:py-28 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800 ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#EBF5FB]/70 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('how_it_works.eyebrow')}</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-4">
            {t('how_it_works.title')}
          </h2>

          <p className="font-body text-base sm:text-lg text-[#475569] dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {t('how_it_works.subtitle')}
          </p>
        </div>

        {/* 6-Step Horizontal Process Flow */}
        <div className="relative mb-16 sm:mb-20">
          
          {/* Horizontal connecting dashed line spanning across steps on desktop */}
          <div className="hidden lg:block absolute top-[52px] left-[7%] right-[7%] h-0.5 border-t-2 border-dashed border-sky-300/80 dark:border-sky-800/80 z-0 pointer-events-none" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-6 lg:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div 
                key={step.number}
                className="group relative flex flex-col items-center text-center bg-slate-50/70 dark:bg-[#0c2238]/60 hover:bg-white dark:hover:bg-[#0c2238] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-card-soft transition-all duration-300 select-none"
              >
                {/* Step Number in Orange Accent */}
                <span className="font-headline font-black text-xs sm:text-sm text-[#fa8221] tracking-wider mb-3">
                  {step.number}
                </span>

                {/* Circular / Rounded Icon Node */}
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#016ba5] dark:text-[#38bdf8] shadow-xs group-hover:scale-110 group-hover:border-[#fa8221] group-hover:text-[#fa8221] transition-all duration-300 mb-4 shrink-0">
                  {step.icon}
                </div>

                {/* Step Title */}
                <h3 className="font-headline text-lg sm:text-xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2 group-hover:text-[#016ba5] dark:group-hover:text-[#38bdf8] transition-colors leading-snug">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="font-body text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
                  {step.description}
                </p>

                {/* Arrow connector for mobile / tablet */}
                {idx < steps.length - 1 && (
                  <div className="block lg:hidden mt-4 text-sky-400 dark:text-sky-600">
                    <ArrowRight className="w-4 h-4 mx-auto rotate-90 sm:rotate-0 rtl:sm:rotate-180" />
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Prominent Blue Call-to-Action Button */}
        <div className="text-center flex justify-center">
          <button
            type="button"
            onClick={handleExplore}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#016ba5] hover:bg-[#015786] active:bg-[#00466c] text-white font-headline font-bold text-sm sm:text-base tracking-wide shadow-[0_8px_25px_rgba(1,107,165,0.35)] hover:shadow-[0_10px_30px_rgba(1,107,165,0.45)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
          >
            <span>{t('how_it_works.cta_explore')}</span>
            <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksJourney;
