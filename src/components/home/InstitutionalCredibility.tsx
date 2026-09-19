import React from 'react';
import { 
  Award, 
  Trophy, 
  Crown, 
  Building2, 
  GraduationCap, 
  Globe2, 
  Rocket, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ShieldCheck, 
  Cpu, 
  LineChart, 
  HeartHandshake
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export const InstitutionalCredibility: React.FC = () => {
  const { t } = useLanguage();

  // 1. Prestigious Awards & Recognitions
  const awards = [
    {
      id: 'ventures_adventure',
      badge: t('credibility.award_1_badge'),
      badgeColor: 'warning' as const,
      metric: t('credibility.award_1_metric'),
      metricLabel: t('credibility.award_1_metric_label'),
      title: t('credibility.award_1_title'),
      org: t('credibility.award_1_org'),
      desc: t('credibility.award_1_desc'),
      icon: <GraduationCap className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      accentColor: 'from-amber-500/20 via-orange-500/10 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      pillBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    },
    {
      id: 'startech',
      badge: t('credibility.award_2_badge'),
      badgeColor: 'primary' as const,
      metric: t('credibility.award_2_metric'),
      metricLabel: t('credibility.award_2_metric_label'),
      title: t('credibility.award_2_title'),
      org: t('credibility.award_2_org'),
      desc: t('credibility.award_2_desc'),
      icon: <Trophy className="w-6 h-6 text-[#016ba5] dark:text-[#38BDF8]" />,
      accentColor: 'from-[#016ba5]/20 via-[#38BDF8]/10 to-transparent',
      borderColor: 'border-[#016ba5]/30 hover:border-[#016ba5]/60',
      pillBg: 'bg-[#016ba5]/15 text-[#016ba5] dark:text-[#38BDF8] border-[#016ba5]/30',
    },
    {
      id: 'gitex_africa_300',
      badge: t('credibility.award_3_badge'),
      badgeColor: 'gamification' as const,
      metric: t('credibility.award_3_metric'),
      metricLabel: t('credibility.award_3_metric_label'),
      title: t('credibility.award_3_title'),
      org: t('credibility.award_3_org'),
      desc: t('credibility.award_3_desc'),
      icon: <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      accentColor: 'from-purple-600/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      pillBg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    },
  ];

  // 2. Institutional Supporters
  const supporters = [
    {
      id: 'explorer',
      name: t('credibility.supporter_1_name'),
      desc: t('credibility.supporter_1_desc'),
      monogram: 'EX',
      icon: <Rocket className="w-4 h-4 text-[#016ba5]" />,
      tag: 'Incubation',
    },
    {
      id: 'injaz',
      name: t('credibility.supporter_2_name'),
      desc: t('credibility.supporter_2_desc'),
      monogram: 'IN',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      tag: 'Education',
    },
    {
      id: 'cri',
      name: t('credibility.supporter_3_name'),
      desc: t('credibility.supporter_3_desc'),
      monogram: 'CRI',
      icon: <Building2 className="w-4 h-4 text-[#fa8221]" />,
      tag: 'Public Sector',
    },
    {
      id: 'ibda3',
      name: t('credibility.supporter_4_name'),
      desc: t('credibility.supporter_4_desc'),
      monogram: 'IL',
      icon: <Lightbulb className="w-4 h-4 text-purple-600" />,
      tag: 'Innovation',
    },
  ];

  // 3. Technological & Entrepreneurial Backers
  const backers = [
    {
      id: 'nexaya',
      name: t('credibility.backer_1_name'),
      desc: t('credibility.backer_1_desc'),
      monogram: 'NX',
      icon: <Cpu className="w-4 h-4 text-sky-600" />,
      tag: 'Technology',
    },
    {
      id: 'generous_planet',
      name: t('credibility.backer_2_name'),
      desc: t('credibility.backer_2_desc'),
      monogram: 'GP',
      icon: <HeartHandshake className="w-4 h-4 text-emerald-600" />,
      tag: 'Impact Venture',
    },
    {
      id: 'startup_universe',
      name: t('credibility.backer_3_name'),
      desc: t('credibility.backer_3_desc'),
      monogram: 'SU',
      icon: <Globe2 className="w-4 h-4 text-[#fa8221]" />,
      tag: 'Ecosystem',
    },
    {
      id: 'envestors',
      name: t('credibility.backer_4_name'),
      desc: t('credibility.backer_4_desc'),
      monogram: 'EN',
      icon: <LineChart className="w-4 h-4 text-purple-600" />,
      tag: 'Angels Network',
    },
  ];

  return (
    <section 
      id="institutional-credibility" 
      className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-[#071727] dark:via-[#0A2540] dark:to-[#071727] border-b border-slate-200/80 dark:border-slate-800 transition-colors overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-[#016ba5]/10 via-[#fa8221]/10 to-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#016ba5]/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#fa8221]/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="primary" size="md" icon={<ShieldCheck className="w-4 h-4" />}>
              {t('credibility.section_badge')}
            </Badge>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight leading-[1.18] mb-5">
            {t('credibility.section_title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221]">
              {t('credibility.section_title_highlight')}
            </span>
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
            {t('credibility.section_subtitle')}
          </p>
        </div>

        {/* ========================================================
            PART 1: RECOGNITIONS & AWARDS (PRESTIGIOUS ACHIEVEMENTS)
           ======================================================== */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                <Award className="w-4 h-4" />
                <span>Excellence & Recognition</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
                {t('credibility.awards_heading')}
              </h3>
            </div>
            <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-md">
              {t('credibility.awards_subheading')}
            </p>
          </div>

          {/* Awards 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {awards.map((award) => (
              <div
                key={award.id}
                className={cn(
                  "relative rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between",
                  "bg-white/80 dark:bg-[#0F2F4E]/80 backdrop-blur-md",
                  "border shadow-sm hover:shadow-xl hover:-translate-y-1.5",
                  award.borderColor
                )}
              >
                {/* Top Subtle Gradient Accenting */}
                <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r", award.accentColor)} />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className={cn("text-[11px] font-headline font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs", award.pillBg)}>
                      <Sparkles className="w-3 h-3" />
                      {award.badge}
                    </span>

                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shadow-inner">
                      {award.icon}
                    </div>
                  </div>

                  {/* Main Metric Callout */}
                  <div className="mb-4">
                    <span className="font-headline font-black text-3xl sm:text-4xl text-slate-900 dark:text-white block tracking-tight">
                      {award.metric}
                    </span>
                    <span className="font-headline text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                      {award.metricLabel}
                    </span>
                  </div>

                  {/* Award Title */}
                  <h4 className="font-headline text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-2 leading-snug">
                    {award.title}
                  </h4>

                  {/* Awarding Institutions */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A2540]/60 border border-slate-200/60 dark:border-slate-700/60 mb-4">
                    <span className="text-[11px] font-body text-slate-600 dark:text-slate-300 font-medium block leading-snug">
                      <strong className="text-slate-900 dark:text-white">Awarded by:</strong> {award.org}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {award.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 text-xs font-headline font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Officially Verified & Laureate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            PART 2 & 3: DUAL ECOSYSTEM PILLARS (SUPPORTED & BACKED)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          
          {/* 1. SUPPORTED BY (INSTITUTIONAL SUPPORTERS) */}
          <div className="bg-white/60 dark:bg-[#0F2F4E]/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#016ba5]/15 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#016ba5] dark:text-[#38BDF8] block">
                  Institutional Partners
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t('credibility.supported_heading')}
                </h3>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mb-6">
              {t('credibility.supported_subheading')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supporters.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-700/80 hover:border-[#016ba5]/60 dark:hover:border-[#38BDF8]/60 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#016ba5]/10 dark:bg-[#016ba5]/25 text-[#016ba5] dark:text-[#38BDF8] font-headline font-black text-xs flex items-center justify-center border border-[#016ba5]/20 group-hover:scale-105 transition-transform">
                        {item.monogram}
                      </div>
                      <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-headline font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <p className="font-body text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. BACKED BY (TECH & VENTURE BACKERS) */}
          <div className="bg-white/60 dark:bg-[#0F2F4E]/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#fa8221] block">
                  Venture & Tech Ecosystem
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t('credibility.backed_heading')}
                </h3>
              </div>
            </div>

            <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mb-6">
              {t('credibility.backed_subheading')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {backers.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-700/80 hover:border-[#fa8221]/60 dark:hover:border-[#fa8221]/60 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#fa8221]/10 dark:bg-[#fa8221]/25 text-[#fa8221] font-headline font-black text-xs flex items-center justify-center border border-[#fa8221]/20 group-hover:scale-105 transition-transform">
                        {item.monogram}
                      </div>
                      <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {item.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-headline font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <p className="font-body text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
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

export default InstitutionalCredibility;
