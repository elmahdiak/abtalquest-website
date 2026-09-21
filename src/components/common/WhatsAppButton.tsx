import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { 
  getStoredWhatsAppPosition, 
  setStoredWhatsAppPosition, 
  WHATSAPP_POSITION_EVENT,
  type WhatsAppPosition 
} from '../../utils/whatsapp';

export type { WhatsAppPosition };

export interface WhatsAppButtonProps {
  phoneNumber?: string; // default: 212754402129
  position?: WhatsAppPosition;
  onPositionChange?: (newPosition: WhatsAppPosition) => void;
  showPositionSwitch?: boolean;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '212754402129',
  position: controlledPosition,
  onPositionChange,
  showPositionSwitch = true,
  className,
}) => {
  const { t, direction } = useLanguage();
  const [internalPosition, setInternalPosition] = useState<WhatsAppPosition>(getStoredWhatsAppPosition);
  const [isHovered, setIsHovered] = useState(false);

  // Active position is controlled prop if provided, else internal state
  const currentPosition = controlledPosition ?? internalPosition;
  const isRight = currentPosition === 'bottom-right';

  // Listen for global position change events (e.g. from Admin Settings or another instance)
  useEffect(() => {
    const handlePositionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<WhatsAppPosition>;
      if (customEvent.detail && (customEvent.detail === 'bottom-right' || customEvent.detail === 'bottom-left')) {
        setInternalPosition(customEvent.detail);
      }
    };

    window.addEventListener(WHATSAPP_POSITION_EVENT, handlePositionEvent);
    return () => {
      window.removeEventListener(WHATSAPP_POSITION_EVENT, handlePositionEvent);
    };
  }, []);

  const handleTogglePosition = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextPos: WhatsAppPosition = isRight ? 'bottom-left' : 'bottom-right';
    setInternalPosition(nextPos);
    setStoredWhatsAppPosition(nextPos);
    onPositionChange?.(nextPos);
  }, [isRight, onPositionChange]);

  // Detect if a modal is open (via body overflow hidden) to avoid any modal collision
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const checkModalState = () => {
      setIsModalOpen(document.body.style.overflow === 'hidden');
    };
    checkModalState();
    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  // Flex alignment:
  // Right docked: button on far right, tooltip to left.
  // Left docked: button on far left, tooltip to right.
  const flexDirClass = isRight
    ? (direction === 'rtl' ? 'flex-row' : 'flex-row-reverse')
    : (direction === 'rtl' ? 'flex-row-reverse' : 'flex-row');

  const tooltipMarginClass = isRight
    ? (direction === 'rtl' ? 'ml-3' : 'mr-3')
    : (direction === 'rtl' ? 'mr-3' : 'ml-3');

  // Bottom-left is default; if docked right, offset vertically above the floating cart button (bottom-24)
  const positionClasses = isRight
    ? "bottom-24 right-4 sm:bottom-24 sm:right-6 md:bottom-24 md:right-7"
    : "bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-7 md:left-7";

  return (
    <div
      className={cn(
        "fixed z-50 flex items-center group transition-all duration-300 ease-out",
        positionClasses,
        flexDirClass,
        isModalOpen ? "opacity-0 pointer-events-none scale-90 translate-y-4" : "opacity-100 pointer-events-auto scale-100 translate-y-0",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Circular WhatsApp Button Container */}
      <div className="relative flex items-center justify-center">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('whatsapp.chat_with_us')}
          className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/30 animate-pulse pointer-events-none" />

          {/* Radar / Ping animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

          {/* Live Online Badge Dot */}
          <span className={cn(
            "absolute top-0 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center",
            isRight ? "right-0" : "left-0"
          )}>
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white animate-pulse" />
          </span>

          {/* Official WhatsApp Chat Bubble & Phone Icon */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current drop-shadow-sm transition-transform duration-300 group-hover:rotate-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>

        {/* Quick Position Switcher Micro-Button (appears on hover) */}
        {showPositionSwitch && (
          <button
            type="button"
            onClick={handleTogglePosition}
            title={isRight ? t('whatsapp.dock_left') : t('whatsapp.dock_right')}
            aria-label={isRight ? t('whatsapp.dock_left') : t('whatsapp.dock_right')}
            className={cn(
              "absolute -top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-[#25D366] hover:border-[#25D366]/50 hover:scale-115 active:scale-95 transition-all duration-200 z-10 cursor-pointer",
              isRight ? "-left-1" : "-right-1",
              "opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            )}
          >
            <ArrowLeftRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Interactive Floating Tooltip */}
      <div
        className={cn(
          "hidden sm:flex flex-col items-start bg-white dark:bg-[#0F2F4E] py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 pointer-events-auto select-none",
          tooltipMarginClass,
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : (isRight
                ? (direction === 'rtl' ? "opacity-0 -translate-x-2 scale-95 pointer-events-none" : "opacity-0 translate-x-2 scale-95 pointer-events-none")
                : (direction === 'rtl' ? "opacity-0 translate-x-2 scale-95 pointer-events-none" : "opacity-0 -translate-x-2 scale-95 pointer-events-none")
              )
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-headline font-bold text-slate-900 dark:text-white whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>{t('whatsapp.tooltip_title')}</span>
        </div>
        <span className="text-[11px] font-body text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {t('whatsapp.response_time')}
        </span>

        {/* Position Toggle Link in Tooltip */}
        {showPositionSwitch && (
          <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
            <button
              type="button"
              onClick={handleTogglePosition}
              className="inline-flex items-center gap-1.5 text-[10px] font-headline font-bold text-slate-500 dark:text-slate-400 hover:text-[#25D366] dark:hover:text-[#25D366] hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              <ArrowLeftRight className="w-2.5 h-2.5 text-[#25D366]" />
              <span>{isRight ? t('whatsapp.dock_left') : t('whatsapp.dock_right')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppButton;
