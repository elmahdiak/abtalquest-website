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
  Morocco300Logo
} from '../home/CredibilityLogos';

export interface PartnersEcosystemSectionProps {
  className?: string;
  id?: string;
}

export const PartnersEcosystemSection: React.FC<PartnersEcosystemSectionProps> = ({
  className = '',
  id = 'partners-ecosystem'
}) => {
  const { t } = useLanguage();

  const columns = [
    {
      id: 'supported',
      title: t('partners_ecosystem.col_supported'),
      desc: t('partners_ecosystem.col_supported_desc'),
      logos: [
        { id: 'explorer', name: 'EXPLORER', Component: ExplorerLogo, sizeClass: 'max-h-9 sm:max-h-10' },
        { id: 'ibda3', name: 'Ibda3 Lab', Component: Ibda3LabLogo, sizeClass: 'max-h-11 sm:max-h-12' },
        { id: 'injaz', name: 'INJAZ Al Maghrib', Component: InjazLogo, sizeClass: 'max-h-10 sm:max-h-11' },
        { id: 'cri', name: "Centre Régional d'Investissement Fès-Meknès", Component: CriFesMeknesLogo, sizeClass: 'max-h-10 sm:max-h-11' },
      ],
    },
    {
      id: 'backed',
      title: t('partners_ecosystem.col_backed'),
      desc: t('partners_ecosystem.col_backed_desc'),
      logos: [
        { id: 'nexaya', name: 'nexaya', Component: NexayaLogo, sizeClass: 'max-h-8 sm:max-h-9' },
        { id: 'envestors', name: 'ENVESTORS (Innovation & Scale-Up Nation)', Component: EnvestorsLogo, sizeClass: 'max-h-8 sm:max-h-9' },
        { id: 'generous_planet', name: 'My Generous Planet', Component: MyGenerousPlanetLogo, sizeClass: 'max-h-10 sm:max-h-11' },
        { id: 'startup_universe', name: 'Startup Universe Morocco', Component: StartupUniverseLogo, sizeClass: 'max-h-9 sm:max-h-10' },
      ],
    },
    {
      id: 'recognized',
      title: t('partners_ecosystem.col_recognized'),
      desc: t('partners_ecosystem.col_recognized_desc'),
      logos: [
        { id: 'al_akhawayn', name: 'Al Akhawayn University', Component: AlAkhawaynLogo, sizeClass: 'max-h-11 sm:max-h-12' },
        { id: 'uemf', name: 'Euromed University of Fes (UEMF)', Component: UemfLogo, sizeClass: 'max-h-11 sm:max-h-12' },
        { id: 'gitex', name: 'GITEX AFRICA Morocco', Component: GitexAfricaLogo, sizeClass: 'max-h-10 sm:max-h-11' },
        { id: 'morocco300', name: 'Morocco 300 (2026 Edition)', Component: Morocco300Logo, sizeClass: 'max-h-10 sm:max-h-11' },
      ],
    },
  ];

  return (
    <section 
      id={id}
      className={`py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-sky-50/40 dark:from-[#081b30] dark:via-[#0c2238] dark:to-[#081829] border-t border-slate-200/70 dark:border-slate-800/80 transition-colors relative overflow-hidden ${className}`}
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#fa8221]/5 dark:bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#016ba5]/5 dark:bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 shadow-2xs text-xs font-headline font-black text-[#fa8221] dark:text-orange-400 uppercase tracking-widest mb-3.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#fa8221] shrink-0" />
            <span>{t('partners_ecosystem.eyebrow')}</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-4">
            {t('partners_ecosystem.title')}
          </h2>

          <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t('partners_ecosystem.subtitle')}
          </p>
        </div>

        {/* 2. THREE-COLUMN ECOSYSTEM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {columns.map((col) => (
            <div
              key={col.id}
              className="bg-white dark:bg-slate-900/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group/col"
            >
              {/* Subtle card ambient glow on hover */}
              <div className="absolute -inset-px rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-[#fa8221]/10 via-transparent to-[#016ba5]/10 opacity-0 group-hover/col:opacity-100 transition-opacity pointer-events-none -z-0" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Column Title in Signature Orange matching the reference image */}
                <div className="text-center mb-6">
                  <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#fa8221] dark:text-[#ff983d] tracking-tight">
                    {col.title}
                  </h3>
                  <div className="w-12 h-1 bg-[#fa8221]/30 rounded-full mx-auto mt-2.5 transition-all duration-300 group-hover/col:w-20 group-hover/col:bg-[#fa8221]" />
                </div>

                {/* 2x2 Logo Grid matching the reference image layout */}
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 my-auto">
                  {col.logos.map((logo) => {
                    const LogoComponent = logo.Component;
                    return (
                      <div
                        key={logo.id}
                        className="h-28 sm:h-32 flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80 shadow-2xs hover:shadow-md hover:border-[#fa8221]/50 dark:hover:border-[#fa8221]/60 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 cursor-default group"
                        title={logo.name}
                      >
                        <div className="w-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                          <LogoComponent 
                            className={`${logo.sizeClass} w-auto max-w-full object-contain filter grayscale group-hover:grayscale-0 opacity-85 group-hover:opacity-100 transition-all duration-300`} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Column footer caption */}
                <div className="text-center pt-5 mt-auto border-t border-slate-100 dark:border-slate-800/60">
                  <span className="font-body text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {col.desc}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersEcosystemSection;
