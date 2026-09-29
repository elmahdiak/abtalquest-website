import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface TeamProfilesSectionProps {
  className?: string;
  showHeader?: boolean;
}

export const TeamProfilesSection: React.FC<TeamProfilesSectionProps> = ({ 
  className = '',
  showHeader = false 
}) => {
  const { t } = useLanguage();

  return (
    <div className={`w-full space-y-8 sm:space-y-10 ${className}`}>
      {showHeader && (
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('team.eyebrow')}</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-3">
            {t('team.title')}
          </h2>
          <p className="font-body text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t('team.subtitle')}
          </p>
        </div>
      )}

      {/* 1. Featured Leadership Card for Hajar Ouzif */}
      <div 
        id="team-hajar"
        className="relative rounded-[28px] sm:rounded-[32px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Subtle background ambient warmth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#fa8221]/10 via-[#016ba5]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-400/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 relative z-10">
          
          {/* Photo Column (Desktop Left / RTL Right) */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-200/90 dark:border-slate-700/80 shadow-md group">
              {/* Warm decorative backlight */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#016ba5]/30 via-[#fa8221]/20 to-transparent rounded-3xl blur-md -z-10 group-hover:opacity-100 transition-opacity" />
              
              <img
                src="/team/hajar-ouzif.png"
                alt="Hajar Ouzif - Founder & CEO"
                className="w-full h-full object-cover object-top select-none transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Founder Tag floating on photo bottom */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white font-headline font-bold text-[11px] sm:text-xs shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa8221] animate-pulse" />
                  <span>{t('team.hajar_photo_badge')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Details Column (Desktop Right / RTL Left) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between text-left rtl:text-right">
            
            {/* Top Leadership Accent Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200/80 dark:border-amber-800/80 text-xs font-headline font-black text-[#fa8221] dark:text-amber-400 uppercase tracking-widest mb-3.5 self-start rtl:self-end shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('team.hajar_badge')}</span>
            </div>

            {/* Name */}
            <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2">
              {t('team.hajar_name')}
            </h3>

            {/* Role & Strategic Tag */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5">
              <span className="font-headline font-bold text-base sm:text-lg text-[#fa8221] dark:text-[#ff983d]">
                {t('team.hajar_role')}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="font-body text-xs sm:text-sm font-semibold text-[#016ba5] dark:text-[#38bdf8] bg-sky-50 dark:bg-sky-950/60 px-3 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/60">
                {t('team.hajar_tag')}
              </span>
            </div>

            {/* Bio Paragraph */}
            <p className="font-body text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal mb-6">
              {t('team.hajar_bio')}
            </p>

            {/* Action Row: Sleek LinkedIn Profile Icon Link */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/hajar-ouzif"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${t('team.hajar_name')} on LinkedIn`}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#0077b5] dark:bg-slate-800 dark:hover:bg-[#0077b5] text-white font-headline text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
              >
                {/* LinkedIn SVG Icon */}
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>{t('team.linkedin_label')}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Featured Leadership Card for Khalil Dadsi */}
      <div 
        id="team-khalil"
        className="relative rounded-[28px] sm:rounded-[32px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Subtle background ambient coolness & warmth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#016ba5]/12 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#fa8221]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center p-6 sm:p-8 lg:p-10 relative z-10">
          
          {/* Photo Column (Desktop Left / RTL Right) */}
          <div className="md:col-span-5 lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-none aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-200/90 dark:border-slate-700/80 shadow-md group">
              {/* Cyan / Sky decorative backlight */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#016ba5]/35 via-sky-400/25 to-transparent rounded-3xl blur-md -z-10 group-hover:opacity-100 transition-opacity" />
              
              <img
                src="/team/khalil-dadsi.jpg"
                alt="Khalil Dadsi - Co-Founder & Chief Product Officer"
                className="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />

              {/* Product Leadership Tag floating on photo bottom */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white font-headline font-bold text-[11px] sm:text-xs shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                  <span>{t('team.khalil_photo_badge')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio & Details Column (Desktop Right / RTL Left) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between text-left rtl:text-right">
            
            {/* Top Leadership Accent Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-3.5 self-start rtl:self-end shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('team.khalil_badge')}</span>
            </div>

            {/* Name */}
            <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2">
              {t('team.khalil_name')}
            </h3>

            {/* Role & Strategic Tag */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5">
              <span className="font-headline font-bold text-base sm:text-lg text-[#016ba5] dark:text-[#38bdf8]">
                {t('team.khalil_role')}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="font-body text-xs sm:text-sm font-semibold text-[#fa8221] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/60">
                {t('team.khalil_tag')}
              </span>
            </div>

            {/* Bio Paragraph */}
            <p className="font-body text-sm sm:text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal mb-6">
              {t('team.khalil_bio')}
            </p>

            {/* Action Row: Sleek LinkedIn Profile Icon Link */}
            <div className="pt-2 flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/khalildadsi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${t('team.khalil_name')} on LinkedIn`}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#0077b5] dark:bg-slate-800 dark:hover:bg-[#0077b5] text-white font-headline text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
              >
                {/* LinkedIn SVG Icon */}
                <svg
                  className="w-4 h-4 fill-current shrink-0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>{t('team.linkedin_label')}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TeamProfilesSection;
