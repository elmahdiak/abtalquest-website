import React from 'react';
import { 
  RotateCcw, 
  X, 
  SearchX,
  Users
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { formatAgeBracket } from '../../services/marketplaceService';
import { MarketplaceProductCard } from './MarketplaceProductCard';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceProductGridProps {
  products: Product[];
  isLoading: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'xp-desc';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'xp-desc') => void;
  activeFilters: {
    planet: string;
    age: string;
    type: string;
    search: string;
  };
  onClearFilter: (key: 'planet' | 'age' | 'type' | 'search' | 'all') => void;
  onSelectAge?: (age: string) => void;
  ageCounts?: Record<string, number>;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
  cartIds: string[];
}

export const MarketplaceProductGrid: React.FC<MarketplaceProductGridProps> = ({
  products,
  isLoading,
  sortBy,
  onSortChange,
  activeFilters,
  onClearFilter,
  onSelectAge,
  ageCounts,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  cartIds,
}) => {
  const { t, language } = useLanguage();

  const hasActiveFilters =
    activeFilters.planet !== 'all' ||
    activeFilters.age !== 'all' ||
    activeFilters.type !== 'all' ||
    activeFilters.search.trim().length > 0;

  const ageOptions = [
    { id: 'all', label: t('marketplace.age_all') || 'All Ages' },
    { id: '5-6', label: formatAgeBracket('5-6', language) },
    { id: '7-10', label: formatAgeBracket('7-10', language) },
    { id: '11-12', label: formatAgeBracket('11-12', language) },
    { id: '13+', label: formatAgeBracket('13+', language) },
  ];

  return (
    <section className="w-full">
      {/* Age Groups Filter Buttons Bar */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-1.5 text-xs font-headline font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
          <Users className="w-3.5 h-3.5 text-[#016ba5]" />
          <span>{t('marketplace.age_filter_label') || 'Age Groups:'}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {ageOptions.map((opt) => {
            const isActive =
              activeFilters.age === opt.id ||
              (opt.id === '13+' && (activeFilters.age === '+13' || activeFilters.age === '13+'));
            const count = ageCounts ? ageCounts[opt.id] : undefined;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectAge?.(opt.id)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shrink-0 cursor-pointer active:scale-95 select-none",
                  isActive
                    ? "bg-[#016ba5] text-white border-[#016ba5] shadow-sm ring-2 ring-[#016ba5]/20 font-extrabold"
                    : "bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 shadow-sm"
                )}
              >
                <span>{opt.label}</span>
                {count !== undefined && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Toolbar: Results Counter, Active Filter Chips, Age Dropdown & Sort Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Results Counter & Active Chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-headline text-sm sm:text-base font-black text-[#0F2A4A] dark:text-white uppercase tracking-tight">
            {activeFilters.planet !== 'all' 
              ? `${activeFilters.planet} kits (${products.length})`
              : `ALL learning kits (${products.length})`}
          </span>

          {/* Active Chips */}
          {activeFilters.planet !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#016ba5]/10 text-[#016ba5] dark:bg-[#016ba5]/20">
              <span>{activeFilters.planet}</span>
              <button
                type="button"
                onClick={() => onClearFilter('planet')}
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilters.age !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fa8221]/15 text-[#fa8221] dark:bg-[#fa8221]/25 dark:text-orange-400 border border-[#fa8221]/30 shadow-sm">
              <span>{formatAgeBracket(activeFilters.age, language)}</span>
              <button
                type="button"
                onClick={() => onClearFilter('age')}
                className="hover:text-red-500 cursor-pointer"
                aria-label="Remove age filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilters.type !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <span>{activeFilters.type}</span>
              <button
                type="button"
                onClick={() => onClearFilter('type')}
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilters.search.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span>&ldquo;{activeFilters.search}&rdquo;</span>
              <button
                type="button"
                onClick={() => onClearFilter('search')}
                className="hover:text-red-500 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onClearFilter('all')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('marketplace.reset_filters')}</span>
            </button>
          )}
        </div>

        {/* Dropdown Selectors: Age & Sort */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-2.5 self-end sm:self-auto">
          {/* Age selector dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="grid-age" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
              {t('marketplace.age_filter_label') || 'Age:'}
            </label>
            <div className="relative">
              <select
                id="grid-age"
                value={activeFilters.age}
                onChange={(e) => onSelectAge?.(e.target.value)}
                className="py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#016ba5] cursor-pointer shadow-sm"
              >
                <option value="all">{t('marketplace.age_all') || 'All Ages'}</option>
                <option value="5-6">5–6 yo</option>
                <option value="7-10">7–10 yo</option>
                <option value="11-12">11–12 yo</option>
                <option value="13+">+13 yo</option>
              </select>
            </div>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="grid-sort" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Sort:
            </label>
            <div className="relative">
              <select
                id="grid-sort"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="py-1.5 sm:py-2 px-2.5 sm:px-3 pr-7 sm:pr-8 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 outline-none focus:border-[#016ba5] cursor-pointer shadow-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="xp-desc">Most XP Bonus</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-700 p-2.5 sm:p-4 animate-pulse flex flex-col justify-between h-[280px] sm:h-[380px] md:h-[420px]"
            >
              <div className="w-full h-28 sm:h-40 md:h-48 bg-slate-200 dark:bg-slate-700 rounded-xl sm:rounded-2xl mb-2 sm:mb-4" />
              <div className="space-y-2 flex-1">
                <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                <div className="h-4 sm:h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded w-full hidden sm:block" />
              </div>
              <div className="h-8 sm:h-10 bg-slate-200 dark:bg-slate-700 rounded-lg sm:rounded-xl mt-3 sm:mt-4" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        /* Product Cards Grid: 2 cols on mobile, 3 on tablet, 4 on laptop, 5 on desktop */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => (
            <MarketplaceProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistIds.includes(product.id)}
              isInCart={cartIds.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SearchX className="w-8 h-8" />
          </div>

          <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white mb-2">
            {t('marketplace.no_results_title')}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t('marketplace.no_results_desc')}
          </p>

          <button
            type="button"
            onClick={() => onClearFilter('all')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#fa8221] hover:bg-[#e87313] text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('marketplace.reset_filters')}</span>
          </button>
        </div>
      )}
    </section>
  );
};
