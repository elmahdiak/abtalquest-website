import React from 'react';

export interface LogoProps {
  className?: string;
  variant?: 'color' | 'monochrome';
}

/**
 * 1. EXPLORER: Compass gauge dial around 'E' + bold 'XPLORER' wordmark
 */
export const ExplorerLogo: React.FC<LogoProps> = ({ className = 'h-7 w-auto' }) => (
  <svg 
    viewBox="0 0 160 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="EXPLORER Logo"
  >
    {/* Compass dial gauge around E */}
    <g className="text-[#028090] dark:text-[#2DD4BF]">
      <path 
        d="M 17 6 A 12 12 0 1 0 17 30" 
        stroke="currentColor" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
      />
      {/* Top compass needle notch */}
      <line x1="17" y1="2" x2="17" y2="7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* Left compass notch */}
      <line x1="3" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      {/* 45 deg dial tick */}
      <line x1="7" y1="10" x2="11" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lower dial tick */}
      <line x1="7" y1="26" x2="11" y2="23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </g>

    {/* Letter E with compass needle middle */}
    <path 
      d="M 14 10 H 23 M 14 10 V 26 H 23 M 14 18 H 25" 
      stroke="currentColor" 
      strokeWidth="3.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-[#028090] dark:text-[#2DD4BF]"
    />

    {/* Wordmark: XPLORER */}
    <text 
      x="31" 
      y="25" 
      fontFamily="Montserrat, system-ui, sans-serif" 
      fontWeight="900" 
      fontSize="19" 
      letterSpacing="0.06em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      XPLORER
    </text>
  </svg>
);

/**
 * 2. IBDA3 LAB: "!BD 3" in magenta + astronaut / visionary in center + "L B" in dark blue
 */
export const Ibda3LabLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 115 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Ibda3 Lab Logo"
  >
    {/* !BD in vibrant magenta */}
    <text 
      x="2" 
      y="18" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="17" 
      fill="#E11D48"
      letterSpacing="-0.02em"
    >
      !BD
    </text>

    {/* 3 in magenta */}
    <text 
      x="95" 
      y="18" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="18" 
      fill="#E11D48"
    >
      3
    </text>

    {/* Center stylized astronaut / creative thinker */}
    <g transform="translate(42, 2)">
      {/* Planetary halo orbit ring around helmet */}
      <ellipse 
        cx="16" 
        cy="12" 
        rx="15" 
        ry="4.5" 
        transform="rotate(-20 16 12)" 
        fill="none" 
        stroke="#F59E0B" 
        strokeWidth="1.8" 
      />
      {/* Helmet visor / head */}
      <circle cx="16" cy="11" r="7.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.4" />
      {/* Visor reflection */}
      <path d="M 13 8 Q 16 7 18 10 Q 16 13 14 12 Z" fill="#F59E0B" opacity="0.6" />
      {/* Astronaut suit shoulders and hands holding light */}
      <path 
        d="M 9 20 C 9 16, 23 16, 23 20 L 25 34 C 23 37, 9 37, 7 34 Z" 
        fill="#F8FAFC" 
        stroke="#0284C7" 
        strokeWidth="1.2" 
      />
      {/* Cupped hands reaching up */}
      <path d="M 11 25 L 14 20 L 16 23 L 18 20 L 21 25" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="18" r="1.5" fill="#38BDF8" />
    </g>

    {/* L and B below in navy blue */}
    <text 
      x="10" 
      y="38" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="17" 
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      L
    </text>
    <text 
      x="95" 
      y="38" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="17" 
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      B
    </text>
  </svg>
);

/**
 * 3. INJAZ Al Maghreb: Faceted teal/cyan triangle icon + wordmark
 */
export const InjazLogo: React.FC<LogoProps> = ({ className = 'h-7 w-auto' }) => (
  <svg 
    viewBox="0 0 150 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Injaz Al Maghreb Logo"
  >
    {/* Dynamic faceted geometric triangle arrow pointing upper-right */}
    <g transform="translate(0, 2)">
      {/* Facet 1: deep teal */}
      <polygon points="18,0 36,0 36,18" fill="#005F73" />
      {/* Facet 2: cyan */}
      <polygon points="18,0 36,18 18,18" fill="#0A9396" />
      {/* Facet 3: aquamarine */}
      <polygon points="0,18 18,18 18,36" fill="#0A9396" />
      {/* Facet 4: light cyan */}
      <polygon points="0,18 18,36 0,36" fill="#94D2BD" />
      {/* Facet 5: center connector */}
      <polygon points="18,18 36,18 36,36" fill="#005F73" />
      {/* Facet 6: bottom inner */}
      <polygon points="18,18 36,36 18,36" fill="#0A9396" />
    </g>

    {/* INJAZ wordmark */}
    <text 
      x="46" 
      y="19" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="800" 
      fontSize="17" 
      letterSpacing="0.04em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      INJAZ
    </text>
    {/* Al Maghreb subline */}
    <text 
      x="46" 
      y="32" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="600" 
      fontSize="11" 
      letterSpacing="0.02em"
      className="fill-slate-600 dark:fill-slate-300 transition-colors"
    >
      Al Maghreb
    </text>
  </svg>
);

/**
 * 4. CRI Fès-Meknès: Matrix pixel swarm + Trilingual identity (Arabic, Tifinagh, French)
 */
export const CriFesMeknesLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 190 42" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="CRI Fès-Meknès Logo"
  >
    {/* Pixel cluster dispersion matrix with Moroccan Red & Green */}
    <g transform="translate(2, 4)">
      {/* Small trailing pixels on left */}
      <rect x="0" y="8" width="2" height="2" fill="#C1272D" />
      <rect x="3" y="11" width="2.5" height="2.5" fill="#C1272D" />
      <rect x="7" y="6" width="3" height="3" fill="#C1272D" />
      <rect x="7" y="13" width="3" height="3" fill="#C1272D" />
      <rect x="12" y="9" width="4" height="4" fill="#C1272D" />
      {/* Central green core squares */}
      <rect x="17" y="5" width="5" height="5" fill="#006233" />
      <rect x="23" y="5" width="5" height="5" fill="#006233" />
      {/* Expanding red squares */}
      <rect x="17" y="12" width="5" height="5" fill="#C1272D" />
      <rect x="23" y="12" width="5" height="5" fill="#C1272D" />
      <rect x="29" y="3" width="6" height="6" fill="#C1272D" />
      <rect x="29" y="11" width="6" height="6" fill="#C1272D" />
      <rect x="37" y="6" width="7" height="7" fill="#C1272D" />
      <rect x="37" y="15" width="7" height="7" fill="#C1272D" />
    </g>

    {/* Trilingual Text Block */}
    <g transform="translate(52, 0)">
      {/* Arabic Top Line */}
      <text 
        x="0" 
        y="12" 
        fontFamily="Tajawal, Cairo, sans-serif" 
        fontWeight="800" 
        fontSize="9.5" 
        className="fill-slate-900 dark:fill-white transition-colors"
      >
        المركز الجهوي للاستثمار فاس مكناس
      </text>

      {/* Amazigh Tifinagh Script */}
      <text 
        x="0" 
        y="23" 
        fontFamily="sans-serif" 
        fontWeight="700" 
        fontSize="7.5" 
        letterSpacing="0.08em"
        className="fill-slate-600 dark:fill-slate-400 transition-colors"
      >
        +oCC.O+ oICI.E I :OO.O+ X.O - CKI.O
      </text>

      {/* French Official Name */}
      <text 
        x="0" 
        y="33" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="600" 
        fontSize="7" 
        letterSpacing="0.02em"
        className="fill-slate-700 dark:fill-slate-300 transition-colors"
      >
        Centre Régional d'Investissement Fès - Meknès
      </text>
    </g>
  </svg>
);

/**
 * 5. nexaya: 45° folded ribbon infinity polygon + bold lowercase wordmark
 */
export const NexayaLogo: React.FC<LogoProps> = ({ className = 'h-7 w-auto' }) => (
  <svg 
    viewBox="0 0 135 34" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="nexaya Logo"
  >
    {/* Signature green folded ribbon loop */}
    <g transform="translate(2, 2)">
      <path 
        d="M 12 4 L 23 23 C 25 27 21 30 17 28 L 5 13 C 2 9 6 5 10 7 L 25 23" 
        fill="none" 
        stroke="#48BB78" 
        strokeWidth="4.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M 19 6 L 27 18 C 30 22 26 26 22 24 L 14 12" 
        fill="none" 
        stroke="#38A169" 
        strokeWidth="4.2" 
        strokeLinecap="round" 
      />
    </g>

    {/* nexaya wordmark */}
    <text 
      x="38" 
      y="24" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="22" 
      letterSpacing="-0.03em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      nexaya
    </text>
  </svg>
);

/**
 * 6. ENVESTORS: Sophisticated spaced wordmark + dual-color "INNOVATION & SCALE-UP NATION" banner
 */
export const EnvestorsLogo: React.FC<LogoProps> = ({ className = 'h-7 w-auto' }) => (
  <svg 
    viewBox="0 0 155 36" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="ENVESTORS Logo"
  >
    {/* ENVESTORS uppercase spaced wordmark */}
    <text 
      x="2" 
      y="16" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="700" 
      fontSize="14.5" 
      letterSpacing="0.28em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      ENVESTORS
    </text>

    {/* Sub-banner: INNOVATION & SCALE-UP NATION */}
    <g transform="translate(2, 22)">
      {/* Split color banner bar: green to cyan */}
      <rect x="0" y="0" width="75" height="10" rx="1.5" fill="#48BB78" />
      <rect x="75" y="0" width="75" height="10" rx="1.5" fill="#0284C7" />
      <text 
        x="75" 
        y="7.5" 
        textAnchor="middle" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="800" 
        fontSize="6.8" 
        letterSpacing="0.08em"
        fill="#FFFFFF"
      >
        INNOVATION &amp; SCALE-UP NATION
      </text>
    </g>
  </svg>
);

/**
 * 7. My Generous Planet: Purple rounded globe icon + tiered mission branding
 */
export const MyGenerousPlanetLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 175 42" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="My Generous Planet Logo"
  >
    {/* Purple rounded square icon with white globe */}
    <g transform="translate(2, 2)">
      <rect width="36" height="36" rx="8" fill="#6D28D9" />
      {/* Outer globe outline */}
      <circle cx="18" cy="18" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      {/* Stylized continents */}
      <path 
        d="M 13 13 Q 16 11 18 13 Q 20 16 18 19 Q 15 22 13 18 Z" 
        fill="#FFFFFF" 
        opacity="0.9" 
      />
      <path 
        d="M 20 18 Q 23 17 24 20 Q 23 24 21 22 Z" 
        fill="#FFFFFF" 
        opacity="0.9" 
      />
      {/* Equator & Meridian subtle lines */}
      <ellipse cx="18" cy="18" rx="12" ry="4" fill="none" stroke="#EDE9FE" strokeWidth="0.8" opacity="0.6" />
    </g>

    {/* Brand typography */}
    <g transform="translate(44, 4)">
      <text 
        x="0" 
        y="12" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="800" 
        fontSize="12.5" 
        className="fill-slate-900 dark:fill-white transition-colors"
      >
        My Generous
      </text>
      <text 
        x="0" 
        y="23" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="900" 
        fontSize="12" 
        fill="#7C3AED"
      >
        Planet
      </text>
      <text 
        x="0" 
        y="32" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="600" 
        fontSize="7.5" 
        className="fill-slate-600 dark:fill-slate-400 transition-colors"
      >
        More Than Just Capital
      </text>
    </g>
  </svg>
);

/**
 * 8. Startup Universe Morocco: Cyan figure-8 / infinity mark + dual-color brand text
 */
export const StartupUniverseLogo: React.FC<LogoProps> = ({ className = 'h-7 w-auto' }) => (
  <svg 
    viewBox="0 0 150 38" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Startup Universe Morocco Logo"
  >
    {/* Cyan / sky-blue figure-8 infinity mark */}
    <g transform="translate(2, 3)">
      <circle cx="9" cy="9" r="6.5" fill="none" stroke="#0EA5E9" strokeWidth="2.8" />
      <circle cx="9" cy="22" r="6.5" fill="none" stroke="#0EA5E9" strokeWidth="2.8" />
    </g>

    {/* Typography */}
    <g transform="translate(26, 0)">
      <text 
        x="0" 
        y="15" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="800" 
        fontSize="13" 
        className="fill-slate-900 dark:fill-white transition-colors"
      >
        Startup
      </text>
      <text 
        x="54" 
        y="15" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="600" 
        fontSize="13" 
        className="fill-slate-700 dark:fill-slate-300 transition-colors"
      >
        Universe
      </text>
      <text 
        x="0" 
        y="30" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="800" 
        fontSize="11" 
        fill="#FA8221"
      >
        Morocco
      </text>
    </g>
  </svg>
);

/**
 * 9. Al Akhawayn University (AUI): Calligraphic Arabic + Tifinagh + Classical English serif
 */
export const AlAkhawaynLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 165 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Al Akhawayn University Logo"
  >
    {/* Top line: Calligraphic Arabic in imperial forest green */}
    <text 
      x="82" 
      y="14" 
      textAnchor="middle" 
      fontFamily="Cairo, Tajawal, serif" 
      fontWeight="900" 
      fontSize="14" 
      fill="#15803D"
    >
      جامعة الأخوين
    </text>

    {/* Middle line: Tifinagh script with flanking horizontal rules */}
    <line x1="10" y1="22" x2="40" y2="22" stroke="#166534" strokeWidth="0.8" opacity="0.6" />
    <text 
      x="82" 
      y="24.5" 
      textAnchor="middle" 
      fontFamily="sans-serif" 
      fontWeight="700" 
      fontSize="7.5" 
      letterSpacing="0.08em"
      fill="#15803D"
    >
      +oO.O+ol+ II OXoIoI
    </text>
    <line x1="125" y1="22" x2="155" y2="22" stroke="#166534" strokeWidth="0.8" opacity="0.6" />

    {/* Bottom line: Classical uppercase serif AL AKHAWAYN UNIVERSITY */}
    <text 
      x="82" 
      y="37" 
      textAnchor="middle" 
      fontFamily="Georgia, serif" 
      fontWeight="700" 
      fontSize="8.5" 
      letterSpacing="0.14em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      AL AKHAWAYN UNIVERSITY
    </text>
  </svg>
);

/**
 * 10. UEMF (Université Euromed de Fès): Dual leaf seedling mark + UEMF bold acronym + trilingual subtitles
 */
export const UemfLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 170 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="UEMF EuroMed University Logo"
  >
    {/* Left Icon: Green & Blue dual stylized leaves / seedling */}
    <g transform="translate(2, 4)">
      {/* Left green leaf */}
      <path 
        d="M 5 22 C 3 14, 7 6, 12 2 C 11 10, 10 18, 5 22 Z" 
        fill="#22C55E" 
      />
      {/* Right blue leaf/flame */}
      <path 
        d="M 12 24 C 10 16, 14 8, 20 5 C 19 13, 17 20, 12 24 Z" 
        fill="#016BA5" 
      />
    </g>

    {/* UEMF Acronym */}
    <text 
      x="27" 
      y="22" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="20" 
      letterSpacing="0.02em"
      fill="#016BA5"
    >
      UEMF
    </text>

    {/* Subtitles: Arabic & English/French */}
    <g transform="translate(27, 28)">
      <text 
        x="0" 
        y="4" 
        fontFamily="Tajawal, Cairo, sans-serif" 
        fontWeight="700" 
        fontSize="6.5" 
        className="fill-slate-600 dark:fill-slate-300 transition-colors"
      >
        الجامعة الأورومتوسطية بفاس
      </text>
      <text 
        x="0" 
        y="11" 
        fontFamily="Montserrat, sans-serif" 
        fontWeight="600" 
        fontSize="5.5" 
        letterSpacing="0.02em"
        className="fill-slate-500 dark:fill-slate-400 transition-colors"
      >
        EUROMED UNIVERSITY OF FES
      </text>
    </g>
  </svg>
);

/**
 * 11. GITEX AFRICA Morocco: Tech faceted letters + calligraphy Morocco
 */
export const GitexAfricaLogo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 130 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="GITEX AFRICA Morocco Logo"
  >
    {/* GITEX bold stylized lettering */}
    <text 
      x="2" 
      y="18" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="18" 
      letterSpacing="0.12em"
      fill="#0284C7"
    >
      GITEX
    </text>

    {/* AFRICA uppercase spaced */}
    <text 
      x="3" 
      y="28" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="800" 
      fontSize="8.5" 
      letterSpacing="0.32em"
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      AFRICA
    </text>

    {/* Morocco calligraphic brush script in coral */}
    <text 
      x="36" 
      y="40" 
      fontFamily="cursive, Georgia, serif" 
      fontWeight="700" 
      fontSize="13" 
      fontStyle="italic"
      fill="#E11D48"
    >
      Morocco
    </text>
  </svg>
);

/**
 * 12. Morocco 300: Signature brush script "Morocco" + bold "300" + edition tag
 */
export const Morocco300Logo: React.FC<LogoProps> = ({ className = 'h-8 w-auto' }) => (
  <svg 
    viewBox="0 0 140 44" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Morocco 300 Edition Logo"
  >
    {/* Script "Morocco" */}
    <text 
      x="6" 
      y="22" 
      fontFamily="cursive, Georgia, serif" 
      fontWeight="700" 
      fontSize="20" 
      fontStyle="italic"
      fill="#016BA5"
    >
      Morocco
    </text>

    {/* Bold 300 Numerals */}
    <text 
      x="88" 
      y="24" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="900" 
      fontSize="22" 
      className="fill-slate-900 dark:fill-white transition-colors"
    >
      300
    </text>

    {/* — 2026 EDITION — */}
    <text 
      x="70" 
      y="38" 
      textAnchor="middle" 
      fontFamily="Montserrat, sans-serif" 
      fontWeight="800" 
      fontSize="7.5" 
      letterSpacing="0.14em"
      className="fill-slate-600 dark:fill-slate-400 transition-colors"
    >
      — 2026 EDITION —
    </text>
  </svg>
);
