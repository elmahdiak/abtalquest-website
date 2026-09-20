import React from 'react';
import { 
  Telescope, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Compass, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export const VisionMission: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="vision-mission" className="py-20 sm:py-28 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
      {/* Soft ambient background surface highlights */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#016ba5]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#fa8221]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="primary" size="md" icon={<Compass className="w-4 h-4" />}>
            {t('vision.badge')}
          </Badge>
          
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mt-4 mb-5">
            {t('vision.title')}
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
            {t('vision.subtitle')}
          </p>
        </div>

        {/* Clean Two-Card Layout with Soft Background Surfaces & Generous Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: VISION CARD (Soft Blue / Purple Tinted Surface) */}
          <div className="group relative rounded-3xl p-8 sm:p-10 transition-all duration-300 bg-gradient-to-br from-[#016ba5]/[0.04] via-white to-slate-50 dark:from-[#016ba5]/15 dark:via-[#0F2F4E] dark:to-[#0A2540] border-2 border-[#016ba5]/15 dark:border-[#016ba5]/40 hover:border-[#016ba5]/35 dark:hover:border-[#38BDF8]/50 hover:shadow-xl flex flex-col justify-between">
            
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Telescope className="w-7 h-7" />
                </div>
                <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  {t('vision.badge')}
                </Badge>
              </div>

              {/* Title using Montserrat */}
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white mb-4 tracking-tight flex items-center gap-2">
                <span>{t('vision.vision_title')}</span>
                <ArrowUpRight className="w-5 h-5 text-[#016ba5] opacity-0 group-hover:opacity-100 transition-opacity rtl-flip" />
              </h3>

              {/* Vision Statement Quote */}
              <blockquote className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium bg-white/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-[#016ba5]/10 dark:border-[#016ba5]/30 shadow-sm mb-6 relative">
                <span className="text-3xl text-[#016ba5] font-bold absolute -top-2 left-2 rtl:left-auto rtl:right-2 opacity-30 select-none">“</span>
                <p className="relative z-10 pl-3 rtl:pl-0 rtl:pr-3">
                  {t('vision.vision_desc')}
                </p>
              </blockquote>

              {/* Strategic Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_1_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_1_desc')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_2_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_2_desc')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_3_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_3_desc')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Accent */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs font-body text-[#016ba5] dark:text-[#38BDF8] font-semibold">
              <span>{t('vision.quote_author')}</span>
              <span className="font-gamification text-sm text-[#7C3AED]">{t('vision.pillar_4_title')}</span>
            </div>

          </div>

          {/* Card 2: MISSION CARD (Soft Orange / Green Tinted Surface) */}
          <div className="group relative rounded-3xl p-8 sm:p-10 transition-all duration-300 bg-gradient-to-br from-[#fa8221]/[0.04] via-white to-slate-50 dark:from-[#fa8221]/15 dark:via-[#0F2F4E] dark:to-[#0A2540] border-2 border-[#fa8221]/20 dark:border-[#fa8221]/40 hover:border-[#fa8221]/40 dark:hover:border-[#fa8221]/60 hover:shadow-xl flex flex-col justify-between">
            
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Target className="w-7 h-7" />
                </div>
                <Badge variant="secondary" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  {t('vision.mission_title')}
                </Badge>
              </div>

              {/* Title using Montserrat */}
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B] dark:text-white mb-4 tracking-tight flex items-center gap-2">
                <span>{t('vision.mission_title')}</span>
                <ArrowUpRight className="w-5 h-5 text-[#fa8221] opacity-0 group-hover:opacity-100 transition-opacity rtl-flip" />
              </h3>

              {/* Mission Statement Quote */}
              <blockquote className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium bg-white/80 dark:bg-slate-900/60 p-5 rounded-2xl border border-[#fa8221]/15 dark:border-[#fa8221]/30 shadow-sm mb-6 relative">
                <span className="text-3xl text-[#fa8221] font-bold absolute -top-2 left-2 rtl:left-auto rtl:right-2 opacity-30 select-none">“</span>
                <p className="relative z-10 pl-3 rtl:pl-0 rtl:pr-3">
                  {t('vision.mission_desc')}
                </p>
              </blockquote>

              {/* Strategic Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_1_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_1_desc')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_2_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_2_desc')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      {t('vision.pillar_4_title')}
                    </span>
                    <span className="font-body text-xs text-[#64748B] dark:text-slate-400 leading-normal">
                      {t('vision.pillar_4_desc')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Accent */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs font-body text-[#fa8221] font-semibold">
              <span>{t('vision.quote')}</span>
              <span className="font-gamification text-sm text-[#22C55E]">100% Values-Safe</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default VisionMission;
