import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'foundation' | 'interactive' | 'contrast';
  borderHighlight?: 'primary' | 'secondary' | 'gamification' | 'success' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  borderHighlight = 'none',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300 overflow-hidden';

  const variantStyles = {
    default: 'bg-white dark:bg-[#0F2F4E] border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md text-slate-800 dark:text-slate-100',
    // 2% Foundation (#0A2540) - Dark cosmic surface
    foundation: 'bg-[#0A2540] border border-[#016ba5]/30 text-white shadow-xl',
    interactive:
      'bg-white dark:bg-[#0F2F4E] border border-slate-200 dark:border-slate-700 hover:border-[#016ba5]/40 dark:hover:border-[#38BDF8]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 text-slate-800 dark:text-slate-100 cursor-pointer',
    // 4% Contrast (#1C1C1C) - Deep contrast surface
    contrast: 'bg-[#1C1C1C] border border-white/10 text-white shadow-2xl',
  };

  const highlightStyles = {
    none: '',
    primary: 'border-t-4 border-t-[#016ba5]',
    secondary: 'border-t-4 border-t-[#fa8221]',
    gamification: 'border-t-4 border-t-[#7C3AED]',
    success: 'border-t-4 border-t-[#22C55E]',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        highlightStyles[borderHighlight],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
