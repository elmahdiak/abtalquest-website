import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Share2, 
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
  ChevronRight
} from 'lucide-react';
import { formatPrice, type Product } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import MarketplaceImageGallery from './MarketplaceImageGallery';

export interface MarketplaceProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBackToMarketplace: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants?: Record<string, string>) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const MarketplaceProductDetailPage: React.FC<MarketplaceProductDetailPageProps> = ({
  product,
  allProducts,
  onBackToMarketplace,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { t, direction, language } = useLanguage();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'package' | 'skills' | 'safety' | 'reviews'>('about');

  // Reset page state when product changes
  const [prevProductId, setPrevProductId] = useState(product.id);
  if (product.id !== prevProductId) {
    setPrevProductId(product.id);
    setQuantity(1);
    setJustAdded(false);
    setActiveInfoTab('about');
    if (product.variants && product.variants.length > 0) {
      const initial: Record<string, string> = {};
      product.variants.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.id] = v.options[0];
        }
      });
      setSelectedVariants(initial);
    } else {
      setSelectedVariants({});
    }
  }

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Handle ESC key to return to catalog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBackToMarketplace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBackToMarketplace]);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariants);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2400);
      }
    } catch {
      // Fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  // Related products recommendation (prefer same planet or age group, exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ageGroup === product.ageGroup))
    .slice(0, 3);

  const totalPrice = formatPrice(product.price * quantity, language);
  const totalXp = product.xpBonus * quantity;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Breadcrumbs Bar & Return Button */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Left: Breadcrumbs Trail */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToMarketplace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
            <span>{t('marketplace.nav_all_categories')}</span>
          </button>

          <ChevronRight className={cn("w-3.5 h-3.5 text-slate-400", direction === 'rtl' && 'rotate-180')} />
          <span className="text-slate-600 dark:text-slate-300 font-bold">{product.planetName}</span>
          
          <ChevronRight className={cn("w-3.5 h-3.5 text-slate-400", direction === 'rtl' && 'rotate-180')} />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        {/* Right: SKU & Share Link */}
        <div className="flex items-center gap-2">
          {product.sku && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-500 dark:text-slate-400 font-bold">
              SKU: {product.sku}
            </span>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Share this product link"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8]" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* 2. Hero 2-Column Product Experience */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Interactive Image Gallery & Guarantees (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <MarketplaceImageGallery product={product} />

          {/* Value and Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">EN71 Certified</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">100% Non-Toxic & Tested</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">Zero Screen Time</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Hands-On Discovery</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#016ba5] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <strong className="block font-bold text-slate-900 dark:text-white">30-Day Guarantee</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">Easy Family Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky E-Commerce Buy-Box (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            
            {/* Top Metadata: Planet, Age & Stock Status */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#016ba5]/10 dark:bg-[#016ba5]/20 text-[#016ba5] dark:text-[#38bdf8]">
                  {product.planetName}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {product.ageLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {t('marketplace.detail_non_toxic')}
                </span>
              </div>

              <h1 className="font-headline font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 font-bold text-slate-900 dark:text-white">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {t('marketplace.detail_verified_reviews', { count: product.reviewsCount })}
                </span>
              </div>
            </div>

            {/* Price Box & XP Award Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    {formatPrice(product.price, language)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice, language)}
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t('marketplace.detail_free_shipping_hint')}</span>
                </div>
              </div>

              <div className="text-end">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#fa8221]/15 text-[#fa8221]">
                  <Sparkles className="w-4 h-4 text-[#fa8221]" />
                  <span>+{product.xpBonus} XP</span>
                </span>
              </div>
            </div>

            {/* Stock Level Banner */}
            <div className="text-xs font-semibold flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Availability:</span>
              {product.inStock !== false ? (
                product.stockCount && product.stockCount < 5 ? (
                  <span className="text-amber-600 font-bold">
                    {t('marketplace.low_stock_label', { count: product.stockCount })}
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {t('marketplace.in_stock_label', { count: product.stockCount || 15 })}
                  </span>
                )
              ) : (
                <span className="text-rose-500 font-bold">
                  {t('marketplace.out_of_stock_label')}
                </span>
              )}
            </div>

            {/* Interactive Variant Selectors */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                {product.variants.map((v) => (
                  <div key={v.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        {v.name}
                      </span>
                      <span className="text-xs font-bold text-[#016ba5] dark:text-[#38bdf8]">
                        {selectedVariants[v.id]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {v.options.map((opt) => {
                        const isSelected = selectedVariants[v.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setSelectedVariants((prev) => ({ ...prev, [v.id]: opt }))}
                            className={cn(
                              "p-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer active:scale-95",
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

            {/* Quantity Stepper & Calculation */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t('marketplace.detail_quantity')}
                </span>

                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-40 cursor-pointer"
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
                    className="p-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>Total Due:</span>
                <span className="text-slate-900 dark:text-white font-extrabold">
                  = {totalPrice} (+{totalXp} XP)
                </span>
              </div>
            </div>

            {/* Dual CTA: Add to Cart & Wishlist */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-white shadow-xl transition-all duration-200 active:scale-95 cursor-pointer",
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
                  "p-4 rounded-2xl border transition-all cursor-pointer active:scale-95 flex items-center justify-center",
                  isWishlisted
                    ? "border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                )}
                title={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
                aria-label={isWishlisted ? t('marketplace.btn_remove_wishlist') : t('marketplace.btn_add_to_wishlist')}
              >
                <Heart className={cn("w-6 h-6", isWishlisted && "fill-rose-600 text-rose-600")} />
              </button>
            </div>

            {/* Fast Tracked Delivery Guarantee */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#016ba5] shrink-0" />
              <span>Fast 24–48h tracked courier delivery across all Moroccan cities.</span>
            </div>

          </div>
        </div>

      </section>

      {/* 3. Deep-Dive Product Information Tabs */}
      <section className="pt-6 border-t border-slate-200 dark:border-slate-800">
        
        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-3 mb-8">
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
                "px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer",
                activeInfoTab === tab.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: About the Quest */}
        {activeInfoTab === 'about' && (
          <div className="space-y-6 max-w-4xl text-slate-700 dark:text-slate-300 leading-relaxed animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                Educational Creed & Purpose
              </h3>
              <p className="font-medium text-base text-slate-800 dark:text-slate-200">
                {product.shortDescription}
              </p>
              <p className="text-sm">
                {product.fullDescription}
              </p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-slate-500">Categories:</span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: What's in the Box */}
        {activeInfoTab === 'package' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl animate-in fade-in duration-200">
            {[
              t('marketplace.detail_package_item_1'),
              t('marketplace.detail_package_item_2'),
              t('marketplace.detail_package_item_3'),
              t('marketplace.detail_package_item_4'),
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5 text-sm font-medium text-slate-800 dark:text-slate-200"
              >
                <Package className="w-5 h-5 text-[#fa8221] shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Skills & Character Development */}
        {activeInfoTab === 'skills' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl animate-in fade-in duration-200">
            {product.skillsLearned.map((skill, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3 shadow-sm"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {skill.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrated screen-free cognitive practice
                  </p>
                </div>
                <span className="self-start px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#016ba5]/15 text-[#016ba5] dark:bg-[#016ba5]/30">
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Safety & Certifications */}
        {activeInfoTab === 'safety' && (
          <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 mb-4">
              <h4 className="font-headline font-bold text-base text-emerald-900 dark:text-emerald-200 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Certified Child Safety Standards</span>
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                All physical learning kits undergo rigorous chemical, drop, and flammability testing before being approved for family and school use.
              </p>
            </div>

            <div className="space-y-3">
              {product.safetyGuidelines.map((guide, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Parent & Educator Feedback */}
        {activeInfoTab === 'reviews' && (
          <div className="space-y-4 max-w-4xl animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">
                        {rev.author}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
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
          </div>
        )}

      </section>

      {/* 4. "You May Also Like" Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="mb-6">
            <h3 className="font-headline font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
              {t('marketplace.related_products_title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('marketplace.related_products_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-[#016ba5] dark:hover:border-[#0284c7] transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-md flex items-center gap-4 group"
              >
                {(() => {
                  const relImg = (rel.images && rel.images.length > 0 && rel.images[0]) || rel.imageUrl || rel.image;
                  return (
                    <div className={cn(
                      "w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shrink-0 font-bold text-lg shadow-sm border border-slate-200/80 dark:border-slate-800 transition-transform duration-300 group-hover:scale-105",
                      !relImg && (rel.iconBg || 'bg-blue-100 text-blue-700')
                    )}>
                      {relImg ? (
                        <img
                          src={relImg}
                          alt={rel.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        rel.title.charAt(0)
                      )}
                    </div>
                  );
                })()}
                
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#016ba5] dark:text-[#38bdf8] block truncate">
                    {rel.planetName}
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] transition-colors">
                    {rel.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-black text-slate-900 dark:text-white">
                      {formatPrice(rel.price, language)}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[#fa8221] font-bold text-[11px]">
                      +{rel.xpBonus} XP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default MarketplaceProductDetailPage;
