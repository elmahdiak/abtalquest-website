import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Puzzle, 
  Compass 
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { 
  loadCartFromSupabase, 
  syncCartToSupabase
} from '../../services/marketplaceService';

export interface MarketplacePreviewSectionProps {
  onExploreMarketplace?: () => void;
  onAddToCart?: (productId: string) => void;
}

interface PreviewProduct {
  id: string;
  title: string;
  category: 'books' | 'toys' | 'kits';
  categoryLabel: string;
  tag: string;
  priceFormatted: string;
  rating: number;
  reviewsCount: number;
  xpReward: number;
  icon: React.ReactNode;
  gradient: string;
  badgeBg: string;
}

export const MarketplacePreviewSection: React.FC<MarketplacePreviewSectionProps> = ({
  onExploreMarketplace,
  onAddToCart,
}) => {
  const { t, language } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'books' | 'toys' | 'kits'>('all');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const isRtl = language === 'ar';

  const previewProducts: PreviewProduct[] = [
    {
      id: 'prod-puzzle-book',
      title: t('marketplace.sample_book_title') || 'Adventure Puzzle Book',
      category: 'books',
      categoryLabel: t('marketplace.filter_books') || 'Books',
      tag: t('marketplace.sample_book_tag') || 'Critical Thinking',
      priceFormatted: isRtl ? '12.99 $' : '$12.99',
      rating: 4.9,
      reviewsCount: 142,
      xpReward: 350,
      icon: <BookOpen className="w-8 h-8 text-[#016ba5]" />,
      gradient: 'from-[#016ba5]/15 to-transparent',
      badgeBg: 'bg-[#016ba5]/10 text-[#016ba5]',
    },
    {
      id: 'prod-1',
      title: 'Astronomical Brass Sextant & Star Compass',
      category: 'toys',
      categoryLabel: t('marketplace.filter_toys') || 'Toys',
      tag: 'Navigation & Resilience',
      priceFormatted: isRtl ? '18.99 $' : '$18.99',
      rating: 4.8,
      reviewsCount: 98,
      xpReward: 400,
      icon: <Compass className="w-8 h-8 text-[#fa8221]" />,
      gradient: 'from-[#fa8221]/15 to-transparent',
      badgeBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    },
    {
      id: 'prod-2',
      title: 'Solvers Hydraulic Waterwheel Engineering Kit',
      category: 'kits',
      categoryLabel: t('marketplace.filter_kits') || 'Educational Kits',
      tag: 'STEM Problem-Solving',
      priceFormatted: isRtl ? '24.99 $' : '$24.99',
      rating: 5.0,
      reviewsCount: 215,
      xpReward: 500,
      icon: <Puzzle className="w-8 h-8 text-[#22C55E]" />,
      gradient: 'from-[#22C55E]/15 to-transparent',
      badgeBg: 'bg-[#22C55E]/10 text-[#16a34a]',
    },
  ];

  const filteredProducts = selectedFilter === 'all'
    ? previewProducts
    : previewProducts.filter(p => p.category === selectedFilter);

  const handleAddToCart = async (product: PreviewProduct) => {
    try {
      const currentCart = await loadCartFromSupabase();
      const newQty = (currentCart[product.id] || 0) + 1;
      currentCart[product.id] = newQty;

      await syncCartToSupabase(currentCart);

      window.dispatchEvent(
        new CustomEvent('abtalquest_cart_updated', { detail: currentCart })
      );

      setAddedItems(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [product.id]: false }));
      }, 2000);

      if (onAddToCart) onAddToCart(product.id);
    } catch (err) {
      console.error('Failed to add preview product to cart:', err);
    }
  };

  return (
    <section 
      id="marketplace-preview" 
      className="py-20 sm:py-28 bg-slate-50/70 dark:bg-[#0A2540]/60 relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <Badge variant="gamification" size="md" icon={<ShoppingBag className="w-4 h-4" />}>
            {t('marketplace.official_badge') || 'AbtalQuest Official Marketplace'}
          </Badge>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mt-4 mb-4">
            {t('marketplace.preview_title') || 'Marketplace Preview'}
          </h2>

          <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('marketplace.preview_subtitle') || "Cartoon-style educational products that complement your child's digital learning journey."}
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-7">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('marketplace.filter_all') || 'All Products'}
            </button>
            <button
              onClick={() => setSelectedFilter('books')}
              className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedFilter === 'books'
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('marketplace.filter_books') || 'Books'}
            </button>
            <button
              onClick={() => setSelectedFilter('toys')}
              className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedFilter === 'toys'
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('marketplace.filter_toys') || 'Toys'}
            </button>
            <button
              onClick={() => setSelectedFilter('kits')}
              className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                selectedFilter === 'kits'
                  ? 'bg-[#7C3AED] text-white shadow-md'
                  : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {t('marketplace.filter_kits') || 'Educational Kits'}
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredProducts.map((product) => {
            const isAdded = addedItems[product.id];

            return (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 sm:p-7 border-2 border-slate-200/80 dark:border-slate-700 hover:border-[#7C3AED]/40 dark:hover:border-[#7C3AED]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col justify-between overflow-hidden"
              >
                {/* Gradient banner */}
                <div className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b ${product.gradient} pointer-events-none rounded-t-3xl`} />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                    <span className="text-[11px] font-bold font-gamification text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-1 rounded-full">
                      +{product.xpReward} XP
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {product.categoryLabel}
                    </span>
                  </div>

                  {/* Illustrated Product Icon Area */}
                  <div className="relative mb-5 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-[#0A2540] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className={`w-16 h-16 rounded-2xl ${product.badgeBg} flex items-center justify-center shadow-inner`}>
                        {product.icon}
                      </div>
                    </div>
                  </div>

                  {/* Subtext / Skill Tag */}
                  <div className="text-center mb-2">
                    <span className="inline-block font-headline text-xs font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full mb-1">
                      {product.tag}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-headline text-lg sm:text-xl font-extrabold text-[#1E293B] dark:text-white text-center mb-3 group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Star Rating & Verified Parent Reviews */}
                  <div className="flex items-center justify-center gap-1.5 mb-5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-800 dark:text-slate-200 ml-1 mr-1">{product.rating}</span>
                    </div>
                    <span>•</span>
                    <span>({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Purple "Add to cart" Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-3 relative z-10">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-semibold block">
                      Price
                    </span>
                    <span className="font-headline font-black text-xl text-slate-900 dark:text-white">
                      {product.priceFormatted}
                    </span>
                  </div>

                  {/* Purple "Add to cart" Button (#7C3AED) */}
                  <Button
                    variant="gamification"
                    size="sm"
                    icon={isAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
                    onClick={() => handleAddToCart(product)}
                    className="bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white font-bold rounded-xl px-4 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    {isAdded ? 'Added! ✓' : (t('marketplace.btn_add_cart_purple') || 'Add to cart')}
                  </Button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA to explore the full marketplace */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            icon={<ArrowRight className="w-4 h-4 rtl-flip text-[#7C3AED]" />}
            iconPosition="right"
            onClick={onExploreMarketplace}
            className="rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-[#7C3AED] dark:hover:border-[#7C3AED] px-8 font-bold"
          >
            {t('marketplace.btn_explore_full') || 'Explore Full Marketplace ->'}
          </Button>
        </div>

      </div>
    </section>
  );
};

export default MarketplacePreviewSection;
