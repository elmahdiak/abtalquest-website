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
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Visual Top Preview Container */}
      <div className="relative w-full pt-[70%] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        
        {/* Soft radial glow with planet's accent color */}
        <div 
          className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity duration-300"
          style={{ backgroundColor: product.accentColor || '#016ba5' }}
        />

        {/* Central Graphic / Icon Symbol */}
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105">
          <div className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-lg transition-transform",
            product.iconBg || 'bg-blue-600 text-white'
          )}>
            {product.category === 'thinkers' && <Brain className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />}
            {product.category === 'brave' && <Compass className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />}
            {product.category === 'solvers' && <Wrench className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />}
            {product.category === 'heart' && <HeartIcon className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />}
          </div>
        </div>

        {/* Top Badges (Bestseller, New, Discount) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-sm">
              {t('marketplace.badge_bestseller')}
            </span>
          )}

          {product.isNew && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
              {t('marketplace.badge_new_item')}
            </span>
          )}

          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
              {t('marketplace.badge_discount', { percent: product.discountPercent })}
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
        >
          <Heart className={cn(
            "w-4 h-4 transition-colors",
            isWishlisted && "fill-rose-500 text-rose-500"
          )} />
        </button>

        {/* Format Pill Bottom-Left */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
            {product.productType}
          </span>
        </div>

        {/* Age Group Pill Bottom-Right */}
        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-900/80 text-white shadow-sm backdrop-blur-sm">
            {product.ageLabel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* SKU & Planet Label */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {product.planetName}
          </span>
          {product.sku && (
            <span className="font-mono text-[10px] text-slate-400">
              {product.sku}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] transition-colors line-clamp-2">
          {product.title}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-xs font-bold text-slate-800 dark:text-slate-200">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.shortDescription}
        </p>

        {/* Stock status indicator */}
        <div className="mb-4">
          {product.inStock ? (
            product.stockCount && product.stockCount < 10 ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3 h-3" />
                {t('marketplace.low_stock_label', { count: product.stockCount })}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="w-3 h-3" />
                {t('marketplace.in_stock_label', { count: product.stockCount || 15 })}
              </span>
            )
          ) : (
            <span className="text-xs font-semibold text-rose-500">
              {t('marketplace.out_of_stock_label')}
            </span>
          )}
        </div>

        {/* Price & XP row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formatPrice(product.price, language)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.originalPrice, language)}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fa8221]/10 text-[#fa8221] dark:bg-[#fa8221]/20">
            <Sparkles className="w-3 h-3 text-[#fa8221]" />
            <span>+{product.xpBonus} XP</span>
          </div>
        </div>

        {/* Actions row: Quick View & Add to Cart */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('marketplace.btn_quick_view')}</span>
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer text-white",
              justAdded
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-[#fa8221] hover:bg-[#e87313]"
            )}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Cart (+)</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('marketplace.add_btn')}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
