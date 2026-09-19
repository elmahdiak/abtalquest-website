import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  Truck, 
  RotateCcw, 
  Package,
  Brain,
  Compass,
  Wrench,
  Heart as HeartIcon
} from 'lucide-react';
import { formatPrice, type Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onSelectRelatedProduct: (product: Product) => void;
}

export const MarketplaceProductDetailModal: React.FC<MarketplaceProductDetailModalProps> = ({
  product,
  allProducts,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectRelatedProduct,
}) => {
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedImageTab, setSelectedImageTab] = useState<number>(0);
  const [justAdded, setJustAdded] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'package' | 'skills' | 'safety' | 'reviews'>('about');

  // Reset modal state when product changes
  useEffect(() => {
    if (product) {
      const timer = setTimeout(() => {
        setQuantity(1);
        setJustAdded(false);
        setSelectedImageTab(0);
        setActiveInfoTab('about');
        
        // Default variant selections
        if (product.variants && product.variants.length > 0) {
          const initialVariants: Record<string, string> = {};
          product.variants.forEach((v) => {
            if (v.options.length > 0) {
              initialVariants[v.id] = v.options[0];
            }
          });
          setSelectedVariants(initialVariants);
        } else {
          setSelectedVariants({});
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [product]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariants);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  // Gallery image views for immersion
  const galleryViews = [
    { title: 'Overview View', label: 'Overview' },
    { title: 'Hands-On Schematic', label: 'Schematic' },
    { title: 'In-The-Box Components', label: 'Components' },
    { title: 'Values Quest Pass', label: 'Quest Pass' },
  ];

  // Related products recommendation (exclude current, prefer same category)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ageGroup === product.ageGroup))
    .slice(0, 3);

  const totalPrice = formatPrice(product.price * quantity, language);
  const totalXp = product.xpBonus * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in-50 duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{product.planetName}</span>
            <span>/</span>
            <span>{product.productType}</span>
            {product.sku && (
              <>
                <span>/</span>
                <span className="font-mono text-slate-400">{product.sku}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWishlist(product)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-rose-500 text-rose-500")} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Main Hero View: Left Gallery / Right Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Col: Image & Gallery Views (5 cols) */}
            <div className="md:col-span-5 flex flex-col gap-3">
              <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-8 overflow-hidden shadow-inner group">
                {/* Glow backdrop */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{ backgroundColor: product.accentColor || '#016ba5' }}
                />

                <div className={cn(
                  "w-36 h-36 rounded-3xl flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-105",
                  product.iconBg || 'bg-blue-600 text-white'
                )}>
                  {product.category === 'thinkers' && <Brain className="w-20 h-20 stroke-[1.5]" />}
                  {product.category === 'brave' && <Compass className="w-20 h-20 stroke-[1.5]" />}
                  {product.category === 'solvers' && <Wrench className="w-20 h-20 stroke-[1.5]" />}
                  {product.category === 'heart' && <HeartIcon className="w-20 h-20 stroke-[1.5]" />}
                </div>

                {/* Badges on preview */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  {product.isBestSeller && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400 text-amber-950 shadow-sm">
                      {t('marketplace.badge_bestseller')}
                    </span>
                  )}
                  {product.discountPercent && product.discountPercent > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500 text-white shadow-sm">
                      {t('marketplace.badge_discount', { percent: product.discountPercent })}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md">
                    {galleryViews[selectedImageTab]?.title || product.title}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              <div className="grid grid-cols-4 gap-2">
                {galleryViews.map((thumb, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageTab(idx)}
                    className={cn(
                      "p-2 rounded-2xl border text-center text-[10px] font-bold transition-all cursor-pointer",
                      selectedImageTab === idx
                        ? "border-[#016ba5] bg-[#016ba5]/10 text-[#016ba5] dark:border-[#0284c7] dark:bg-[#0284c7]/20 dark:text-[#0284c7]"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <div className="w-4 h-4 rounded mx-auto mb-1 bg-current opacity-30" />
                    <span className="truncate block">{thumb.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Product Info & Purchase Form (7 cols) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Title & Age Label */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {product.ageLabel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {t('marketplace.detail_non_toxic')}
                  </span>
                </div>

                <h2 className="font-headline font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight mb-3">
                  {product.title}
                </h2>

                {/* Rating row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {t('marketplace.detail_verified_reviews', { count: product.reviewsCount })}
                  </span>
                </div>

                {/* Price and XP Highlight */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between mb-5">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {formatPrice(product.price, language)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatPrice(product.originalPrice, language)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t('marketplace.detail_free_shipping_hint')}</span>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black bg-[#fa8221]/15 text-[#fa8221]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>+{product.xpBonus} XP</span>
                    </span>
                  </div>
                </div>

                {/* Interactive Variant Selectors */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {product.variants.map((v) => (
                      <div key={v.id}>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                          {v.name}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {v.options.map((opt) => {
                            const isSelected = selectedVariants[v.id] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedVariants((prev) => ({ ...prev, [v.id]: opt }))}
                                className={cn(
                                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-95",
                                  isSelected
                                    ? "border-[#016ba5] bg-[#016ba5] text-white shadow-sm"
                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                )}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Modifier & CTAs */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t('marketplace.detail_quantity')}
                    </span>
                    
                    <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="px-4 text-sm font-extrabold text-slate-900 dark:text-white min-w-[36px] text-center">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-slate-500">
                      = {totalPrice} (+{totalXp} XP)
                    </div>
                  </div>

                  {/* Dual Buttons: Add to Cart & Wishlist */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={cn(
                        "flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-lg transition-all duration-200 active:scale-95 cursor-pointer",
                        justAdded
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-[#fa8221] hover:bg-[#e87313]"
                      )}
                    >
                      {justAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>{t('marketplace.detail_add_to_cart', { total: totalPrice })}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product)}
                      className={cn(
                        "p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center",
                        isWishlisted
                          ? "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      )}
                      title={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
                    >
                      <Heart className={cn("w-5 h-5", isWishlisted && "fill-rose-600 text-rose-600")} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Trust Guarantees Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t('marketplace.detail_trust_materials')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t('marketplace.detail_trust_screen_free')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#016ba5] shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t('marketplace.detail_trust_money_back')}
              </span>
            </div>
          </div>

          {/* Tabs Section: About, What's in Box, Skills Learned, Safety, Reviews */}
          <div>
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 mb-6">
              {[
                { id: 'about', label: t('marketplace.detail_about') },
                { id: 'package', label: t('marketplace.detail_package_includes') },
                { id: 'skills', label: t('marketplace.detail_skills_title') },
                { id: 'safety', label: t('marketplace.detail_safety_guarantee') },
                { id: 'reviews', label: t('marketplace.detail_feedback_title') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveInfoTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                    activeInfoTab === tab.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeInfoTab === 'about' && (
              <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p className="font-semibold text-base text-slate-900 dark:text-white">
                  {product.shortDescription}
                </p>
                <p>{product.fullDescription}</p>

                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeInfoTab === 'package' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  t('marketplace.detail_package_item_1'),
                  t('marketplace.detail_package_item_2'),
                  t('marketplace.detail_package_item_3'),
                  t('marketplace.detail_package_item_4'),
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <Package className="w-4 h-4 text-[#fa8221] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {activeInfoTab === 'skills' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.skillsLearned.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      {skill.name}
                    </div>
                    <span className="inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#016ba5]/15 text-[#016ba5] dark:bg-[#016ba5]/30">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeInfoTab === 'safety' && (
              <div className="space-y-3">
                {product.safetyGuidelines.map((guide, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{guide}</span>
                  </div>
                ))}
              </div>
            )}

            {activeInfoTab === 'reviews' && (
              <div className="space-y-4">
                {product.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {rev.author}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {rev.role}
                        </span>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Products Recommendation ("You May Also Like") */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="mb-4">
                <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                  {t('marketplace.related_products_title')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('marketplace.related_products_desc')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct(rel)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#016ba5] dark:hover:border-[#0284c7] transition-all cursor-pointer bg-white dark:bg-slate-800/80 flex items-center gap-3 group"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm",
                      rel.iconBg || 'bg-blue-100 text-blue-700'
                    )}>
                      {rel.title.charAt(0)}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] transition-colors">
                        {rel.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatPrice(rel.price, language)}</span>
                        <span>•</span>
                        <span className="text-[#fa8221] font-semibold">+{rel.xpBonus} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
