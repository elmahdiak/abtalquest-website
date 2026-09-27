import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Brain, 
  Heart, 
  ArrowRight,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import { 
  fetchBanners, 
  getStoredBanners, 
  subscribeToBannerChanges, 
  type MarketplaceBanner 
} from '../../services/bannerService';

export interface MarketplaceBannerCarouselProps {
  onFilterPlanet: (planetKey: string) => void;
  className?: string;
}

export const MarketplaceBannerCarousel: React.FC<MarketplaceBannerCarouselProps> = ({
  onFilterPlanet,
  className,
}) => {
  const { direction } = useLanguage();
  const [banners, setBanners] = useState<MarketplaceBanner[]>(() => {
    const cached = getStoredBanners();
    return cached.filter(b => b.isActive);
  });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load banners dynamically from Supabase & localStorage
  useEffect(() => {
    let isMounted = true;
    fetchBanners()
      .then((data) => {
        if (isMounted) {
          const active = data.filter(b => b.isActive);
          if (active.length > 0) {
            setBanners(active);
          }
        }
      })
      .catch((err) => {
        console.warn('Error loading marketplace banners:', err);
      });

    const subscription = subscribeToBannerChanges((updated) => {
      if (isMounted) {
        const active = updated.filter(b => b.isActive);
        if (active.length > 0) {
          setBanners(active);
          setCurrentSlide((prev) => Math.min(prev, active.length - 1));
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Safe active slide
  const activeIndex = Math.min(currentSlide, Math.max(0, totalSlides - 1));
  const slide = banners[activeIndex];

  // Carousel & Automatic Switching:
  // - If slide is a video: let it loop seamlessly (video element has loop attribute; no hurried auto-advance).
  // - If slide is an image: transition automatically to next slide after 4-5 seconds (slide.duration || 5s).
  useEffect(() => {
    if (!slide || isPaused || totalSlides <= 1) return;

    if (slide.type === 'image') {
      const delaySeconds = slide.duration && slide.duration >= 3 ? slide.duration : 5;
      const timer = setTimeout(() => {
        nextSlide();
      }, delaySeconds * 1000);

      return () => clearTimeout(timer);
    }
    // If video, let video loop continuously in the background
  }, [slide, isPaused, totalSlides, nextSlide]);

  if (!slide || totalSlides === 0) {
    return null;
  }

  // Determine planet icon
  const getPlanetIcon = (planetKey?: string) => {
    switch (planetKey?.toLowerCase()) {
      case 'thinkers':
        return Brain;
      case 'heart':
        return Heart;
      case 'brave':
        return Compass;
      default:
        return Sparkles;
    }
  };

  const IconComponent = getPlanetIcon(slide.planet);

  const handleCtaClick = () => {
    if (!slide.ctaLink) return;
    if (slide.planet) {
      onFilterPlanet(slide.planet);
    } else if (slide.ctaLink.startsWith('#')) {
      const targetId = slide.ctaLink.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = slide.ctaLink;
      }
    } else {
      onFilterPlanet(slide.ctaLink);
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-300 group/banner",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Container */}
      <div 
        className={cn(
          "relative min-h-[320px] sm:min-h-[360px] md:min-h-[380px] p-6 sm:p-10 md:p-12 flex flex-col justify-center text-white overflow-hidden transition-all duration-700 ease-out",
          slide.bgGradient || 'from-[#016ba5] via-[#0284c7] to-[#0369a1]'
        )}
      >
        {/* VIDEO SLIDE BACKGROUND: Automatically repeating, muted background loop */}
        {slide.type === 'video' && slide.mediaUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <video
              ref={videoRef}
              key={slide.mediaUrl}
              src={slide.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.75] contrast-[1.05] transition-transform duration-1000 ease-out"
            />
            {/* Atmospheric Gradient Vignette & Dark Tint for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 dark:from-black/90 dark:via-black/75 dark:to-black/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60" />
          </div>
        )}

        {/* IMAGE SLIDE BACKGROUND: High-resolution media with gradient blending */}
        {slide.type === 'image' && slide.mediaUrl && (
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <img
              key={slide.mediaUrl}
              src={slide.mediaUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent dark:from-black/90 dark:via-black/65 dark:to-black/30" />
          </div>
        )}

        {/* Subtle Ambient Decorative Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        {/* Slide Content Layer */}
        <div className="relative z-10 max-w-2xl">
          {/* Tag Pill & Slide Type Indicator */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {slide.tag && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-bold uppercase tracking-wider backdrop-blur-md border bg-white/20 text-white border-white/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{slide.tag}</span>
              </div>
            )}

            {/* Media Type Badge */}
            {slide.type === 'video' ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider backdrop-blur-md bg-emerald-500/25 text-emerald-300 border border-emerald-400/40">
                <Film className="w-3 h-3" />
                <span>Video Loop</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider backdrop-blur-md bg-sky-500/25 text-sky-200 border border-sky-400/30">
                <ImageIcon className="w-3 h-3" />
                <span>Photo Feature</span>
              </div>
            )}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold tracking-tight leading-tight mb-3 text-white drop-shadow-sm">
            {slide.title}
          </h2>

          {/* Subtitle / Description */}
          {slide.description && (
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-xl font-normal drop-shadow-sm">
              {slide.description}
            </p>
          )}

          {/* Actions & Planet Link */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-headline font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>{slide.ctaText || 'Explore Now'}</span>
              <ArrowRight className={cn(
                "w-4 h-4 text-slate-900 transition-transform",
                direction === 'rtl' ? 'rotate-180' : ''
              )} />
            </button>

            {/* Micro Badge for Planet / Quality */}
            {slide.planet && (
              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-xs">
                <IconComponent className="w-4 h-4 text-amber-300" />
                <span className="font-headline font-bold capitalize text-white">
                  {slide.planet} Planet
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Prev / Next Arrow Controls */}
        {totalSlides > 1 && (
          <div className={cn(
            "absolute bottom-6 flex items-center gap-2 z-20",
            direction === 'rtl' ? 'left-6' : 'right-6'
          )}>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-md"
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
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-all active:scale-90 hover:scale-105 cursor-pointer shadow-md"
            >
              {direction === 'rtl' ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          </div>
        )}

        {/* Carousel Indicator Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {banners.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm",
                  idx === activeIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceBannerCarousel;
