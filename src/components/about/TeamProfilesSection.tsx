import React, { useState } from 'react';
import { Sparkles, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface TeamProfilesSectionProps {
  className?: string;
  showHeader?: boolean;
}

interface TeamMember {
  id: string;
  nameKey: string;
  roleKey: string;
  tagKey: string;
  badgeKey: string;
  photoBadgeKey: string;
  bioKey: string;
  shortBioKey: string;
  image: string;
  linkedin: string;
  roleColor: string;
  roleTextColor: string;
  badgeBg: string;
  badgeSparkleColor: string;
  tagBg: string;
  accentGlow: string;
  avatarGlow: string;
  statusPipBg: string;
  imagePosition: string;
}

export const TeamProfilesSection: React.FC<TeamProfilesSectionProps> = ({ 
  className = '',
  showHeader = false 
}) => {
  const { t } = useLanguage();
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});

  const toggleBio = (id: string) => {
    setExpandedBios(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const teamMembers: TeamMember[] = [
    {
      id: 'team-hajar',
      nameKey: 'team.hajar_name',
      roleKey: 'team.hajar_role',
      tagKey: 'team.hajar_tag',
      badgeKey: 'team.hajar_badge',
      photoBadgeKey: 'team.hajar_photo_badge',
      bioKey: 'team.hajar_bio',
      shortBioKey: 'team.hajar_short_bio',
      image: '/team/hajar-ouzif.png',
      linkedin: 'https://www.linkedin.com/in/hajarouzif',
      roleColor: '#fa8221',
      roleTextColor: 'text-[#fa8221] dark:text-[#ff983d]',
      badgeBg: 'bg-orange-50/90 dark:bg-orange-950/70 border-orange-200/80 dark:border-orange-800/80 text-[#fa8221] dark:text-[#ff983d]',
      badgeSparkleColor: 'text-[#016ba5] dark:text-[#38bdf8]',
      tagBg: 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-200/80 dark:border-sky-800/70 text-[#016ba5] dark:text-[#38bdf8]',
      accentGlow: 'from-[#fa8221]/15 via-[#016ba5]/10 to-transparent',
      avatarGlow: 'from-[#016ba5] via-[#fa8221] to-[#ff983d]',
      statusPipBg: '#fa8221',
      imagePosition: 'center 20%',
    },
    {
      id: 'team-khalil',
      nameKey: 'team.khalil_name',
      roleKey: 'team.khalil_role',
      tagKey: 'team.khalil_tag',
      badgeKey: 'team.khalil_badge',
      photoBadgeKey: 'team.khalil_photo_badge',
      bioKey: 'team.khalil_bio',
      shortBioKey: 'team.khalil_short_bio',
      image: '/team/khalil-dadsi-new.jpg',
      linkedin: 'https://www.linkedin.com/in/khalil-dadsi-41b58420a',
      roleColor: '#016ba5',
      roleTextColor: 'text-[#016ba5] dark:text-[#38bdf8]',
      badgeBg: 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-200/80 dark:border-sky-800/80 text-[#016ba5] dark:text-[#38bdf8]',
      badgeSparkleColor: 'text-[#fa8221] dark:text-[#ff983d]',
      tagBg: 'bg-orange-50/90 dark:bg-orange-950/70 border-orange-200/80 dark:border-orange-800/70 text-[#fa8221] dark:text-[#ff983d]',
      accentGlow: 'from-[#016ba5]/15 via-[#fa8221]/10 to-transparent',
      avatarGlow: 'from-[#fa8221] via-[#016ba5] to-[#38bdf8]',
      statusPipBg: '#016ba5',
      imagePosition: 'center 30%', // Strictly centered coordinate for Khalil's portrait
    },
    {
      id: 'team-elmahdi',
      nameKey: 'team.elmahdi_name',
      roleKey: 'team.elmahdi_role',
      tagKey: 'team.elmahdi_tag',
      badgeKey: 'team.elmahdi_badge',
      photoBadgeKey: 'team.elmahdi_photo_badge',
      bioKey: 'team.elmahdi_bio',
      shortBioKey: 'team.elmahdi_short_bio',
      image: '/team/elmahdi-akarkaou-new.jpg',
      linkedin: 'https://www.linkedin.com/in/elmahdi-a-0067b235a',
      roleColor: '#fa8221',
      roleTextColor: 'text-[#fa8221] dark:text-[#ff983d]',
      badgeBg: 'bg-gradient-to-r from-sky-50 to-orange-50 dark:from-sky-950/70 dark:to-orange-950/70 border-sky-200/80 dark:border-orange-800/70 text-[#016ba5] dark:text-[#38bdf8]',
      badgeSparkleColor: 'text-[#fa8221] dark:text-[#ff983d]',
      tagBg: 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-200/80 dark:border-sky-800/70 text-[#016ba5] dark:text-[#38bdf8]',
      accentGlow: 'from-[#fa8221]/15 via-[#016ba5]/15 to-transparent',
      avatarGlow: 'from-[#016ba5] via-[#fa8221] to-[#ff983d]',
      statusPipBg: '#fa8221',
      imagePosition: 'center 25%', // Strictly centered coordinate for ElMahdi's portrait
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('team.eyebrow')}</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2.5">
            {t('team.title')}
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t('team.subtitle')}
          </p>
        </div>
      )}

      {/* 
        Unified 3-Column Desktop Grid / 100% Width Vertical Single-Column Mobile Stack
        - Desktop & Tablet (md:): Clean 3-column side-by-side executive cards
        - Mobile (<md): Single-column 100% width vertical stack (zero horizontal scroll)
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-7 w-full">
        {teamMembers.map((member) => {
          const isExpanded = Boolean(expandedBios[member.id]);

          return (
            <div
              key={member.id}
              id={member.id}
              className="w-full group relative rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/90 dark:border-slate-800 hover:border-[#fa8221]/50 dark:hover:border-[#38bdf8]/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden scroll-mt-28"
            >
              {/* Subtle top ambient warmth glow matching member's accent */}
              <div className={cn("absolute top-0 left-0 right-0 h-28 bg-gradient-to-b opacity-40 dark:opacity-25 pointer-events-none rounded-t-2xl", member.accentGlow)} />

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10">
                
                {/* Header: Leadership Role Badge & Direct LinkedIn Icon Button */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-headline font-black uppercase tracking-wider border shadow-2xs", member.badgeBg)}>
                    <Sparkles className={cn("w-3 h-3 shrink-0", member.badgeSparkleColor)} />
                    <span>{t(member.badgeKey)}</span>
                  </span>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('team.linkedin_label')} - ${t(member.nameKey)}`}
                    title={`${t('team.linkedin_label')} - ${t(member.nameKey)}`}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#0077b5] dark:bg-slate-800 dark:hover:bg-[#0077b5] text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer group/in"
                  >
                    <svg
                      className="w-3.5 h-3.5 fill-current"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                </div>

                {/* Avatar Portrait with Strict Centering & Dual-Tone Halo */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 group/avatar">
                  {/* Subtle backlight ring glow in AbtalQuest Orange & Blue */}
                  <div 
                    className={cn(
                      "absolute -inset-1.5 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-tr",
                      member.avatarGlow
                    )}
                  />

                  {/* Rounded Squircle Frame */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                    <img
                      src={member.image}
                      alt={`${t(member.nameKey)} - ${t(member.roleKey)}`}
                      style={{ 
                        objectFit: 'cover',
                        objectPosition: member.imagePosition 
                      }}
                      loading="lazy"
                      className="w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover/avatar:scale-105"
                    />
                  </div>

                  {/* Corner Status Pip with Pulse */}
                  <span 
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-xs flex items-center justify-center"
                    style={{ backgroundColor: member.statusPipBg }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                {/* Name & Title Block */}
                <div className="text-center mb-3">
                  <h3 className="font-headline text-lg sm:text-xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-1 group-hover:text-[#016ba5] dark:group-hover:text-[#38bdf8] transition-colors">
                    {t(member.nameKey)}
                  </h3>

                  <p className={cn("font-headline font-bold text-xs sm:text-sm tracking-wide mb-2.5", member.roleTextColor)}>
                    {t(member.roleKey)}
                  </p>

                  {/* Specialty Tag in Cohesive Orange / Blue Blend */}
                  <div className="inline-block">
                    <span className={cn("font-body text-[11px] font-bold px-3 py-1 rounded-full border shadow-2xs", member.tagBg)}>
                      {t(member.tagKey)}
                    </span>
                  </div>
                </div>

                {/* Executive Bio: Crisp 2-sentence blurb with smooth expansion */}
                <div className="mt-1 mb-4 flex-1 text-left rtl:text-right">
                  <p className="font-body text-xs sm:text-[13px] text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
                    {isExpanded ? t(member.bioKey) : t(member.shortBioKey)}
                  </p>

                  {/* Read More / Show Less Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleBio(member.id)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#016ba5] dark:text-[#38bdf8] hover:text-[#fa8221] dark:hover:text-[#ff983d] hover:underline cursor-pointer transition-colors"
                  >
                    <span>{isExpanded ? t('team.read_less') : t('team.read_more')}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Footer Action: Sleek LinkedIn Profile Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/70 mt-auto">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('team.linkedin_label')} - ${t(member.nameKey)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-[#0077b5] dark:bg-slate-800 dark:hover:bg-[#0077b5] text-white font-headline text-xs font-bold tracking-wide transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group/btn active:scale-[0.98]"
                  >
                    {/* LinkedIn SVG Icon */}
                    <svg
                      className="w-3.5 h-3.5 fill-current shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    <span>{t('team.linkedin_label')}</span>
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover/btn:opacity-100 transition-opacity rtl:rotate-180" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamProfilesSection;
