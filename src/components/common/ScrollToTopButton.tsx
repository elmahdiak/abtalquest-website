import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface ScrollToTopButtonProps {
  threshold?: number;
  className?: string;
  onClick?: () => void;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 300,
  className,
  onClick,
}) => {
  const { direction } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-4 scale-90 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label={direction === 'rtl' ? 'الرجوع للأعلى' : 'Scroll to top of page'}
        title={direction === 'rtl' ? 'الرجوع للأعلى' : 'Back to top'}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#016ba5] hover:bg-[#015888] active:bg-[#014972] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-[#016ba5]/30 group cursor-pointer"
      >
        <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] transition-transform duration-200 group-hover:-translate-y-0.5" />

        {/* Accessible Tooltip on Hover */}
        <span
          className={cn(
            "absolute bottom-full mb-2 hidden group-hover:block px-2.5 py-1 text-[11px] font-headline font-bold text-white bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg whitespace-nowrap shadow-lg border border-slate-700/50 pointer-events-none",
            direction === 'rtl' ? 'left-0' : 'right-0'
          )}
        >
          {direction === 'rtl' ? 'الرجوع للأعلى' : 'Back to top'}
        </span>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
