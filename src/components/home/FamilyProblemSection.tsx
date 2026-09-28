import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface FamilyProblemSectionProps {
  className?: string;
}

export const FamilyProblemSection: React.FC<FamilyProblemSectionProps> = ({ className = '' }) => {
  const { t } = useLanguage();

  const problemPoints = [
    {
      num: '01',
      title: t('problem.point1_title'),
      desc: t('problem.point1_desc'),
    },
    {
      num: '02',
      title: t('problem.point2_title'),
      desc: t('problem.point2_desc'),
    },
    {
      num: '03',
      title: t('problem.point3_title'),
      desc: t('problem.point3_desc'),
    },
    {
      num: '04',
      title: t('problem.point4_title'),
      desc: t('problem.point4_desc'),
    },
  ];

  return (
    <section 
      id="family-problem"
      className={`relative overflow-hidden bg-white dark:bg-[#06152B] py-16 sm:py-20 lg:py-24 border-b border-slate-100 dark:border-slate-800 ${className}`}
    >
      {/* Subtle ambient blur background accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#016ba5]/5 dark:bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Visual/Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-900 group">
              {/* Photo of parent & child looking at tablet */}
              <div className="aspect-[4/5] sm:aspect-[4/4.8] w-full overflow-hidden relative">
                <img
                  src="/family-screen-problem.jpg"
                  alt="Parent and child looking at a tablet together"
                  className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark gradient overlay & text badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                  {/* Subtitle tag */}
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-headline font-black tracking-wider uppercase text-amber-400 mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {t('problem.card_subtitle')}
                  </span>

                  {/* Main card heading */}
                  <h3 className="font-headline text-xl sm:text-2xl font-black leading-snug text-white tracking-tight">
                    {t('problem.card_heading')}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Problem Breakdown List */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Introductory Sentence */}
            <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              {t('problem.intro')}
            </p>

            {/* 4 Problem Points */}
            <div className="space-y-4 sm:space-y-5">
              {problemPoints.map((point) => (
                <div
                  key={point.num}
                  className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-amber-400/40 dark:hover:border-amber-500/40 hover:bg-white dark:hover:bg-slate-900/90 transition-all duration-200 shadow-2xs group"
                >
                  {/* Number Badge */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center font-headline font-black text-xs sm:text-sm text-[#016ba5] dark:text-[#38bdf8] shrink-0 shadow-xs group-hover:scale-105 group-hover:border-amber-400/50 transition-transform">
                    {point.num}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="font-headline font-bold text-slate-900 dark:text-white text-base sm:text-lg mb-1 leading-snug">
                      {point.title}
                    </h4>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Highlight Statement Banner */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 dark:from-slate-900 dark:via-[#1c160e] dark:to-slate-900 border border-amber-200/80 dark:border-amber-700/40 text-center shadow-sm overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/80 text-[#fa8221] flex items-center justify-center mb-3.5 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <p className="font-headline font-black text-lg sm:text-xl lg:text-2xl text-[#fa8221] dark:text-[#fb923c] leading-relaxed tracking-tight">
                {t('problem.highlight_statement')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FamilyProblemSection;
