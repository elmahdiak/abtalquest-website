import React, { useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  ArrowRight, 
  Truck 
} from 'lucide-react';
import { formatPrice, getProductDisplayImage, type Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { id: string; quantity: number }[];
  products: Product[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onSelectProduct: (product: Product) => void;
}

export const MarketplaceCartDrawer: React.FC<MarketplaceCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onSelectProduct,
}) => {
  const { t, direction, language } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build item details
  const cartItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as { id: string; quantity: number; product: Product }[];

  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const totalXp = cartItems.reduce((acc, curr) => acc + curr.product.xpBonus * curr.quantity, 0);

  // Free shipping threshold simulation (500 MAD)
  const freeShippingThreshold = 500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className={cn(
        "fixed inset-y-0 max-w-full flex z-50",
        direction === 'rtl' ? 'left-0' : 'right-0'
      )}>
        <div 
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {t('marketplace.cart_drawer_title', { count: totalItemsCount })}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Milestone Indicator */}
          <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {subtotal >= freeShippingThreshold
                    ? (language === 'ar' ? '🎉 لقد حصلت على توصيل مجاني!' : language === 'fr' ? '🎉 Livraison suivie gratuite débloquée !' : '🎉 You unlocked Free Tracked Delivery!')
                    : (language === 'ar'
                        ? `أضف ${formatPrice(freeShippingThreshold - subtotal, language)} للحصول على توصيل مجاني!`
                        : language === 'fr'
                        ? `Ajoutez ${formatPrice(freeShippingThreshold - subtotal, language)} pour la livraison gratuite !`
                        : `Add ${formatPrice(freeShippingThreshold - subtotal, language)} more for Free Tracked Delivery!`)}
                </span>
              </div>
              <span>{progressPercent}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map(({ id, quantity, product }) => (
                <div
                  key={id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 flex items-start gap-3.5 shadow-sm group"
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
                        onClick={() => onRemoveItem(id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                        {formatPrice(product.price * quantity, language)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({formatPrice(product.price, language)} ea)
                      </span>
                      <span className="text-[11px] font-bold text-[#fa8221]">
                        +{product.xpBonus * quantity} XP
                      </span>
                    </div>

                    {/* Quantity Modifiers */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 w-fit">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(id, -1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[28px] text-center">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(id, 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>

                <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-2">
                  {t('marketplace.cart_drawer_empty')}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs mx-auto">
                  {t('marketplace.cart_drawer_empty_desc')}
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fa8221] hover:bg-[#e87313] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <span>{t('marketplace.cart_drawer_browse')}</span>
                  <ArrowRight className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
                </button>
              </div>
            )}
          </div>

          {/* Drawer Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60 shrink-0 space-y-4">
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>{t('marketplace.cart_subtotal')}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(subtotal, language)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>{t('marketplace.checkout_delivery')}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{t('marketplace.checkout_free')}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>{t('marketplace.checkout_total_due')}</span>
                  <span className="text-base">{formatPrice(subtotal, language)}</span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#fa8221]">
                  <span>{t('marketplace.checkout_xp_to_unlock')}</span>
                  <span>+{totalXp} XP</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-bold text-sm shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <span>{t('marketplace.cart_checkout_btn')}</span>
                <ArrowRight className={cn("w-4 h-4", direction === 'rtl' && 'rotate-180')} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('marketplace.cart_free_shipping')}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
