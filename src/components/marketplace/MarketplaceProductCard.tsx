import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Eye, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  AlertCircle,
  Brain,
  Compass,
  Wrench,
  Heart as HeartIcon
} from 'lucide-react';
import { formatPrice, type Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  isInCart?: boolean;
}

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isInCart = false,
}) => {
  const { t, language } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImage = (product.images && product.images.length > 0 && product.images[0]) || product.imageUrl || product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-800/90 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Visual Top Preview Container */}
      <div className="relative w-full pt-[65%] sm:pt-[70%] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        
        {/* Soft radial glow with planet's accent color */}
        <div 
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300"
          style={{ backgroundColor: product.accentColor || '#016ba5' }}
        />

        {/* Product Image preview */}
        {displayImage && !imageError && (
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Soft vignette overlay on image for contrast with badges */}
        {displayImage && !imageError && imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />
        )}

        {/* Central Graphic / Icon Symbol (Shown as fallback or while loading) */}
        {(!displayImage || imageError || !imageLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 md:p-6 transition-transform duration-300 group-hover:scale-105">
            <div className={cn(
              "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg transition-transform",
              product.iconBg || 'bg-blue-600 text-white'
            )}>
              {product.category === 'thinkers' && <Brain className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />}
              {product.category === 'brave' && <Compass className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />}
              {product.category === 'solvers' && <Wrench className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />}
              {product.category === 'heart' && <HeartIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />}
              {!['thinkers', 'brave', 'solvers', 'heart'].includes(product.category) && (
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 stroke-[1.75]" />
              )}
            </div>
          </div>
        )}

        {/* Top Badges (Bestseller, New, Discount) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-sm">
              {t('marketplace.badge_bestseller')}
            </span>
          )}

          {product.isNew && (
            <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
              {t('marketplace.badge_new_item')}
            </span>
          )}

          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
              {t('marketplace.badge_discount', { percent: product.discountPercent })}
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm sm:shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
        >
          <Heart className={cn(
            "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors",
            isWishlisted && "fill-rose-500 text-rose-500"
          )} />
        </button>

        {/* Format Pill Bottom-Left */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 z-10">
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
            {product.productType}
          </span>
        </div>

        {/* Age Group Pill Bottom-Right */}
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 z-10">
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-semibold bg-slate-900/80 text-white shadow-sm backdrop-blur-sm">
            {product.ageLabel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1">
        {/* SKU & Planet Label */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
          <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[90px] sm:max-w-none">
            {product.planetName}
          </span>
          {product.sku && (
            <span className="font-mono text-[9px] sm:text-[10px] text-slate-400 hidden xs:inline-block">
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-headline font-bold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white leading-tight sm:leading-snug mb-1.5 sm:mb-2 group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] transition-colors line-clamp-2">
          {product.title}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Short description - hidden on mobile for compact card height */}
        <p className="hidden sm:block text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 md:mb-4 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        {/* Stock status indicator */}
        <div className="mb-2 sm:mb-3">
          {product.inStock ? (
            product.stockCount && product.stockCount < 10 ? (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 truncate">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span className="truncate">{t('marketplace.low_stock_label', { count: product.stockCount })}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate">
                <Check className="w-3 h-3 shrink-0" />
                <span className="truncate">{t('marketplace.in_stock_label', { count: product.stockCount || 15 })}</span>
              </span>
            )
          ) : (
            <span className="text-[10px] sm:text-xs font-semibold text-rose-500">
              {t('marketplace.out_of_stock_label')}
            </span>
          )}
        </div>

        {/* Price & XP row */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between mb-2.5 sm:mb-4 gap-1">
          <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="text-sm sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {formatPrice(product.price, language)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through truncate hidden xs:inline">
                {formatPrice(product.originalPrice, language)}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold bg-[#fa8221]/10 text-[#fa8221] dark:bg-[#fa8221]/20 shrink-0">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#fa8221]" />
            <span>+{product.xpBonus} XP</span>
          </div>
        </div>

        {/* Actions row: Quick View & Add to Cart */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-full inline-flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer min-h-[34px] sm:min-h-[38px]"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">{t('marketplace.btn_quick_view')}</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 sm:px-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer text-white min-h-[34px] sm:min-h-[38px]",
              justAdded
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#fa8221] hover:bg-[#e87313]"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Added!</span>
              </>
            ) : isInCart ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">{t('marketplace.add_btn')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
