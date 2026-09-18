import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cta' | 'primary' | 'outline' | 'ghost' | 'gamification';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'cta',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles enforce Montserrat font, smooth transitions, and tactile feel
    const baseStyles =
      'font-headline inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 shadow-sm min-h-[34px]',
      md: 'text-sm px-5 py-2.5 gap-2 shadow-sm min-h-[42px]',
      lg: 'text-base px-6 py-3.5 gap-2.5 shadow-md min-h-[48px]',
      xl: 'text-lg px-8 py-4 gap-3 shadow-lg min-h-[56px] rounded-2xl',
    };

    const variantStyles = {
      // Secondary Color (35%) - Primary CTA & High Energy
      cta: 'bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white shadow-cta hover:shadow-cta-hover focus-visible:ring-[#fa8221]',
      // Primary Brand (40%) - Structural and Secondary Actions
      primary:
        'bg-[#016ba5] hover:bg-[#015786] active:bg-[#00466c] text-white shadow-brand hover:brightness-105 focus-visible:ring-[#016ba5]',
      // Clean Bordered Outline
      outline:
        'border-2 border-[#016ba5] text-[#016ba5] hover:bg-[#016ba5]/10 active:bg-[#016ba5]/20 focus-visible:ring-[#016ba5]',
      // Subtle Ghost Action
      ghost:
        'text-[#016ba5] hover:bg-[#016ba5]/10 active:bg-[#016ba5]/15 focus-visible:ring-[#016ba5]',
      // Gamification Color (4%) - Special Quest & Reward Actions
      gamification:
        'bg-[#7C3AED] hover:bg-[#6d28d9] active:bg-[#5b21b6] text-white shadow-quest hover:brightness-110 focus-visible:ring-[#7C3AED]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
