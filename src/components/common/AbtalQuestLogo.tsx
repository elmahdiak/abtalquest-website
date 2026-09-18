import React from 'react';
import { cn } from '../../lib/utils';

export interface AbtalQuestLogoProps {
  /**
   * Color variant according to brand guidelines:
   * - 'light': On white or light backgrounds (default)
   * - 'dark': On dark backgrounds (footer, hero dark mode)
   * - 'brand': On primary brand colored backgrounds
   * - 'monochrome': For subtle monochrome or watermark use
   */
  variant?: 'light' | 'dark' | 'brand' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  tagline?: string;
}

export const AbtalQuestLogo: React.FC<AbtalQuestLogoProps> = ({
  variant = 'light',
  size = 'md',
  showText = true,
  direction = 'horizontal',
  className,
  tagline,
}) => {
  // Determine sizing tokens
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', subtext: 'text-[9px]', gap: 'gap-2' },
    md: { icon: 42, text: 'text-2xl', subtext: 'text-[11px]', gap: 'gap-2.5' },
    lg: { icon: 54, text: 'text-3xl', subtext: 'text-xs', gap: 'gap-3' },
    xl: { icon: 72, text: 'text-4xl', subtext: 'text-sm', gap: 'gap-4' },
  };

  const { icon: iconSize, text: textSize, subtext: subtextSize, gap } = sizeMap[size];

  // Color mapping based on page 3 brand specifications
  const getColors = () => {
    switch (variant) {
      case 'dark':
        return {
          head: '#38bdf8', // Clarity/Sky blue for pop on dark
          arch: '#016ba5', // Primary brand blue
          accent: '#fa8221', // Energy Orange
          textPrimary: '#ffffff',
          textSecondary: '#fa8221',
          tagline: '#94a3b8',
        };
      case 'brand':
        return {
          head: '#ffffff',
          arch: '#ffffff',
          accent: '#fa8221',
          textPrimary: '#ffffff',
          textSecondary: '#fa8221',
          tagline: '#bae6fd',
        };
      case 'monochrome':
        return {
          head: '#1C1C1C',
          arch: '#1C1C1C',
          accent: '#1C1C1C',
          textPrimary: '#1C1C1C',
          textSecondary: '#1C1C1C',
          tagline: '#64748B',
        };
      case 'light':
      default:
        return {
          head: '#016ba5', // Primary Brand #016ba5
          arch: '#016ba5',
          accent: '#fa8221', // Secondary Energy Orange #fa8221
          textPrimary: '#016ba5',
          textSecondary: '#fa8221',
          tagline: '#64748B',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={cn(
        'inline-flex items-center select-none transition-transform duration-200',
        direction === 'vertical' ? 'flex-col text-center' : 'flex-row text-left',
        gap,
        className
      )}
      aria-label="AbtalQuest Official Brand Logo"
    >
      {/* Brand Icon SVG: Accurate vector representation of the Abtal guardian arch and quest swirl */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        {/* Child / Guardian Head */}
        <circle
          cx="50"
          cy="20"
          r="9.5"
          fill={colors.head}
        />

        {/* Guardian Arch / Protective Shield Canopy */}
        <path
          d="M23 78 C23 48, 35 34, 50 34 C65 34, 77 48, 77 78"
          stroke={colors.arch}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Quest Flame / Question-Swoop (Energy Orange) */}
        <path
          d="M45 68 C44 59, 49 50, 56 50 C63.5 50, 67.5 55.5, 67.5 62 C67.5 70, 58 75.5, 52 75.5 C46.5 75.5, 43 71.5, 43 66.5"
          stroke={colors.accent}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Inner Core Point / Dot */}
        <circle
          cx="53"
          cy="63"
          r="3"
          fill={colors.accent}
        />
      </svg>

      {/* Brand Wordmark with official Typography rules: Montserrat Bold */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div
            className={cn(
              'font-headline font-extrabold tracking-tight flex items-baseline',
              textSize
            )}
          >
            <span style={{ color: colors.textPrimary }}>ABTAL</span>
            <span style={{ color: colors.textSecondary }}>Quest</span>
          </div>

          {tagline ? (
            <span
              className={cn('font-body font-normal tracking-wide mt-0.5', subtextSize)}
              style={{ color: colors.tagline }}
            >
              {tagline}
            </span>
          ) : (
            direction === 'vertical' && (
              <span
                className={cn('font-body tracking-wider uppercase opacity-80 mt-1', subtextSize)}
                style={{ color: colors.tagline }}
              >
                Safe Universe
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AbtalQuestLogo;
