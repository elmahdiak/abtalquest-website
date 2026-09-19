import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface WhatsAppButtonProps {
  phoneNumber?: string; // default: 212754402129
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '212754402129',
  className,
}) => {
  const { t, direction } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-40 flex items-center group",
        direction === 'rtl' ? 'flex-row' : 'flex-row-reverse',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Circular WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp.chat_with_us')}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da850] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 cursor-pointer"
      >
        {/* Radar / Ping animation */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />

        {/* Live Online Badge Dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </span>

        {/* Official WhatsApp Chat Bubble & Phone Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-sm transition-transform duration-300 group-hover:rotate-6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      {/* Interactive Floating Tooltip (Desktop & Hover/Focus) */}
      <div
        className={cn(
          "hidden sm:flex flex-col items-start bg-white dark:bg-[#0F2F4E] py-2.5 px-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 pointer-events-none select-none",
          direction === 'rtl' ? 'ml-3' : 'mr-3',
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-2 scale-95"
        )}
      >
        <div className="flex items-center gap-1.5 text-xs font-headline font-bold text-slate-900 dark:text-white whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>{t('whatsapp.tooltip_title')}</span>
        </div>
        <span className="text-[11px] font-body text-slate-500 dark:text-slate-400 whitespace-nowrap">
          {t('whatsapp.response_time')}
        </span>
      </div>
    </div>
  );
};

export default WhatsAppButton;
