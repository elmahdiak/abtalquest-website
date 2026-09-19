import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { formatPrice } from '../../services/marketplaceService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceHeaderProps {
  searchTerm: string;
  onSearchChange: (q: string) => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onOpenTaxonomy: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
  isLiveSupabase?: boolean;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  searchTerm,
  onSearchChange,
  products,
  onSelectProduct,
  onOpenTaxonomy,
  onOpenWishlist,
  wishlistCount,
  onOpenCart,
  cartCount,
  cartSubtotal,
  user,
  onOpenAuth,
  isLiveSupabase,
}) => {
  const { t, direction, language } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Filter products for quick search dropdown
  const quickResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return products
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.planetName.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [searchTerm, products]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Top row for mobile / Left group for desktop: Category Drawer Button & Brand Tag */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3">
            <button
              onClick={onOpenTaxonomy}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all duration-150 border border-slate-200 dark:border-slate-700 active:scale-95 cursor-pointer"
              title={t('marketplace.taxonomy_title')}
            >
              <Layers className="w-4 h-4 text-[#fa8221]" />
              <span className="hidden sm:inline">{t('marketplace.taxonomy_btn')}</span>
              <span className="inline sm:hidden">{t('marketplace.taxonomy_btn')}</span>
            </button>

            {/* Live DB / Offline indicator pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300">
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  isLiveSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                )}
              />
              <span className="hidden sm:inline">
                {isLiveSupabase ? t('marketplace.supabase_live') : t('marketplace.supabase_offline')}
              </span>
            </div>

            {/* Mobile Actions: Wishlist & Cart Shortcuts */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={onOpenWishlist}
                className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors"
                aria-label={t('marketplace.wishlist_btn')}
              >
                <Heart className={cn('w-5 h-5', wishlistCount > 0 && 'fill-rose-500 text-rose-500')} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full px-1">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#fa8221] text-white font-bold text-sm shadow-sm active:scale-95 transition-all"
                aria-label={t('marketplace.cart_pill_label')}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cartCount}</span>
              </button>
            </div>
          </div>

          {/* Center Search Bar with Instant Autocomplete Popover */}
          <div className="relative w-full md:max-w-xl flex-1" ref={searchDropdownRef}>
            <div className="relative flex items-center">
              <Search className={cn(
                "absolute w-4 h-4 text-slate-400 pointer-events-none transition-colors",
                direction === 'rtl' ? 'right-3.5' : 'left-3.5'
              )} />
              
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('marketplace.search_placeholder')}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:border-[#016ba5] dark:focus:border-[#0284c7] focus:ring-2 focus:ring-[#016ba5]/20 dark:focus:ring-[#0284c7]/20 outline-none transition-all duration-200 placeholder:text-slate-400",
                  direction === 'rtl' ? 'pr-10 pl-9' : 'pl-10 pr-9'
                )}
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label={t('marketplace.search_clear')}
                  className={cn(
                    "absolute p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
                    direction === 'rtl' ? 'left-2.5' : 'right-2.5'
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown Preview */}
            {isSearchFocused && searchTerm.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40 animate-in fade-in-50 duration-150">
                <div className="p-2 border-b border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-3">
                  <span>{t('marketplace.quick_results')}</span>
                  <span>{quickResults.length} matches</span>
                </div>

                {quickResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-72 overflow-y-auto">
                    {quickResults.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          onSelectProduct(product);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-start p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 flex items-center gap-3 transition-colors group cursor-pointer"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold",
                          product.iconBg || 'bg-blue-100 text-blue-700'
                        )}>
                          {product.title.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] transition-colors">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{product.planetName}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{formatPrice(product.price, language)}</span>
                            <span>•</span>
                            <span className="text-[#fa8221] font-medium">+{product.xpBonus} XP</span>
                          </div>
                        </div>

                        <ArrowRight className={cn(
                          "w-4 h-4 text-slate-300 group-hover:text-[#016ba5] dark:group-hover:text-[#0284c7] shrink-0 transition-transform",
                          direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                        )} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    {t('marketplace.no_results_desc')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Actions: Wishlist, Profile/Auth, Cart Drawer CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 active:scale-95 cursor-pointer"
              title={t('marketplace.wishlist_title', { count: wishlistCount })}
            >
              <Heart className={cn('w-4 h-4 transition-colors', wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-500 dark:text-slate-400')} />
              <span>{t('marketplace.wishlist_btn')}</span>
              {wishlistCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-bold text-white bg-rose-500 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Profile / Family Account */}
            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 active:scale-95 cursor-pointer"
                title={user ? user.email : t('nav.sign_in')}
              >
                <UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="max-w-[110px] truncate text-xs font-medium">
                  {user ? (user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]) : t('nav.sign_in')}
                </span>
              </button>
            )}

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black text-[#fa8221] bg-white rounded-full px-1 shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start text-start leading-tight">
                <span className="text-[11px] font-medium text-white/90 uppercase tracking-wider">
                  {t('marketplace.cart_pill_label')}
                </span>
                <span className="font-extrabold text-sm">{formatPrice(cartSubtotal, language)}</span>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
