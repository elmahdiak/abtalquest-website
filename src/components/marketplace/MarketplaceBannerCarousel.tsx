import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Brain, 
  Heart, 
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceBannerCarouselProps {
  onFilterPlanet: (planetKey: string) => void;
}

export const MarketplaceBannerCarousel: React.FC<MarketplaceBannerCarouselProps> = ({
  onFilterPlanet,
}) => {
  const { t, direction } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'thinkers-season',
      tag: t('marketplace.banner_tag_1'),
      title: t('marketplace.banner_title_1'),
      desc: t('marketplace.banner_desc_1'),
      ctaText: t('marketplace.banner_cta_1'),
      planet: 'thinkers',
      bgGradient: 'from-[#016ba5] via-[#0284c7] to-[#0369a1]',
      accentBg: 'bg-[#016ba5]',
      badgeColor: 'bg-white/20 text-white border-white/30',
      icon: Brain,
      statNumber: '100%',
      statLabel: 'Screen-Free Birchwood',
    },
    {
      id: 'coop-games',
      tag: t('marketplace.banner_tag_2'),
      title: t('marketplace.banner_title_2'),
      desc: t('marketplace.banner_desc_2'),
      ctaText: t('marketplace.banner_cta_2'),
      planet: 'heart',
      bgGradient: 'from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]',
      accentBg: 'bg-[#7C3AED]',
      badgeColor: 'bg-white/20 text-white border-white/30',
      icon: Heart,
      statNumber: 'Zero-Sum',
      statLabel: 'Replaced with Kindness',
    },
    {
      id: 'brave-trail',
      tag: t('marketplace.banner_tag_3'),
      title: t('marketplace.banner_title_3'),
      desc: t('marketplace.banner_desc_3'),
      ctaText: t('marketplace.banner_cta_3'),
      planet: 'brave',
      bgGradient: 'from-[#fa8221] via-[#e87313] to-[#c25e0a]',
      accentBg: 'bg-[#fa8221]',
      badgeColor: 'bg-white/20 text-white border-white/30',
      icon: Compass,
      statNumber: 'Drop-Tested',
      statLabel: 'Field-Ready Durability',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play timer (every 6.5s unless paused)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl shadow-xl transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background with animated color shift */}
      <div 
        className={cn(
          "relative min-h-[300px] md:min-h-[340px] p-6 sm:p-10 flex flex-col justify-center text-white bg-gradient-to-r transition-all duration-700 ease-out",
          slide.bgGradient
        )}
      >
        {/* Subtle Decorative Pattern & Ambient Blur Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border mb-4 bg-white/15 text-white border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{slide.tag}</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3 text-white">
            {slide.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-xl font-normal">
            {slide.desc}
          </p>

          {/* Actions & Stat */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onFilterPlanet(slide.planet)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className={cn(
                "w-4 h-4 text-slate-900 transition-transform",
                direction === 'rtl' ? 'rotate-180' : ''
              )} />
            </button>

            {/* Micro Trust / Stat Metric */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 text-xs">
              <IconComponent className="w-5 h-5 text-amber-300" />
              <div>
                <div className="font-extrabold text-white">{slide.statNumber}</div>
                <div className="text-white/80 text-[11px]">{slide.statLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Arrow Buttons */}
        <div className={cn(
          "absolute bottom-6 flex items-center gap-2 z-20",
          direction === 'rtl' ? 'left-6' : 'right-6'
        )}>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
          >
            {direction === 'rtl' ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 flex items-center justify-center text-white transition-all active:scale-90 cursor-pointer"
          >
            {direction === 'rtl' ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
