import React from 'react';
import { 
  Trophy, 
  Crown, 
  Building2, 
  GraduationCap, 
  Globe2, 
  Rocket, 
  Sparkles, 
  Lightbulb, 
  ShieldCheck, 
  Cpu, 
  LineChart, 
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export const InstitutionalCredibility: React.FC = () => {
  const { t, direction } = useLanguage();

  // 1. Prestigious Recognitions & Awards (Featured Achievement Cards)
  const awards = [
    {
      id: 'ventures_adventure',
      badge: t('credibility.award_1_badge'),
      metric: t('credibility.award_1_metric'),
      metricLabel: t('credibility.award_1_metric_label'),
      title: t('credibility.award_1_title'),
      org: t('credibility.award_1_org'),
      icon: <GraduationCap className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
      accentBorder: 'hover:border-amber-500/50 dark:hover:border-amber-400/50',
      pillColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    },
    {
      id: 'startech',
      badge: t('credibility.award_2_badge'),
      metric: t('credibility.award_2_metric'),
      metricLabel: t('credibility.award_2_metric_label'),
      title: t('credibility.award_2_title'),
      org: t('credibility.award_2_org'),
      icon: <Trophy className="w-5 h-5 text-[#016ba5] dark:text-[#38BDF8]" />,
      accentBorder: 'hover:border-[#016ba5]/50 dark:hover:border-[#38BDF8]/50',
      pillColor: 'bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8] border-[#016ba5]/20',
    },
    {
      id: 'gitex_africa_300',
      badge: t('credibility.award_3_badge'),
      metric: t('credibility.award_3_metric'),
      metricLabel: t('credibility.award_3_metric_label'),
      title: t('credibility.award_3_title'),
      org: t('credibility.award_3_org'),
      icon: <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      accentBorder: 'hover:border-purple-500/50 dark:hover:border-purple-400/50',
      pillColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
    },
  ];

  // 2. Institutional Supporters (Row 1 Marquee)
  const supporters = [
    {
      id: 'explorer',
      name: t('credibility.supporter_1_name'),
      desc: t('credibility.supporter_1_desc'),
      monogram: 'EX',
      tag: t('credibility.tag_incubation'),
      icon: <Rocket className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8]" />,
      monogramBg: 'bg-[#016ba5]/10 text-[#016ba5] dark:bg-[#016ba5]/25 dark:text-[#38BDF8] border-[#016ba5]/20',
    },
    {
      id: 'injaz',
      name: t('credibility.supporter_2_name'),
      desc: t('credibility.supporter_2_desc'),
      monogram: 'IN',
      tag: t('credibility.tag_education'),
      icon: <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      monogramBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-300 border-emerald-500/20',
    },
    {
      id: 'cri',
      name: t('credibility.supporter_3_name'),
      desc: t('credibility.supporter_3_desc'),
      monogram: 'CRI',
      tag: t('credibility.tag_public'),
      icon: <Building2 className="w-4 h-4 text-[#fa8221] dark:text-[#fb923c]" />,
      monogramBg: 'bg-[#fa8221]/10 text-[#fa8221] dark:bg-[#fa8221]/25 dark:text-[#fb923c] border-[#fa8221]/20',
    },
    {
      id: 'ibda3',
      name: t('credibility.supporter_4_name'),
      desc: t('credibility.supporter_4_desc'),
      monogram: 'IL',
      tag: t('credibility.tag_innovation'),
      icon: <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      monogramBg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/25 dark:text-purple-300 border-purple-500/20',
    },
  ];

  // 3. Technological & Entrepreneurial Backers (Row 2 Marquee)
  const backers = [
    {
      id: 'nexaya',
      name: t('credibility.backer_1_name'),
      desc: t('credibility.backer_1_desc'),
      monogram: 'NX',
      tag: t('credibility.tag_tech'),
      icon: <Cpu className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      monogramBg: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/25 dark:text-sky-300 border-sky-500/20',
    },
    {
      id: 'generous_planet',
      name: t('credibility.backer_2_name'),
      desc: t('credibility.backer_2_desc'),
      monogram: 'GP',
      tag: t('credibility.tag_impact'),
      icon: <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      monogramBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-300 border-emerald-500/20',
    },
    {
      id: 'startup_universe',
      name: t('credibility.backer_3_name'),
      desc: t('credibility.backer_3_desc'),
      monogram: 'SU',
      tag: t('credibility.tag_ecosystem'),
      icon: <Globe2 className="w-4 h-4 text-[#fa8221] dark:text-[#fb923c]" />,
      monogramBg: 'bg-[#fa8221]/10 text-[#fa8221] dark:bg-[#fa8221]/25 dark:text-[#fb923c] border-[#fa8221]/20',
    },
    {
      id: 'envestors',
      name: t('credibility.backer_4_name'),
      desc: t('credibility.backer_4_desc'),
      monogram: 'EN',
      tag: t('credibility.tag_angel'),
      icon: <LineChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      monogramBg: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/25 dark:text-purple-300 border-purple-500/20',
    },
  ];

  // Quadruple arrays so loop has zero gaps even on 4K/ultrawide viewports
  const marqueeSupporters = [...supporters, ...supporters, ...supporters, ...supporters];
  const marqueeBackers = [...backers, ...backers, ...backers, ...backers];

  return (
    <section 
      id="institutional-credibility" 
      className="relative py-12 sm:py-16 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-[#071727] dark:via-[#0A2540]/60 dark:to-[#071727] border-b border-slate-200/80 dark:border-slate-800 transition-colors overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-[#016ba5]/10 via-[#fa8221]/8 to-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Compact, Sleek Enterprise Style */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#016ba5]/10 dark:bg-[#016ba5]/20 border border-[#016ba5]/20 text-[#016ba5] dark:text-[#38BDF8] text-xs font-headline font-bold mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('credibility.section_badge')}</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E293B] dark:text-white tracking-tight leading-tight mb-3">
            {t('credibility.section_title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221]">
              {t('credibility.section_title_highlight')}
            </span>
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t('credibility.section_subtitle')}
          </p>
        </div>

        {/* ========================================================
            PRESTIGIOUS ACHIEVEMENTS & AWARDS (COMPACT STRIP)
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 max-w-5xl mx-auto mb-10 sm:mb-12">
          {awards.map((award) => (
            <div
              key={award.id}
              className={cn(
                "relative group/card rounded-2xl p-4 sm:p-4.5 transition-all duration-300",
                "bg-white/80 dark:bg-[#0F2F4E]/70 backdrop-blur-md",
                "border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-lg hover:-translate-y-1",
                award.accentBorder
              )}
            >
              <div className="flex items-start gap-3.5">
                {/* Micro Icon container */}
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner group-hover/card:scale-105 transition-transform">
                  {award.icon}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={cn("text-[10px] font-headline font-black px-2 py-0.5 rounded-md border flex items-center gap-1", award.pillColor)}>
                      <Sparkles className="w-2.5 h-2.5" />
                      {award.metric}
                    </span>
                    <span className="text-[10px] font-headline font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {award.badge}
                    </span>
                  </div>

                  <h3 className="font-headline text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug truncate">
                    {award.title}
                  </h3>

                  <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={award.org}>
                    {award.org}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            DUAL AUTO-SCROLLING HORIZONTAL MARQUEES (TRUSTED BY)
           ======================================================== */}
        <div className="space-y-4">
          
          {/* Marquee Row 1: Institutional Supporters */}
          <div className="group relative">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-headline font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />
              <span>{t('credibility.supported_heading')}</span>
            </div>

            <div className="relative w-full overflow-hidden mask-marquee-fade py-1" dir="ltr">
              <div className="animate-marquee flex items-center gap-3.5 w-max">
                {marqueeSupporters.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 cursor-default select-none",
                      "bg-white/80 dark:bg-[#0c2238]/70 backdrop-blur-md",
                      "border border-slate-200/80 dark:border-white/10 hover:border-[#016ba5]/50 dark:hover:border-[#38BDF8]/50 shadow-2xs hover:shadow-md hover:scale-[1.02]",
                      direction === 'rtl' ? 'text-right' : 'text-left'
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-xl font-headline font-black text-xs flex items-center justify-center border flex-shrink-0", item.monogramBg)}>
                      {item.monogram}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-none whitespace-nowrap">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-headline font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
                          {item.tag}
                        </span>
                      </div>
                      <span className="font-body text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap mt-0.5 max-w-[240px] truncate">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Marquee Row 2: Technology & Venture Backers (Reverse Continuous Scroll) */}
          <div className="group relative">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-headline font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Rocket className="w-3.5 h-3.5 text-[#fa8221]" />
              <span>{t('credibility.backed_heading')}</span>
            </div>

            <div className="relative w-full overflow-hidden mask-marquee-fade py-1" dir="ltr">
              <div className="animate-marquee-reverse flex items-center gap-3.5 w-max">
                {marqueeBackers.map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 flex-shrink-0 cursor-default select-none",
                      "bg-white/80 dark:bg-[#0c2238]/70 backdrop-blur-md",
                      "border border-slate-200/80 dark:border-white/10 hover:border-[#fa8221]/50 dark:hover:border-[#fa8221]/50 shadow-2xs hover:shadow-md hover:scale-[1.02]",
                      direction === 'rtl' ? 'text-right' : 'text-left'
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-xl font-headline font-black text-xs flex items-center justify-center border flex-shrink-0", item.monogramBg)}>
                      {item.monogram}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-none whitespace-nowrap">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-headline font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap">
                          {item.tag}
                        </span>
                      </div>
                      <span className="font-body text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap mt-0.5 max-w-[240px] truncate">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default InstitutionalCredibility;
