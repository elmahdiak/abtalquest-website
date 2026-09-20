import React, { useEffect } from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight 
} from 'lucide-react';
import { formatPrice, getProductDisplayImage, type Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceWishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const MarketplaceWishlistDrawer: React.FC<MarketplaceWishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onMoveToCart,
  onSelectProduct,
}) => {
  const { t, direction, language } = useLanguage();

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      <div className={cn(
        "fixed inset-y-0 max-w-full flex z-50",
        direction === 'rtl' ? 'left-0' : 'right-0'
      )}>
        <div 
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {t('marketplace.wishlist_title', { count: wishlistedProducts.length })}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length > 0 ? (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-white dark:bg-slate-800/60 flex items-start gap-3.5 group shadow-sm"
                >
                  {/* Thumbnail */}
                  {(() => {
                    const itemImage = getProductDisplayImage(product);
                    return (
                      <div
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className={cn(
                          "w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-base shrink-0 shadow-inner border border-slate-200/80 dark:border-slate-700/80 cursor-pointer transition-transform group-hover:scale-105",
                          !itemImage && (product.iconBg || 'bg-blue-100 text-blue-700')
                        )}
                      >
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          product.title.charAt(0)
                        )}
                      </div>
                    );
                  })()}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-bold text-slate-400 truncate">
                        {product.planetName}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md cursor-pointer"
                        title={t('marketplace.btn_remove_wishlist')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-[#016ba5] dark:hover:text-[#0284c7] transition-colors"
                    >
                      {product.title}
                    </h4>

                    <div className="flex items-baseline gap-2 mt-1 mb-3">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {formatPrice(product.price, language)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.originalPrice, language)}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-[#fa8221]">
                        +{product.xpBonus} XP
                      </span>
                    </div>

                    {/* Move to Cart CTA */}
                    <button
                      type="button"
                      onClick={() => onMoveToCart(product)}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#fa8221] hover:bg-[#e87313] text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('marketplace.btn_move_to_cart')}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>

                <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-2">
                  {t('marketplace.wishlist_empty')}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs mx-auto">
                  {t('marketplace.wishlist_empty_desc')}
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>{t('marketplace.cart_drawer_browse')}</span>
                  <ArrowRight className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-center text-xs text-slate-500">
              <span>{wishlistedProducts.length} items saved in your family wishlist</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
