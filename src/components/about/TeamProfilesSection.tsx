import React, { useState, useRef } from 'react';
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
  accentGlow: string;
  imagePosition: string;
}

export const TeamProfilesSection: React.FC<TeamProfilesSectionProps> = ({ 
  className = '',
  showHeader = false 
}) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

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
      linkedin: 'https://www.linkedin.com/in/hajar-ouzif',
      roleColor: '#fa8221',
      roleTextColor: 'text-[#fa8221] dark:text-[#ff983d]',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/70 border-orange-200/80 dark:border-orange-800/80 text-[#fa8221] dark:text-orange-400',
      accentGlow: 'from-[#fa8221]/15 to-transparent',
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
      image: '/team/khalil-dadsi.jpg',
      linkedin: 'https://www.linkedin.com/in/khalildadsi',
      roleColor: '#016ba5',
      roleTextColor: 'text-[#016ba5] dark:text-[#38bdf8]',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/70 border-sky-200/80 dark:border-sky-800/80 text-[#016ba5] dark:text-[#38bdf8]',
      accentGlow: 'from-[#016ba5]/15 to-transparent',
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
      image: '/team/elmahdi-akarkaou.jpg',
      linkedin: 'https://www.linkedin.com/in/elmahdi-akarkaou',
      roleColor: '#7C3AED',
      roleTextColor: 'text-[#7C3AED] dark:text-[#a78bfa]',
      badgeBg: 'bg-purple-50 dark:bg-purple-950/70 border-purple-200/80 dark:border-purple-800/80 text-[#7C3AED] dark:text-purple-400',
      accentGlow: 'from-[#7C3AED]/15 to-transparent',
      imagePosition: '60% 25%',
    },
  ];

  const handleMobileScroll = () => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / teamMembers.length;
    const scrollLeft = Math.abs(el.scrollLeft);
    const index = Math.round(scrollLeft / cardWidth);
    setActiveMobileIndex(Math.min(Math.max(index, 0), teamMembers.length - 1));
  };

  const scrollToCard = (index: number) => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.85;
    const rtlMultiplier = isRtl ? -1 : 1;
    el.scrollTo({
      left: index * cardWidth * rtlMultiplier,
      behavior: 'smooth',
    });
    setActiveMobileIndex(index);
  };

  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-3">
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
        Unified 3-Column Desktop Grid / Mobile Horizontal Swipe Carousel
        - Desktop (lg:): Clean 3-column side-by-side layout
        - Tablet (md:): 2-3 column responsive grid
        - Mobile (<sm): Space-saving swipe track with snap points
      */}
      <div 
        ref={scrollTrackRef}
        onScroll={handleMobileScroll}
        className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-5 sm:gap-6 lg:gap-7 pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none scroll-smooth"
      >
        {teamMembers.map((member) => {
          const isExpanded = Boolean(expandedBios[member.id]);

          return (
            <div
              key={member.id}
              id={member.id}
              className="flex-none snap-center w-[85vw] max-w-[340px] sm:w-auto sm:max-w-none group relative rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden scroll-mt-28"
            >
              {/* Subtle top ambient warmth glow matching member's accent */}
              <div className={cn("absolute top-0 left-0 right-0 h-28 bg-gradient-to-b opacity-30 dark:opacity-20 pointer-events-none rounded-t-2xl", member.accentGlow)} />

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10">
                
                {/* Header: Leadership Role Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-headline font-black uppercase tracking-wider border shadow-2xs", member.badgeBg)}>
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{t(member.badgeKey)}</span>
                  </span>

                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                    AbtalQuest
                  </span>
                </div>

                {/* Avatar Portrait with Strict Centering */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 group/avatar">
                  {/* Subtle backlight ring glow */}
                  <div 
                    className="absolute -inset-1 rounded-2xl blur-md opacity-25 group-hover:opacity-50 transition-opacity duration-300"
                    style={{ backgroundColor: member.roleColor }}
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
                    style={{ backgroundColor: member.roleColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                {/* Name & Title Block */}
                <div className="text-center mb-3">
                  <h3 className="font-headline text-lg sm:text-xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-1 group-hover:text-[#016ba5] dark:group-hover:text-[#38bdf8] transition-colors">
                    {t(member.nameKey)}
                  </h3>

                  <p className={cn("font-headline font-bold text-xs sm:text-sm tracking-wide mb-2", member.roleTextColor)}>
                    {t(member.roleKey)}
                  </p>

                  {/* Specialty Tag */}
                  <div className="inline-block">
                    <span className="font-body text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/60">
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
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#016ba5] dark:text-[#38bdf8] hover:underline cursor-pointer transition-colors"
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
                    aria-label={`Connect with ${t(member.nameKey)} on LinkedIn`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-[#0077b5] dark:bg-slate-800 dark:hover:bg-[#0077b5] text-white font-headline text-xs font-bold tracking-wide transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group/btn"
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
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Swipe Pagination Indicator Dots (<sm only) */}
      <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
        {teamMembers.map((member, idx) => (
          <button
            key={`dot-${member.id}`}
            type="button"
            onClick={() => scrollToCard(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              activeMobileIndex === idx
                ? "w-6 bg-[#016ba5] dark:bg-[#38bdf8]"
                : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamProfilesSection;
