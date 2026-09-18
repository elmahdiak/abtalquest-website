import React from 'react';
import { cn } from '../../lib/utils';
import logoLight from '../../assets/abtalquest-logo-transparent.png';
import logoDark from '../../assets/abtalquest-logo-dark-transparent.png';
import emblemLight from '../../assets/abtalquest-emblem.png';
import emblemDark from '../../assets/abtalquest-emblem-dark.png';

export interface AbtalQuestLogoProps {
  /**
   * Color variant:
   * - 'light': On white / light surfaces (default)
   * - 'dark': On dark backgrounds (footer, admin portal)
   * - 'brand': On primary brand colored backgrounds (#016ba5)
   * - 'monochrome': Grayscale presentation
   */
  variant?: 'light' | 'dark' | 'brand' | 'monochrome';
  /**
   * Size presets:
   * - 'xs': Compact (h-7 / 28px)
   * - 'sm': Small (h-9 / 36px)
   * - 'md': Medium (h-11 / 44px) - Default for navbar
   * - 'lg': Large (h-14 / 56px) - Default for footer / modal headers
   * - 'xl': Extra Large (h-20 / 80px) - Hero / showcase
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether to display brand wordmark text
   */
  showText?: boolean;
  /**
   * Layout direction:
   * - 'horizontal': Emblem on left, typography on right (ideal for headers)
   * - 'vertical': Official vertical stacked mark (emblem on top, ABTALQuest underneath)
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Display mode:
   * - 'auto': Full graphic for vertical, hybrid emblem+text for horizontal
   * - 'graphic': Full uploaded brand logo graphic directly
   * - 'emblem': Emblem icon only
   */
  mode?: 'auto' | 'graphic' | 'emblem';
  className?: string;
  tagline?: string;
  /**
   * When true or when href is provided, clicking redirects to homepage (#universe) and scrolls to top
   */
  clickable?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  alt?: string;
}

export const AbtalQuestLogo: React.FC<AbtalQuestLogoProps> = ({
  variant = 'light',
  size = 'md',
  showText = true,
  direction = 'horizontal',
  mode = 'auto',
  className,
  tagline,
  clickable = false,
  href,
  onClick,
  alt = 'AbtalQuest - Protecting Childhood, Empowering Growth',
}) => {
  const isDark = variant === 'dark' || variant === 'brand';

  // Size mapping for the visual elements
  const sizeMap = {
    xs: {
      imageH: 'h-6 sm:h-7',
      emblemH: 'h-5 sm:h-6',
      text: 'text-sm sm:text-base',
      subtext: 'text-[8px]',
      gap: 'gap-1.5',
    },
    sm: {
      imageH: 'h-7 sm:h-9',
      emblemH: 'h-6 sm:h-8',
      text: 'text-base sm:text-lg',
      subtext: 'text-[8px] sm:text-[9px]',
      gap: 'gap-1.5 sm:gap-2',
    },
    md: {
      imageH: 'h-8 sm:h-11',
      emblemH: 'h-7 sm:h-9 md:h-10',
      text: 'text-base sm:text-xl md:text-2xl',
      subtext: 'text-[9px] sm:text-[11px]',
      gap: 'gap-2 sm:gap-2.5',
    },
    lg: {
      imageH: 'h-11 sm:h-14',
      emblemH: 'h-9 sm:h-12',
      text: 'text-xl sm:text-3xl',
      subtext: 'text-[10px] sm:text-xs',
      gap: 'gap-2.5 sm:gap-3',
    },
    xl: {
      imageH: 'h-16 sm:h-20 md:h-24',
      emblemH: 'h-12 sm:h-16 md:h-20',
      text: 'text-2xl sm:text-4xl md:text-5xl',
      subtext: 'text-xs sm:text-sm',
      gap: 'gap-3 sm:gap-4',
    },
  };

  const tokens = sizeMap[size];

  // Asset selection
  const fullLogoSrc = isDark ? logoDark : logoLight;
  const emblemSrc = isDark ? emblemDark : emblemLight;

  // Colors for typographic wordmark in hybrid mode
  const textPrimaryColor = isDark ? '#ffffff' : '#016ba5';
  const textSecondaryColor = '#fa8221';
  const taglineColor = isDark ? '#94a3b8' : '#64748B';

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (clickable || href) {
      if (!href || href === '#universe' || href === '#') {
        e.preventDefault();
        window.location.hash = '#universe';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Render emblem only if showText is explicitly false or mode is emblem
  const shouldRenderEmblemOnly = !showText || mode === 'emblem';
  const shouldUseFullGraphic = mode === 'graphic' || (direction === 'vertical' && mode === 'auto');

  const content = (
    <>
      {shouldRenderEmblemOnly ? (
        <img
          src={emblemSrc}
          alt={alt}
          className={cn(
            tokens.emblemH,
            'w-auto object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105',
            variant === 'monochrome' && 'grayscale opacity-80'
          )}
          loading="eager"
          decoding="async"
        />
      ) : shouldUseFullGraphic ? (
        <div className="flex flex-col items-center text-center">
          <img
            src={fullLogoSrc}
            alt={alt}
            className={cn(
              tokens.imageH,
              'w-auto object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm',
              variant === 'monochrome' && 'grayscale opacity-80'
            )}
            loading="eager"
            decoding="async"
          />
          {tagline && (
            <span
              className={cn('font-body font-medium tracking-wide mt-1.5', tokens.subtext)}
              style={{ color: taglineColor }}
            >
              {tagline}
            </span>
          )}
        </div>
      ) : (
        /* Hybrid Mode: Iconic Emblem on left, bold official typographic wordmark on right */
        <div className={cn('flex items-center', tokens.gap)}>
          <img
            src={emblemSrc}
            alt="AbtalQuest Emblem"
            className={cn(
              tokens.emblemH,
              'w-auto object-contain flex-shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm',
              variant === 'monochrome' && 'grayscale opacity-80'
            )}
            loading="eager"
            decoding="async"
          />

          <div className="flex flex-col leading-none">
            <div
              className={cn(
                'font-headline font-black tracking-tight flex items-baseline select-none',
                tokens.text
              )}
            >
              <span style={{ color: textPrimaryColor }}>ABTAL</span>
              <span style={{ color: textSecondaryColor }}>Quest</span>
            </div>

            {tagline ? (
              <span
                className={cn('font-body font-medium tracking-wide mt-0.5 max-w-[140px] sm:max-w-none truncate', tokens.subtext)}
                style={{ color: taglineColor }}
              >
                {tagline}
              </span>
            ) : (
              direction === 'vertical' && (
                <span
                  className={cn('font-body tracking-wider uppercase opacity-80 mt-1', tokens.subtext)}
                  style={{ color: taglineColor }}
                >
                  Safe Universe
                </span>
              )
            )}
          </div>
        </div>
      )}
    </>
  );

  const containerClasses = cn(
    'inline-flex items-center select-none transition-transform duration-200',
    direction === 'vertical' ? 'flex-col text-center' : 'flex-row text-left',
    clickable && 'cursor-pointer hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5] rounded-xl',
    className
  );

  if (clickable || href) {
    return (
      <a
        href={href || '#universe'}
        onClick={handleClick}
        className={containerClasses}
        aria-label={alt}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={containerClasses} onClick={onClick} aria-label={alt}>
      {content}
    </div>
  );
};

export default AbtalQuestLogo;

