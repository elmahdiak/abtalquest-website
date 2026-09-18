import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'gamification' | 'success' | 'warning' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  pulse?: boolean;
}

/**
 * AbtalQuest Badge Component
 * Strictly complies with Brand Typography Rule:
 * "Use 'Baloo' (or rounded playful styles) exclusively for badges, rewards, and gamified elements."
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'gamification',
  size = 'md',
  icon,
  pulse = false,
  ...props
}) => {
  // Enforce 'Baloo 2' font for all gamified badges and rewards
  const baseStyles =
    'font-gamification inline-flex items-center font-bold tracking-normal rounded-full border transition-all duration-200 select-none shadow-sm';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3.5 py-1 gap-1.5',
    lg: 'text-base px-4.5 py-1.5 gap-2 shadow-md',
  };

  const variantStyles = {
    // Gamification (4% - #7C3AED): Levels, quests, rank badges
    gamification:
      'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/30 hover:bg-[#7C3AED]/20 hover:border-[#7C3AED]',
    // Success / Achievement (4% - #22C55E): Completed tasks, earned stars, milestone rewards
    success:
      'bg-[#22C55E]/10 text-[#16a34a] border-[#22C55E]/30 hover:bg-[#22C55E]/20 hover:border-[#22C55E]',
    // Warning / Attention (3% - #FACC15): Alerts, reminders, safety notices
    warning:
      'bg-[#FACC15]/20 text-[#a16207] border-[#FACC15]/50 hover:bg-[#FACC15]/30',
    // Info / Clarity (4% - #38BDF8): Helpful tips, guide tags
    info:
      'bg-[#38BDF8]/15 text-[#0284c7] border-[#38BDF8]/40 hover:bg-[#38BDF8]/25',
    // Primary Brand (#016ba5): Foundation badges, universe tags
    primary:
      'bg-[#016ba5]/10 text-[#016ba5] border-[#016ba5]/25 hover:bg-[#016ba5]/15',
    // Secondary CTA (#fa8221): Featured / Hot quest indicators
    secondary:
      'bg-[#fa8221]/15 text-[#c2410c] border-[#fa8221]/30 hover:bg-[#fa8221]/25',
  };

  return (
    <div
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0 text-current">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default Badge;
