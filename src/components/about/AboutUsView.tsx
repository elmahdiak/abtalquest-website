import React from 'react';
import { 
  Compass, 
  Telescope, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import CtaBannerSection from '../home/CtaBannerSection';
import { TeamProfilesSection } from './TeamProfilesSection';
import { useLanguage } from '../../context/LanguageContext';

export interface AboutUsViewProps {
  onBackToHome: () => void;
  onExploreMarketplace?: () => void;
  onOpenContact?: () => void;
  onOpenWaitlist?: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  onBackToHome,
  onOpenContact,
  onOpenWaitlist,
}) => {
  const { t } = useLanguage();

  const coreBeliefs = [
    {
      title: t('about_page.belief_1_title'),
      description: t('about_page.belief_1_desc'),
      icon: <Sparkles className="w-5 h-5 text-[#0284c7]" />,
    },
    {
      title: t('about_page.belief_2_title'),
      description: t('about_page.belief_2_desc'),
      icon: <Heart className="w-5 h-5 text-[#0284c7]" />,
    },
    {
      title: t('about_page.belief_3_title'),
      description: t('about_page.belief_3_desc'),
      icon: <ArrowRight className="w-5 h-5 text-[#0284c7] rtl-flip" />,
    },
    {
      title: t('about_page.belief_4_title'),
      description: t('about_page.belief_4_desc'),
      icon: <Sparkles className="w-5 h-5 text-[#0284c7]" />,
    },
    {
      title: t('about_page.belief_5_title'),
      description: t('about_page.belief_5_desc'),
      icon: <Sparkles className="w-5 h-5 text-[#0284c7]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#06152B] text-slate-800 dark:text-slate-100">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-white dark:from-[#06152B] dark:via-[#091E3A] dark:to-[#06152B] pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          
          {/* Breadcrumb back */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-[#016ba5] dark:text-[#38bdf8] hover:underline mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span>{t('about_page.breadcrumb_home')}</span>
          </button>

          {/* Eyebrow */}
          <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] dark:text-[#38bdf8] uppercase tracking-wider block mb-3">
            {t('about_page.hero_eyebrow')}
          </span>

          {/* Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-5">
            {t('about_page.hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg text-[#475569] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('about_page.hero_subtitle')}
          </p>
        </div>
      </section>

      {/* 2. WHY WE EXIST */}
      <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left rtl:text-right">
        <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-2">
          {t('about_page.why_eyebrow')}
        </span>
        <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-6">
          {t('about_page.why_title')}
        </h2>
        <p className="font-body text-base sm:text-lg text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
          {t('about_page.why_text')}
        </p>
      </section>

      {/* 3. MISSION & VISION DUAL CARDS */}
      <section className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Mission Card */}
          <div className="bg-[#F8FAFC] dark:bg-[#0c2238] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between text-left rtl:text-right">
            <div>
              <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-950 text-[#0284c7] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-[#0F2A4A] dark:text-white mb-3 uppercase tracking-tight">
                {t('about_page.mission_title')}
              </h3>
              <p className="font-body text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
                {t('about_page.mission_text')}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#F8FAFC] dark:bg-[#0c2238] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between text-left rtl:text-right">
            <div>
              <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-950 text-[#016ba5] flex items-center justify-center mb-6">
                <Telescope className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-[#0F2A4A] dark:text-white mb-3 uppercase tracking-tight">
                {t('about_page.vision_title')}
              </h3>
              <p className="font-body text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
                {t('about_page.vision_text')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHAT WE BELIEVE / CORE VALUES */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left rtl:text-right">
        <div className="mb-10 sm:mb-12">
          <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-2">
            {t('about_page.beliefs_eyebrow')}
          </span>
          <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight">
            {t('about_page.beliefs_title')}
          </h2>
        </div>

        <div className="space-y-4">
          {coreBeliefs.map((belief) => (
            <div
              key={belief.title}
              className="bg-white dark:bg-[#0c2238] rounded-2xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-card-soft transition-all duration-200 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-sky-50 dark:bg-sky-950/80 text-[#0284c7] flex items-center justify-center shrink-0 mt-0.5">
                {belief.icon}
              </div>
              <div>
                <h3 className="font-headline text-lg sm:text-xl font-bold text-[#0F2A4A] dark:text-white mb-1.5">
                  {belief.title}
                </h3>
                <p className="font-body text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed">
                  {belief.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM & LEADERSHIP */}
      <section id="team" className="py-16 sm:py-20 bg-sky-50/50 dark:bg-[#0c2238]/40 border-t border-slate-100 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left rtl:text-right">
          <div className="mb-10 sm:mb-12">
            <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-2">
              {t('about_page.team_eyebrow')}
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4">
              {t('about_page.team_title')}
            </h2>
            <p className="font-body text-base text-[#475569] dark:text-slate-300 leading-relaxed">
              {t('about_page.team_text')}
            </p>
          </div>

          {/* Featured Leadership Profiles (Hajar Ouzif, Khalil Dadsi & ElMahdi Akarkaou) */}
          <div className="mb-10">
            <TeamProfilesSection />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Expert Advisors Placeholder */}
            <div className="bg-white dark:bg-[#0c2238] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-center min-h-[120px]">
              <span className="font-headline text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block mb-1">
                {t('about_page.expert_advisors')}
              </span>
              <span className="font-body text-sm text-slate-400">
                {t('about_page.coming_soon')}
              </span>
            </div>

            {/* Partners Placeholder */}
            <div className="bg-white dark:bg-[#0c2238] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-center min-h-[120px]">
              <span className="font-headline text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 block mb-1">
                {t('about_page.partners')}
              </span>
              <span className="font-body text-sm text-slate-400">
                {t('about_page.coming_soon')}
              </span>
            </div>
          </div>

          {/* Contact Button */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-slate-800 text-[#0F2A4A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-headline font-bold text-sm tracking-wider uppercase shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <span>{t('about_page.btn_contact')}</span>
              <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1 text-[#0284c7]" />
            </button>
          </div>

        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <CtaBannerSection onDownloadClick={onOpenWaitlist} />

    </div>
  );
};

export default AboutUsView;
