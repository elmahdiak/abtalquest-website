import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, 
  Compass, 
  Wrench, 
  Heart as HeartIcon, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Cpu, 
  PackageCheck, 
  Award,
  Eye
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceImageGalleryProps {
  product: Product;
  className?: string;
}

export interface GallerySlide {
  id: string;
  title: string;
  subtitle: string;
  type: 'overview' | 'schematic' | 'components' | 'quest_pass' | 'inaction';
  tag: string;
}

export const MarketplaceImageGallery: React.FC<MarketplaceImageGalleryProps> = ({
  product,
  className,
}) => {
  const { t, direction } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const slides: GallerySlide[] = [
    {
      id: 'overview',
      title: `${product.title} • Explorer Kit`,
      subtitle: 'Complete Physical Package & Screen-Free Hardware',
      type: 'overview',
      tag: 'Full Kit',
    },
    {
      id: 'schematic',
      title: 'Blueprint & Hands-On Schematic',
      subtitle: 'Precision Physical Engineering & Safe Materials',
      type: 'schematic',
      tag: 'Schematic',
    },
    {
      id: 'components',
      title: 'What\'s Inside the Box',
      subtitle: 'All Physical Components, Wooden Tokens & Cards',
      type: 'components',
      tag: 'Components',
    },
    {
      id: 'quest_pass',
      title: 'Values Quest Pass & XP Voucher',
      subtitle: 'Gamified Collectible Character Progression Token',
      type: 'quest_pass',
      tag: 'Quest Pass',
    },
    {
      id: 'inaction',
      title: 'Real-World Family Questing',
      subtitle: '100% Screen-Free Collaborative Play',
      type: 'inaction',
      tag: 'Family Play',
    },
  ];

  // Reset active slide when product changes
  const [prevProductId, setPrevProductId] = useState(product.id);
  if (product.id !== prevProductId) {
    setPrevProductId(product.id);
    setActiveIndex(0);
  }

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  }, [slides.length]);

  // Handle keyboard arrow navigation
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

  const currentSlide = slides[activeIndex] || slides[0];

  const renderProductIcon = (sizeClass = "w-28 h-28") => {
    switch (product.category) {
      case 'thinkers':
        return <Brain className={cn(sizeClass, "stroke-[1.5]")} />;
      case 'brave':
        return <Compass className={cn(sizeClass, "stroke-[1.5]")} />;
      case 'solvers':
        return <Wrench className={cn(sizeClass, "stroke-[1.5]")} />;
      case 'heart':
      default:
        return <HeartIcon className={cn(sizeClass, "stroke-[1.5]")} />;
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      
      {/* 1. Main Preview Viewport */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-[#0B1E33] dark:via-[#071727] dark:to-[#040D18] border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-6 sm:p-10 overflow-hidden shadow-inner group select-none">
        
        {/* Glow ambient background based on product accent color */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-30 blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: product.accentColor || '#016ba5' }}
        />

        {/* Dynamic Viewport Canvas */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center transition-all duration-300">
          
          {/* VIEW 1: OVERVIEW HERO */}
          {currentSlide.type === 'overview' && (
            <div className="flex flex-col items-center justify-center gap-4 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className={cn(
                "w-36 h-36 sm:w-44 sm:h-44 rounded-3xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105",
                product.iconBg || 'bg-blue-600 text-white'
              )}>
                {renderProductIcon("w-20 h-20 sm:w-24 sm:h-24")}
              </div>

              <div className="max-w-xs">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md">
                  {product.planetName} • {product.productType}
                </span>
              </div>
            </div>
          )}

          {/* VIEW 2: SCHEMATIC BLUEPRINT */}
          {currentSlide.type === 'schematic' && (
            <div className="w-full h-full p-4 rounded-2xl border border-dashed border-[#016ba5]/40 dark:border-[#38bdf8]/40 bg-[#016ba5]/5 dark:bg-[#38bdf8]/5 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#016ba5] dark:text-[#38bdf8] font-bold">
                  SCHEMATIC // {product.sku || 'AQ-SPEC-01'}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                  EN71 SAFE
                </span>
              </div>

              <div className="my-auto flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#016ba5] dark:text-[#38bdf8]">
                  <Cpu className="w-12 h-12 stroke-[1.5]" />
                </div>
                <p className="text-xs font-headline font-bold text-slate-700 dark:text-slate-200 text-center">
                  Precision Beechwood & Organic Non-Toxic Inks
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>SCALE: 1:1</span>
                  <span>•</span>
                  <span>DROP-TESTED</span>
                  <span>•</span>
                  <span>0% PLASTIC WASTE</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex justify-between">
                <span>ABTALQUEST CORE LABS</span>
                <span>ISO 8124 COMPLIANT</span>
              </div>
            </div>
          )}

          {/* VIEW 3: IN-THE-BOX COMPONENTS */}
          {currentSlide.type === 'components' && (
            <div className="w-full h-full p-3 rounded-2xl flex flex-col justify-between animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-2">
                <span className="text-xs font-headline font-bold text-slate-800 dark:text-slate-200">
                  Kit Inventory & Physical Artifacts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 my-auto">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 shadow-sm">
                  <PackageCheck className="w-5 h-5 text-[#fa8221] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Quest Codex Book</p>
                    <span className="text-[10px] text-slate-400">48 Illustrated Pages</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 shadow-sm">
                  <Layers className="w-5 h-5 text-[#016ba5] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Hands-On Modules</p>
                    <span className="text-[10px] text-slate-400">Tactile Wooden Parts</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 shadow-sm">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Hero Badges & Cards</p>
                    <span className="text-[10px] text-slate-400">5 Metal Finish Badges</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Parent Guide</p>
                    <span className="text-[10px] text-slate-400">Conversation Prompts</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                All parts certified 100% child-safe and recyclable packaging
              </p>
            </div>
          )}

          {/* VIEW 4: VALUES QUEST PASS */}
          {currentSlide.type === 'quest_pass' && (
            <div className="w-full max-w-sm p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-[#016ba5]/10 border-2 border-dashed border-amber-400/50 dark:border-amber-400/30 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-lg font-black text-xl">
                ★
              </div>
              <div>
                <h4 className="font-headline font-black text-base text-slate-900 dark:text-white">
                  Collectible Family Quest Pass
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                  Unlocks +{product.xpBonus} Character Development XP in the AbtalQuest Universe
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Permanent Family Achievement</span>
              </div>
            </div>
          )}

          {/* VIEW 5: IN-ACTION FAMILY QUESTING */}
          {currentSlide.type === 'inaction' && (
            <div className="w-full h-full p-4 rounded-2xl bg-slate-900/5 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                Screen-Free Collaborative Play
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs leading-relaxed">
                Designed for siblings and parents to explore moral choices, solve puzzles together, and build lasting offline memories.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500">
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">No Screens</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">Zero Commercial Ads</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800">Mindful Play</span>
              </div>
            </div>
          )}

        </div>

        {/* Top Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          {product.isBestSeller && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-md">
              {t('marketplace.badge_bestseller')}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-md">
              {t('marketplace.badge_discount', { percent: product.discountPercent })}
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
              {t('marketplace.badge_new')}
            </span>
          )}
        </div>

        {/* Zoom / Lightbox Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer z-20"
          title="Inspect full screen"
          aria-label="Inspect full screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows (Prev / Next) */}
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

        {/* Bottom Slide Info Tag */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 z-20 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 font-bold shadow-sm backdrop-blur-md">
            {currentSlide.title}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900/70 text-white font-mono text-[10px] backdrop-blur-md">
            {activeIndex + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* 2. Interactive Thumbnail Switcher Row */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {slides.map((slide, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative p-2.5 sm:p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 group",
                isSelected
                  ? "border-[#016ba5] dark:border-[#0284c7] bg-[#016ba5]/10 dark:bg-[#0284c7]/20 ring-2 ring-[#016ba5]/20 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              {/* Miniature Icon preview */}
              <div className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs transition-transform group-hover:scale-110",
                isSelected
                  ? "bg-[#016ba5] text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              )}>
                {slide.type === 'overview' && <Eye className="w-4 h-4" />}
                {slide.type === 'schematic' && <Cpu className="w-4 h-4" />}
                {slide.type === 'components' && <Layers className="w-4 h-4" />}
                {slide.type === 'quest_pass' && <Award className="w-4 h-4" />}
                {slide.type === 'inaction' && <ShieldCheck className="w-4 h-4" />}
              </div>

              <span className={cn(
                "text-[10px] sm:text-[11px] font-bold truncate block w-full",
                isSelected
                  ? "text-[#016ba5] dark:text-[#38bdf8]"
                  : "text-slate-600 dark:text-slate-400"
              )}>
                {slide.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 flex flex-col items-center justify-center"
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
                  {currentSlide.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentSlide.subtitle}
                </p>
              </div>

              <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300">
                {activeIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Main Lightbox Viewport */}
            <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 blur-3xl pointer-events-none"
                style={{ backgroundColor: product.accentColor || '#016ba5' }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
                <div className={cn(
                  "w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl",
                  product.iconBg || 'bg-blue-600 text-white'
                )}>
                  {renderProductIcon("w-20 h-20")}
                </div>
                <p className="text-sm font-bold text-slate-200 max-w-md">
                  {product.title} • {currentSlide.subtitle}
                </p>
              </div>

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
            </div>

            {/* Thumbnail Strip inside Lightbox */}
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                    activeIndex === idx
                      ? "bg-[#016ba5] text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  {slide.tag}
                </button>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplaceImageGallery;
