import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play,
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  Video
} from 'lucide-react';
import { 
  resolveProductImages, 
  getProductDisplayImage, 
  getYouTubeEmbedUrl, 
  type Product 
} from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceImageGalleryProps {
  product: Product;
  className?: string;
}

export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  tag: string;
  title: string;
}

export const MarketplaceImageGallery: React.FC<MarketplaceImageGalleryProps> = ({
  product,
  className,
}) => {
  const { t, direction } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // 1. Gather all actual uploaded images for this product (up to 6)
  const resolvedImages = resolveProductImages(product);

  // 2. Check for optional YouTube video link or embed code
  const videoEmbedUrl = getYouTubeEmbedUrl(product.videoUrl || (product as any).video_url);

  // 3. Assemble dynamic media items list
  const mediaItems: GalleryMediaItem[] = resolvedImages.map((imgUrl, idx) => ({
    id: `img-${idx}`,
    type: 'image',
    url: imgUrl,
    tag: idx === 0 ? 'Cover' : `Photo ${idx + 1}`,
    title: `${product.title} • Photo ${idx + 1}`,
  }));

  if (videoEmbedUrl) {
    mediaItems.push({
      id: 'video-main',
      type: 'video',
      url: videoEmbedUrl,
      tag: 'Video',
      title: `${product.title} • Video Demonstration`,
    });
  }

  // Fallback single display item if no image or video is present
  const singleFallbackImage = getProductDisplayImage(product);
  if (mediaItems.length === 0 && singleFallbackImage) {
    mediaItems.push({
      id: 'img-fallback',
      type: 'image',
      url: singleFallbackImage,
      tag: 'Cover',
      title: product.title,
    });
  }

  // Reset active slide when product changes
  const [prevProductId, setPrevProductId] = useState(product.id);
  if (product.id !== prevProductId) {
    setPrevProductId(product.id);
    setActiveIndex(0);
    setImageErrors({});
  }

  // Keep active index in bounds
  const totalCount = mediaItems.length;
  useEffect(() => {
    if (activeIndex >= totalCount && totalCount > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalCount]);

  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  }, [totalCount]);

  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    setActiveIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  }, [totalCount]);

  // Touch swipe gesture handling
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartXRef.current - touchEndX;
    const deltaY = touchStartYRef.current - touchEndY;
    const minSwipeDistance = 40;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        if (direction === 'rtl') handlePrev();
        else handleNext();
      } else {
        if (direction === 'rtl') handleNext();
        else handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowLeft') {
          if (direction === 'rtl') handleNext();
          else handlePrev();
        }
        if (e.key === 'ArrowRight') {
          if (direction === 'rtl') handlePrev();
          else handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, direction, handleNext, handlePrev]);

  const currentMedia = mediaItems[activeIndex] || mediaItems[0];

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      
      {/* 1. Main Preview Viewport */}
      <div 
        onTouchStart={currentMedia?.type === 'video' ? undefined : handleTouchStart}
        onTouchEnd={currentMedia?.type === 'video' ? undefined : handleTouchEnd}
        className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-inner group select-none touch-pan-y"
      >
        {/* Dynamic Viewport Canvas */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {currentMedia ? (
            currentMedia.type === 'video' ? (
              <div className="w-full h-full relative rounded-2xl overflow-hidden bg-black flex items-center justify-center z-10">
                <iframe
                  src={currentMedia.url}
                  title={currentMedia.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              !imageErrors[currentMedia.id] ? (
                <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                  <img
                    src={currentMedia.url}
                    alt={product.title}
                    onError={() => setImageErrors((prev) => ({ ...prev, [currentMedia.id]: true }))}
                    className="w-full h-full max-h-full max-w-full object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                    alt={product.title}
                    className="w-full h-full max-h-full max-w-full object-contain rounded-2xl"
                  />
                </div>
              )
            )
          ) : (
            <div className="flex items-center justify-center p-6 text-slate-400">
              <span className="text-sm font-semibold">{product.title}</span>
            </div>
          )}
        </div>

        {/* Top Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-md">
              {t('marketplace.badge_bestseller')}
            </span>
          )}
          {(() => {
            const computedDiscount = (product.originalPrice && product.originalPrice > product.price)
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : (product.discountPercent || 0);
            return computedDiscount > 0 ? (
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-md">
                {t('marketplace.badge_discount', { percent: computedDiscount })}
              </span>
            ) : null;
          })()}
          {product.isNew && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
              {t('marketplace.badge_new')}
            </span>
          )}
        </div>

        {/* Zoom / Lightbox Trigger Button */}
        {currentMedia && (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer z-20"
            title="Inspect full screen"
            aria-label="Inspect full screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Navigation Arrows (Only shown when there are multiple media items) */}
        {totalCount > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-all active:scale-90 cursor-pointer z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-all active:scale-90 cursor-pointer z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Slide Info Tag & Exact Dynamic Slide Count */}
        {totalCount > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 z-20 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 font-bold shadow-sm backdrop-blur-md">
              {currentMedia?.tag || 'Overview'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-white font-mono text-[10px] backdrop-blur-md">
              {activeIndex + 1} / {totalCount}
            </span>
          </div>
        )}
      </div>

      {/* 2. Interactive Thumbnail Switcher Row (Dynamic: exact number of uploaded items) */}
      {totalCount > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
          {mediaItems.map((item, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer shrink-0 p-0.5 group",
                  isSelected
                    ? "border-[#016ba5] dark:border-[#38bdf8] ring-2 ring-[#016ba5]/30 shadow-md scale-105"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-70 hover:opacity-100"
                )}
                aria-label={`View ${item.tag}`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center gap-1 shadow-inner">
                    <Play className="w-5 h-5 fill-white" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Video</span>
                  </div>
                ) : !imageErrors[item.id] ? (
                  <img src={item.url} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {idx + 1}
                  </div>
                )}

                {/* Badge Overlay */}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold backdrop-blur-xs">
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && currentMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-headline font-bold text-lg text-white">
                  {currentMedia.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {product.planetName} • {product.productType}
                </p>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {activeIndex + 1} / {totalCount}
              </span>
            </div>

            {/* Main Lightbox Viewport */}
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
                style={{ backgroundColor: product.accentColor || '#016ba5' }}
              />

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {currentMedia.type === 'video' ? (
                  <div className="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <iframe
                      src={currentMedia.url}
                      title={currentMedia.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={currentMedia.url}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                )}
              </div>

              {totalCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip inside Lightbox */}
            {totalCount > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
                {mediaItems.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5",
                      activeIndex === idx
                        ? "bg-[#016ba5] text-white"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    )}
                  >
                    {item.type === 'video' && <Video className="w-3.5 h-3.5 text-red-400" />}
                    <span>{item.tag}</span>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplaceImageGallery;
