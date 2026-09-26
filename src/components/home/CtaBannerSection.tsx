import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface CtaBannerSectionProps {
  onDownloadClick?: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({
  onDownloadClick,
  title = 'Every Child Has a Quest.',
  subtitle = 'Give your child a digital experience that encourages curiosity, action and growth—on screen and in the real world.',
  buttonText = 'Download AbtalQuest →',
}) => {
  return (
    <section className="py-20 sm:py-28 bg-[#06152B] text-white relative overflow-hidden bg-star-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-gradient-to-r from-[#016ba5]/20 via-[#38bdf8]/15 to-[#fa8221]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
        
        {/* Star Sparkle Icon */}
        <div className="text-[#fa8221] mb-4">
          <Sparkles className="w-8 h-8 animate-pulse mx-auto" />
        </div>

        {/* Title */}
        <h2 className="font-headline text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="font-body text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
          {subtitle}
        </p>

        {/* Orange CTA Button */}
        <div>
          <button
            type="button"
            onClick={onDownloadClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-headline font-bold text-base shadow-[0_6px_20px_rgba(250,130,33,0.4)] hover:shadow-[0_8px_26px_rgba(250,130,33,0.55)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default CtaBannerSection;
