import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  ShoppingBag
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { formatPrice } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';

export interface FamilyBundleSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const FamilyBundleSection: React.FC<FamilyBundleSectionProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const { language } = useLanguage();
  const [bundleAdded, setBundleAdded] = useState(false);

  // Find 3 complementary items to compose the starter bundle
  const item1 = products.find((p) => p.category === 'brave' || p.title.toLowerCase().includes('explorer')) || products[0];
  const item2 = products.find((p) => p.category === 'heart' || p.title.toLowerCase().includes('caravan')) || products[1] || products[0];
  const item3 = products.find((p) => p.category === 'thinkers' || p.title.toLowerCase().includes('waterwheel') || p.productType?.toLowerCase().includes('book')) || products[2] || products[0];

  const bundleItems = [
    {
      product: item1,
      name: item1?.title || 'Explorer Mission Kit',
      type: 'Outdoor Quest Gear',
      image: '/hero-running.jpg',
      price: item1?.price || 299,
    },
    {
      product: item2,
      name: item2?.title || 'Family Quest Cooperative Game',
      type: 'Tabletop Family Game',
      image: '/parent-crafting.jpg',
      price: item2?.price || 349,
    },
    {
      product: item3,
      name: item3?.title || 'The Scribe of Wisdom Chronicle',
      type: 'Hardcover Storybook',
      image: '/blog-life-skills.jpg',
      price: item3?.price || 190,
    },
  ];

  const individualSum = bundleItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = 150;
  const bundlePrice = Math.max(299, individualSum - discountAmount);

  const handleAddBundle = () => {
    bundleItems.forEach((b) => {
      if (b.product) {
        onAddToCart(b.product);
      }
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <section className="relative w-full rounded-3xl bg-gradient-to-br from-amber-500/10 via-sky-500/5 to-purple-500/10 dark:from-slate-900 dark:via-[#091E3A] dark:to-slate-900 border border-amber-200/60 dark:border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
      {/* Decorative top badge matching PDF Page 10 */}
      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 relative z-10">
        
        {/* Left Side: Editorial & Item Cards Preview */}
        <div className="flex-1 text-left rtl:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fa8221]/15 text-[#fa8221] dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SPECIAL OFFER • SAVE 150 MAD</span>
          </div>

          <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-3">
            Family bundle, better together starter
          </h2>

          <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl">
            Combine complementary learning kits for the full screen-free growth experience. Give your children physical quests, cooperative game nights, and bedtime adventure stories.
          </p>

          {/* 3 Included Items in the Bundle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {bundleItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.product && onSelectProduct(item.product)}
                className="bg-white/90 dark:bg-slate-800/90 rounded-2xl p-3 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-[#fa8221] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#016ba5] dark:text-[#38bdf8] uppercase block truncate">
                      {item.type}
                    </span>
                    <h4 className="text-xs font-bold text-[#0F2A4A] dark:text-white truncate">
                      {item.name}
                    </h4>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span>Part {idx + 1}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formatPrice(item.price, language)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Free Morocco Delivery</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>+1,200 XP Family Bonus</span>
            </span>
          </div>
        </div>

        {/* Right Side: Price Box & CTA */}
        <div className="w-full lg:w-72 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-amber-300 dark:border-amber-600/50 shadow-card-soft flex flex-col items-center text-center shrink-0">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white mb-3">
            SAVE 150 MAD
          </span>

          <span className="text-xs text-slate-400 line-through mb-1">
            Regular: {formatPrice(individualSum, language)}
          </span>

          <div className="font-headline text-3xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white mb-2">
            {formatPrice(bundlePrice, language)}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Complete 3-Kit Family Starter Pack
          </p>

          <button
            type="button"
            onClick={handleAddBundle}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#fa8221] hover:bg-[#e87313] text-white text-xs font-black uppercase tracking-wider shadow-cta transition-all active:scale-95 cursor-pointer"
          >
            {bundleAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>BUNDLE ADDED!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>ADD ENTIRE BUNDLE</span>
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
};

export default FamilyBundleSection;
