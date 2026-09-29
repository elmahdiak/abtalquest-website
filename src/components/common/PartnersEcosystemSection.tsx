import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ExplorerLogo,
  Ibda3LabLogo,
  InjazLogo,
  CriFesMeknesLogo,
  NexayaLogo,
  EnvestorsLogo,
  MyGenerousPlanetLogo,
  StartupUniverseLogo,
  AlAkhawaynLogo,
  UemfLogo,
  GitexAfricaLogo,
  Morocco300Logo,
  type LogoProps
} from '../home/CredibilityLogos';

export interface PartnersEcosystemSectionProps {
  className?: string;
  id?: string;
}

interface PartnerItem {
  id: string;
  name: string;
  categoryKey: string;
  categoryColor: 'orange' | 'blue' | 'purple';
  Component: React.FC<LogoProps>;
  sizeClass: string;
}

export const PartnersEcosystemSection: React.FC<PartnersEcosystemSectionProps> = ({
  className = '',
  id = 'partners-ecosystem'
}) => {
  const { t } = useLanguage();

  const partners: PartnerItem[] = [
    // 1. Supported by
    { 
      id: 'explorer', 
      name: 'EXPLORER', 
      categoryKey: 'partners_ecosystem.col_supported',
      categoryColor: 'orange',
      Component: ExplorerLogo, 
      sizeClass: 'max-h-9 sm:max-h-10' 
    },
    { 
      id: 'ibda3', 
      name: 'Ibda3 Lab', 
      categoryKey: 'partners_ecosystem.col_supported',
      categoryColor: 'orange',
      Component: Ibda3LabLogo, 
      sizeClass: 'max-h-11 sm:max-h-12' 
    },
    { 
      id: 'injaz', 
      name: 'INJAZ Al Maghrib', 
      categoryKey: 'partners_ecosystem.col_supported',
      categoryColor: 'orange',
      Component: InjazLogo, 
      sizeClass: 'max-h-10 sm:max-h-11' 
    },
    { 
      id: 'cri', 
      name: "Centre Régional d'Investissement Fès-Meknès", 
      categoryKey: 'partners_ecosystem.col_supported',
      categoryColor: 'orange',
      Component: CriFesMeknesLogo, 
      sizeClass: 'max-h-10 sm:max-h-11' 
    },

    // 2. Backed by
    { 
      id: 'nexaya', 
      name: 'nexaya', 
      categoryKey: 'partners_ecosystem.col_backed',
      categoryColor: 'blue',
      Component: NexayaLogo, 
      sizeClass: 'max-h-8 sm:max-h-9' 
    },
    { 
      id: 'envestors', 
      name: 'ENVESTORS (Innovation & Scale-Up Nation)', 
      categoryKey: 'partners_ecosystem.col_backed',
      categoryColor: 'blue',
      Component: EnvestorsLogo, 
      sizeClass: 'max-h-8 sm:max-h-9' 
    },
    { 
      id: 'generous_planet', 
      name: 'My Generous Planet', 
      categoryKey: 'partners_ecosystem.col_backed',
      categoryColor: 'blue',
      Component: MyGenerousPlanetLogo, 
      sizeClass: 'max-h-10 sm:max-h-11' 
    },
    { 
      id: 'startup_universe', 
      name: 'Startup Universe Morocco', 
      categoryKey: 'partners_ecosystem.col_backed',
      categoryColor: 'blue',
      Component: StartupUniverseLogo, 
      sizeClass: 'max-h-9 sm:max-h-10' 
    },

    // 3. Recognized by
    { 
      id: 'al_akhawayn', 
      name: 'Al Akhawayn University', 
      categoryKey: 'partners_ecosystem.col_recognized',
      categoryColor: 'purple',
      Component: AlAkhawaynLogo, 
      sizeClass: 'max-h-11 sm:max-h-12' 
    },
    { 
      id: 'uemf', 
      name: 'Euromed University of Fes (UEMF)', 
      categoryKey: 'partners_ecosystem.col_recognized',
      categoryColor: 'purple',
      Component: UemfLogo, 
      sizeClass: 'max-h-11 sm:max-h-12' 
    },
    { 
      id: 'gitex', 
      name: 'GITEX AFRICA Morocco', 
      categoryKey: 'partners_ecosystem.col_recognized',
      categoryColor: 'purple',
      Component: GitexAfricaLogo, 
      sizeClass: 'max-h-10 sm:max-h-11' 
    },
    { 
      id: 'morocco300', 
      name: 'Morocco 300 (2026 Edition)', 
      categoryKey: 'partners_ecosystem.col_recognized',
      categoryColor: 'purple',
      Component: Morocco300Logo, 
      sizeClass: 'max-h-10 sm:max-h-11' 
    },
  ];

  return (
    <section 
      id={id}
      className={`group py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-sky-50/40 dark:from-[#081b30] dark:via-[#0c2238] dark:to-[#081829] border-t border-slate-200/70 dark:border-slate-800/80 transition-colors relative overflow-hidden ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#fa8221]/5 dark:bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#016ba5]/5 dark:bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 shadow-2xs text-xs font-headline font-black text-[#fa8221] dark:text-orange-400 uppercase tracking-widest mb-3.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#fa8221] shrink-0" />
            <span>{t('partners_ecosystem.eyebrow')}</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-4">
            {t('partners_ecosystem.title')}
          </h2>

          <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6">
            {t('partners_ecosystem.subtitle')}
          </p>

          {/* Three Ecosystem Pillar Indicator Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-headline font-bold bg-orange-50/90 dark:bg-orange-950/60 text-[#fa8221] dark:text-[#ff983d] border border-orange-200/70 dark:border-orange-900/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fa8221]" />
              {t('partners_ecosystem.col_supported')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-headline font-bold bg-sky-50/90 dark:bg-sky-950/60 text-[#016ba5] dark:text-[#38bdf8] border border-sky-200/70 dark:border-sky-900/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#016ba5] dark:bg-[#38bdf8]" />
              {t('partners_ecosystem.col_backed')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-headline font-bold bg-purple-50/90 dark:bg-purple-950/60 text-[#7C3AED] dark:text-[#c084fc] border border-purple-200/70 dark:border-purple-900/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] dark:bg-[#c084fc]" />
              {t('partners_ecosystem.col_recognized')}
            </span>
          </div>
        </div>

      </div>

      {/* 2. CONTINUOUS HORIZONTAL SCROLLING MARQUEE */}
      <div className="relative w-full overflow-hidden">
        {/* Subtle side fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-slate-50 dark:from-[#081b30] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-slate-50 dark:from-[#081b30] to-transparent z-20" />

        {/* Marquee Track: Dual clone sets for seamless continuous infinite loop */}
        <div className="flex w-max select-none py-2">
          {/* Primary Track Set */}
          <div 
            className="flex shrink-0 items-stretch gap-4 sm:gap-6 pe-4 sm:pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: '46s' }}
          >
            {partners.map((partner) => (
              <PartnerCard key={`primary-${partner.id}`} partner={partner} t={t} />
            ))}
          </div>

          {/* Duplicate Track Set for seamless infinite loop */}
          <div 
            className="flex shrink-0 items-stretch gap-4 sm:gap-6 pe-4 sm:pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            style={{ animationDuration: '46s' }}
            aria-hidden="true"
          >
            {partners.map((partner) => (
              <PartnerCard key={`duplicate-${partner.id}`} partner={partner} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface PartnerCardProps {
  partner: PartnerItem;
  t: (key: string) => string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, t }) => {
  const LogoComponent = partner.Component;

  // Category pill style mapping
  const badgeClasses = {
    orange: 'bg-orange-50 dark:bg-orange-950/70 border-orange-200/80 dark:border-orange-900/60 text-[#fa8221] dark:text-[#ff983d]',
    blue: 'bg-sky-50 dark:bg-sky-950/70 border-sky-200/80 dark:border-sky-900/60 text-[#016ba5] dark:text-[#38bdf8]',
    purple: 'bg-purple-50 dark:bg-purple-950/70 border-purple-200/80 dark:border-purple-900/60 text-[#7C3AED] dark:text-[#c084fc]',
  }[partner.categoryColor];

  return (
    <div 
      className="group/card relative flex flex-col justify-between w-[240px] sm:w-[270px] md:w-[290px] h-[130px] sm:h-[142px] shrink-0 bg-white dark:bg-slate-900/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#fa8221]/50 dark:hover:border-[#fa8221]/50 transition-all duration-300 hover:-translate-y-1 select-none"
      title={partner.name}
    >
      {/* Top row: Category Indicator Pill */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase tracking-wider border shadow-2xs ${badgeClasses}`}>
          {t(partner.categoryKey)}
        </span>
      </div>

      {/* Center: Authentic Full-Color Logo (NO grayscale, NO opacity reduction) */}
      <div className="flex-1 flex items-center justify-center px-2">
        <div className="w-full flex items-center justify-center transform transition-transform duration-300 group-hover/card:scale-105">
          <LogoComponent 
            className={`${partner.sizeClass} w-auto max-w-full object-contain`} 
          />
        </div>
      </div>

      {/* Bottom: Partner Name Label */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
        <span className="font-body text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block">
          {partner.name}
        </span>
      </div>
    </div>
  );
};

export default PartnersEcosystemSection;
