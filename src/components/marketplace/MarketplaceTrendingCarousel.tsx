import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Flame, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { type Product } from '../../services/marketplaceService';
import { MarketplaceProductCard } from './MarketplaceProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceTrendingCarouselProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  cart: { id: string; quantity: number }[];
  className?: string;
}

export const MarketplaceTrendingCarousel: React.FC<MarketplaceTrendingCarouselProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  cart,
  className,
}) => {
  const { t, language } = useLanguage();
  const isRtl = language === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update arrow button disabled states based on scroll position
  const checkScrollBoundaries = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (isRtl) {
      // In RTL, some browsers use negative scrollLeft values, others start at 0 or maxScroll
      const currentScroll = Math.abs(scrollLeft);
      setCanScrollLeft(currentScroll < maxScroll - 8);
      setCanScrollRight(currentScroll > 8);
    } else {
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft < maxScroll - 8);
    }
  }, [isRtl]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollBoundaries();

    const handleScroll = () => {
      checkScrollBoundaries();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScrollBoundaries, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollBoundaries);
    };
  }, [checkScrollBoundaries, products.length]);

  // Smooth scroll by ~1 card width on navigation button click
  const scrollByAmount = (direction: 'prev' | 'next') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Sized to exactly 1 card + gap width
    const cardStep = el.clientWidth / 2.25;
    const scrollFactor = direction === 'next' ? 1 : -1;
    const rtlMultiplier = isRtl ? -1 : 1;

    el.scrollBy({
      left: scrollFactor * cardStep * rtlMultiplier,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      aria-label={t('marketplace.trending_title') || 'Trending Now'}
      className={cn(
        'relative bg-gradient-to-b from-amber-500/[0.04] via-transparent to-transparent dark:from-amber-500/[0.03] rounded-3xl p-3 sm:p-5 border border-amber-500/20 dark:border-amber-500/10 shadow-sm transition-all',
        className
      )}
    >
      {/* Header with Title, Badge, and Desktop Arrows */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-1">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 ring-4 ring-amber-500/10 shrink-0">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-white/30 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-heading font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{t('marketplace.trending_title') || 'Tendances du Moment'}</span>
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <TrendingUp className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{t('marketplace.trending_badge') || 'Top Ventes'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {t('marketplace.trending_subtitle') ||
                'Les kits et aventures les plus plébiscités par la communauté des petits héros'}
            </p>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons (Visible on desktop & tablet) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByAmount('prev')}
            disabled={isRtl ? !canScrollRight : !canScrollLeft}
            aria-label={t('marketplace.trending_scroll_left') || 'Scroll left'}
            className={cn(
              'w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer',
              'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95',
              (isRtl ? !canScrollRight : !canScrollLeft) &&
                'opacity-30 cursor-not-allowed hover:scale-100 hover:bg-white dark:hover:bg-slate-800'
            )}
          >
            <ChevronLeft className={cn('w-4 h-4 sm:w-5 sm:h-5', isRtl && 'rotate-180')} />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('next')}
            disabled={isRtl ? !canScrollLeft : !canScrollRight}
            aria-label={t('marketplace.trending_scroll_right') || 'Scroll right'}
            className={cn(
              'w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer',
              'border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-105 active:scale-95',
              (isRtl ? !canScrollLeft : !canScrollRight) &&
                'opacity-30 cursor-not-allowed hover:scale-100 hover:bg-white dark:hover:bg-slate-800'
            )}
          >
            <ChevronRight className={cn('w-4 h-4 sm:w-5 sm:h-5', isRtl && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Container with 2.25 Card Teaser Math */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          role="region"
          aria-label="Trending products horizontal list"
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-3 px-0.5 overscroll-x-contain focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, idx) => (
            <div
              key={product.id || idx}
              /* 
                Math for Teaser Effect:
                On mobile: gap is 12px (2 gaps = 24px). Width = calc((100% - 24px) / 2.25)
                On sm+:    gap is 16px (2 gaps = 32px). Width = calc((100% - 32px) / 2.25)
                This guarantees exactly 2 full cards are shown and the 3rd card is cut off with ~25% visible.
              */
              className="flex-none snap-start w-[calc((100%-24px)/2.25)] sm:w-[calc((100%-32px)/2.25)] select-none transition-transform"
            >
              <MarketplaceProductCard
                product={product}
                trendingRank={idx + 1}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                isInCart={cart.some((c) => c.id === product.id)}
              />
            </div>
          ))}
        </div>

        {/* Soft edge teaser fade gradient on the non-scrolled edge */}
        <div
          className={cn(
            'pointer-events-none absolute top-0 bottom-3 w-8 sm:w-14 z-10 transition-opacity duration-300',
            isRtl
              ? 'left-0 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent'
              : 'right-0 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent',
            (isRtl ? canScrollLeft : canScrollRight) ? 'opacity-90' : 'opacity-0'
          )}
        />
      </div>
    </section>
  );
};
