import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Heart, 
  Check, 
  Users
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { formatPrice, getProductDisplayImage } from '../../services/marketplaceService';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export interface WeeklyFeaturedKitsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  cartIds: string[];
}

export const WeeklyFeaturedKits: React.FC<WeeklyFeaturedKitsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  cartIds,
}) => {
  const { language } = useLanguage();

  // Find Explorer Mission Kit (or Brave planet flagship product)
  const explorerProduct: Product = products.find(
    (p) => p.id === 'prod-exp-mission' || p.title.toLowerCase().includes('explorer') || p.category === 'brave'
  ) || {
    id: 'prod-exp-mission',
    title: 'Explorer Mission Kit',
    category: 'brave',
    planetName: 'Brave Planet',
    productType: 'Physical Kit',
    ageGroup: '7-10',
    ageLabel: 'Ages 7–10',
    price: 299,
    originalPrice: 399,
    discountPercent: 25,
    inStock: true,
    stockCount: 18,
    isBestSeller: true,
    images: ['/hero-running.jpg'],
    imageUrl: '/hero-running.jpg',
    xpBonus: 450,
    rating: 4.9,
    reviewsCount: 68,
    shortDescription: 'Hands-on expedition tools, navigational trail guide, and offline missions that turn daily walks into bravery quests.',
    fullDescription: 'Made to complement the AbtalQuest journey. Children learn cardinal navigation, outdoor resilience, and nature observation with physical field equipment.',
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    accentColor: '#fa8221',
    tags: ['Made to complement the journey', 'Outdoor Missions', 'Physical Gear'],
    safetyGuidelines: ['Non-toxic certified child-safe materials', 'Breakaway lanyard'],
    skillsLearned: [{ name: 'Trail Navigation', level: 'Mastery' }, { name: 'Emotional Resilience', level: 'Advanced' }],
    reviews: [],
  };

  // Find Family Quest Kit (or Heart planet flagship cooperative game)
  const familyQuestProduct: Product = products.find(
    (p) => p.id === 'prod-fam-quest' || p.title.toLowerCase().includes('family') || p.category === 'heart'
  ) || {
    id: 'prod-fam-quest',
    title: 'Family Quest Kit',
    category: 'heart',
    planetName: 'Heart Planet',
    productType: 'Family Game',
    ageGroup: '7-10',
    ageLabel: 'Ages 7–10',
    price: 349,
    originalPrice: 449,
    discountPercent: 22,
    inStock: true,
    stockCount: 14,
    isBestSeller: true,
    images: ['/parent-crafting.jpg'],
    imageUrl: '/parent-crafting.jpg',
    xpBonus: 500,
    rating: 5.0,
    reviewsCount: 84,
    shortDescription: 'Cooperative tabletop board game and family challenge cards designed for screen-free evenings of mutual decision-making.',
    fullDescription: 'Made to complement the AbtalQuest journey. Strengthen family bonds through shared storytelling, collaborative problem solving, and values-driven challenges.',
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    accentColor: '#7C3AED',
    tags: ['Made to complement the journey', '100% Cooperative', 'Family Bonding'],
    safetyGuidelines: ['Natural wood tokens', 'Heavy recycled gameboard'],
    skillsLearned: [{ name: 'Family Cooperation', level: 'Mastery' }, { name: 'Empathic Decision Making', level: 'Mastery' }],
    reviews: [],
  };

  const featuredList = [
    {
      product: explorerProduct,
      requestedCount: 241,
      badge: 'MOST REQUESTED',
      badgeColor: 'bg-[#fa8221] text-white',
      accentBorder: 'hover:border-[#fa8221]',
      heroImage: '/hero-running.jpg',
      targetPrice: 299,
      targetOriginal: 399,
    },
    {
      product: familyQuestProduct,
      requestedCount: 188,
      badge: 'FAMILY FAVORITE',
      badgeColor: 'bg-[#016ba5] text-white',
      accentBorder: 'hover:border-[#016ba5]',
      heroImage: '/parent-crafting.jpg',
      targetPrice: 349,
      targetOriginal: 449,
    },
  ];

  return (
    <section className="relative w-full rounded-3xl bg-gradient-to-b from-white via-sky-50/40 to-white dark:from-[#081B30] dark:via-[#06152B] dark:to-[#081B30] border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-400/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header matching PDF Reference Page 9 */}
      <div className="max-w-3xl mb-8 sm:mb-10 text-left rtl:text-right">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#016ba5]/10 dark:bg-[#016ba5]/20 text-[#016ba5] dark:text-[#38bdf8] text-xs font-black uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WEEKLY FEATURED KITS</span>
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2">
          Weekly Most Requested Kits
        </h2>
        <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
          Made to complement the journey. Prices and interest numbers come from families on our waiting list.
        </p>
      </div>

      {/* 2 Featured Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {featuredList.map(({ product, requestedCount, badge, badgeColor, accentBorder, heroImage, targetPrice, targetOriginal }) => {
          const displayImg = getProductDisplayImage(product) || heroImage;
          const isWishlisted = wishlistIds.includes(product.id);
          const isInCart = cartIds.includes(product.id);
          const effectivePrice = targetPrice || product.price;
          const effectiveOriginal = targetOriginal || product.originalPrice || Math.round(effectivePrice * 1.3);
          const discountPct = Math.round(((effectiveOriginal - effectivePrice) / effectiveOriginal) * 100);

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={cn(
                "group relative flex flex-col bg-white dark:bg-[#0c2238] rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-card-soft transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer",
                accentBorder
              )}
            >
              {/* Top Image & Floating Badges */}
              <div className="relative w-full h-56 sm:h-64 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                <img
                  src={displayImg}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-10">
                  <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm", badgeColor)}>
                    {badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur-sm flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#fa8221]" />
                    <span>{requestedCount} parents requested</span>
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-md border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all z-10 cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-rose-500 text-rose-500")} />
                </button>

                {/* Bottom Tagline & Age Pill */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                  <span className="font-semibold text-sky-200 text-xs truncate max-w-[200px]">
                    Made to complement the journey.
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900/80 backdrop-blur-md border border-white/20">
                    {product.ageLabel || 'Ages 7–10'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Planet & Rating */}
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-bold text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-wide">
                    {product.planetName}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-headline text-lg sm:text-xl font-bold text-[#0F2A4A] dark:text-white leading-snug mb-2 group-hover:text-[#016ba5] dark:group-hover:text-[#38bdf8] transition-colors">
                  {product.title}
                </h3>

                {/* Short description */}
                <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed flex-1">
                  {product.shortDescription}
                </p>

                {/* Pricing & Discount */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline text-xl sm:text-2xl font-black text-[#0F2A4A] dark:text-white">
                      {formatPrice(effectivePrice, language)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(effectiveOriginal, language)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      -{discountPct}%
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fa8221]/10 text-[#fa8221]">
                    <Sparkles className="w-3 h-3" />
                    <span>+{product.xpBonus || 400} XP</span>
                  </div>
                </div>

                {/* Actions: VIEW PRODUCT & ADD TO CART */}
                <div className="grid grid-cols-2 gap-2.5 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0F2A4A] dark:text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                  >
                    <span>VIEW PRODUCT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#fa8221] hover:bg-[#e87313] text-white text-xs font-bold uppercase tracking-wider shadow-cta transition-all active:scale-95 cursor-pointer"
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>IN CART</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyFeaturedKits;
