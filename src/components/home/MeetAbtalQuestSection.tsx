import React from 'react';
import { Compass, Footprints, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface MeetAbtalQuestSectionProps {
  className?: string;
}

export const MeetAbtalQuestSection: React.FC<MeetAbtalQuestSectionProps> = ({ className = '' }) => {
  const { t } = useLanguage();

  const cards = [
    {
      step: '01',
      icon: Compass,
      title: t('meet.card1_title'),
      desc: t('meet.card1_desc'),
      iconBg: 'bg-sky-50 dark:bg-sky-950/70 border-sky-200/70 dark:border-sky-800/80 text-[#016ba5] dark:text-sky-400',
      hoverAccent: 'group-hover:border-sky-400/50 group-hover:bg-sky-500',
    },
    {
      step: '02',
      icon: Footprints,
      title: t('meet.card2_title'),
      desc: t('meet.card2_desc'),
      iconBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200/70 dark:border-amber-800/80 text-[#fa8221] dark:text-amber-400',
      hoverAccent: 'group-hover:border-amber-400/50 group-hover:bg-[#fa8221]',
    },
    {
      step: '03',
      icon: Heart,
      title: t('meet.card3_title'),
      desc: t('meet.card3_desc'),
      iconBg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200/70 dark:border-rose-800/80 text-rose-500 dark:text-rose-400',
      hoverAccent: 'group-hover:border-rose-400/50 group-hover:bg-rose-500',
    },
  ];

  return (
    <section
      id="meet-abtalquest"
      className={`relative overflow-hidden bg-gradient-to-b from-[#F4F9FD]/60 via-white to-white dark:from-[#091E3A]/40 dark:via-[#06152B] dark:to-[#06152B] py-16 sm:py-20 lg:py-24 border-b border-slate-100 dark:border-slate-800 ${className}`}
    >
      {/* Subtle ambient lighting glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-sky-400/10 via-[#016ba5]/5 to-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('meet.eyebrow')}</span>
          </div>

          {/* Main Headline (H2) */}
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-[1.18] mb-5">
            {t('meet.headline')}
          </h2>

          {/* Subtitle Paragraph */}
          <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            {t('meet.subtitle')}
          </p>
        </div>

        {/* Three-Card Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.step}
                className="relative rounded-[28px] bg-white dark:bg-slate-900/90 p-7 sm:p-8 lg:p-9 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-2px_rgba(1,107,165,0.06),0_2px_6px_-1px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_35px_-8px_rgba(1,107,165,0.12),0_8px_16px_-4px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
              >
                {/* Large Background/Corner Step Number */}
                <span className="absolute top-5 right-6 rtl:right-auto rtl:left-6 font-headline font-black text-5xl sm:text-6xl text-slate-200/80 dark:text-slate-800/80 select-none pointer-events-none group-hover:text-amber-500/20 dark:group-hover:text-amber-400/20 transition-colors duration-300">
                  {card.step}
                </span>

                <div>
                  {/* Icon Card Header */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xs border ${card.iconBg} group-hover:scale-105 transition-transform duration-200`}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Card Title */}
                  <h3 className="font-headline font-black text-xl sm:text-2xl text-slate-900 dark:text-white mb-3 tracking-tight leading-snug">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                {/* Subtle Hover Accent Bar */}
                <div className="pt-6">
                  <div className="h-1 w-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:w-16 group-hover:bg-[#fa8221] transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MeetAbtalQuestSection;
