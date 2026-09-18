import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Plus, 
  Minus, 
  SlidersHorizontal, 
  RotateCcw,
  Brain, 
  Mountain, 
  Lightbulb, 
  Heart, 
  Award, 
  Check,
  Database,
  Loader2,
  PackageCheck
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { 
  type Product, 
  DEFAULT_PRODUCTS,
  fetchMarketplaceProducts, 
  syncCartToSupabase, 
  loadCartFromSupabase, 
  placeOrder, 
  checkSupabaseHealth, 
  type SupabaseHealth, 
  type OrderConfirmation 
} from '../../services/marketplaceService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceProps {
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ user, onOpenAuth }) => {
  const { t, direction } = useLanguage();
  // State for products loaded from Supabase or fallback
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseHealth | null>(null);

  // State Management for filters, search, and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'xp-desc'>('featured');
  
  // Dynamic Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // Cart tracking
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Checkout & Order Placement State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Auto-fill user credentials if signed in
  useEffect(() => {
    if (user?.email) {
      const timer = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || user.user_metadata?.full_name || '',
          email: prev.email || user.email || '',
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // 1. Fetch products & check Supabase status on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [result, health] = await Promise.all([
          fetchMarketplaceProducts(),
          checkSupabaseHealth(),
        ]);

        if (isMounted) {
          setProducts(result.products);
          setIsFromSupabase(result.isFromSupabase);
          setSupabaseStatus(health);
          setLoadingProducts(false);
        }
      } catch (err) {
        console.warn('Error initializing marketplace:', err);
        if (isMounted) {
          setProducts(DEFAULT_PRODUCTS);
          setLoadingProducts(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load persisted cart on mount
  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      const stored = await loadCartFromSupabase();
      if (isMounted && Object.keys(stored).length > 0) {
        const cartArray = Object.entries(stored).map(([id, quantity]) => ({ id, quantity }));
        setCart(cartArray);
      }
    }

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to persist cart changes to Supabase
  const persistCart = useCallback((newCart: { id: string; quantity: number }[]) => {
    const cartRecord: Record<string, number> = {};
    for (const item of newCart) {
      cartRecord[item.id] = item.quantity;
    }
    syncCartToSupabase(cartRecord);
  }, []);

  // Get dynamic icon based on product category & type
  const getProductIcon = (category: string) => {
    switch (category) {
      case 'thinkers':
        return <Brain className="w-8 h-8" />;
      case 'brave':
        return <Mountain className="w-8 h-8" />;
      case 'solvers':
        return <Lightbulb className="w-8 h-8" />;
      case 'heart':
        return <Heart className="w-8 h-8" />;
      default:
        return <Award className="w-8 h-8" />;
    }
  };

  // Filter and sort items dynamically
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search matching
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.planetName.toLowerCase().includes(searchTerm.toLowerCase());

      // Planet matching
      const matchesPlanet = selectedPlanet === 'all' || item.category === selectedPlanet;

      // Age matching
      const matchesAge = selectedAge === 'all' || item.ageGroup === selectedAge;

      // Type matching
      const matchesType = selectedType === 'all' || item.productType === selectedType;

      return matchesSearch && matchesPlanet && matchesAge && matchesType;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'xp-desc') return b.xpBonus - a.xpBonus;
      return 0; // featured default
    });
  }, [products, searchTerm, selectedPlanet, selectedAge, selectedType, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.id);
      return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  const cartTotalXp = useMemo(() => {
    return cart.reduce((sum, item) => {
      const prod = products.find((p) => p.id === item.id);
      return sum + (prod ? prod.xpBonus * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  const handleAddToCart = (product: Product, quantity: number = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updated: { id: string; quantity: number }[];
      if (existing) {
        updated = prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { id: product.id, quantity }];
      }
      persistCart(updated);
      return updated;
    });

    setAddedNotice(t('marketplace.toast_added', { title: product.title }));
    setTimeout(() => {
      setAddedNotice(null);
    }, 3500);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { id: string; quantity: number }[];

      persistCart(updated);
      return updated;
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedPlanet('all');
    setSelectedAge('all');
    setSelectedType('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedPlanet !== 'all' ||
    selectedAge !== 'all' ||
    selectedType !== 'all' ||
    sortBy !== 'featured';

  // Handle Order Placement Form Validation & Submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid email address is required';
    }
    if (!formData.address.trim()) errors.address = 'Delivery street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmittingOrder(true);
    try {
      const orderItems = cart
        .map((cartItem) => {
          const prod = products.find((p) => p.id === cartItem.id);
          if (!prod) return null;
          return {
            productId: prod.id,
            productTitle: prod.title,
            quantity: cartItem.quantity,
            unitPrice: prod.price,
            xpBonus: prod.xpBonus * cartItem.quantity,
          };
        })
        .filter(Boolean) as {
          productId: string;
          productTitle: string;
          quantity: number;
          unitPrice: number;
          xpBonus: number;
        }[];

      const confirmation = await placeOrder({
        userId: user?.id,
        customerName: formData.name,
        customerEmail: formData.email,
        shippingAddress: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingCost: 0, // Free child-safe shipping
        totalAmount: cartSubtotal,
        totalXp: cartTotalXp,
      });

      // Clear cart
      setCart([]);
      persistCart([]);
      setCheckoutModalOpen(false);
      setCartDrawerOpen(false);
      setOrderConfirmation(confirmation);
    } catch (err) {
      console.error('Order submission error:', err);
      alert('We encountered an error placing your order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#071727] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* 1. Header Banner & Supabase Live Status Bar */}
      <section className="bg-gradient-to-b from-[#016ba5]/15 via-white to-slate-50/50 dark:from-[#016ba5]/20 dark:via-[#0A2540] dark:to-[#071727] pt-8 sm:pt-10 pb-10 sm:pb-12 border-b border-slate-200 dark:border-slate-800 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" size="md" icon={<ShoppingBag className="w-4 h-4" />}>
                  {t('marketplace.official_badge')}
                </Badge>
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  {t('marketplace.safety_badge')}
                </Badge>

                {/* Supabase Live Status Indicator */}
                <div 
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold border transition-all ${
                    isFromSupabase
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700'
                      : supabaseStatus?.tableReady
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700'
                      : supabaseStatus?.connected
                      ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                  title={supabaseStatus?.message || 'Database status'}
                >
                  <Database className="w-3 h-3 text-[#016ba5] dark:text-[#38BDF8]" />
                  <span>
                    {isFromSupabase
                      ? t('marketplace.supabase_live')
                      : supabaseStatus?.tableReady
                      ? t('marketplace.supabase_connected')
                      : supabaseStatus?.connected
                      ? t('marketplace.supabase_schema')
                      : t('marketplace.supabase_offline')}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isFromSupabase || supabaseStatus?.tableReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
              </div>

              <h1 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mb-3 break-words">
                {t('marketplace.title')}
              </h1>
              <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 max-w-3xl leading-relaxed">
                {t('marketplace.subtitle')}
              </p>
            </div>

            {/* Quick Cart Trigger Pill */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#0F2F4E] border-2 border-[#016ba5]/20 dark:border-slate-700 hover:border-[#016ba5] dark:hover:border-[#38BDF8] shadow-sm hover:shadow-md transition-all group"
                aria-label={`Open Quest Cart with ${totalCartCount} items`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[#016ba5]/10 dark:bg-[#016ba5]/25 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center group-hover:bg-[#016ba5] group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  {totalCartCount > 0 && (
                    <span className={cn(
                      "absolute -top-1.5 bg-[#fa8221] text-white font-gamification font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm",
                      direction === 'rtl' ? '-left-1.5' : '-right-1.5'
                    )}>
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <div className={cn("font-headline", direction === 'rtl' ? 'text-right' : 'text-left')}>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {t('marketplace.cart_pill_label')}
                  </span>
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    {totalCartCount === 0
                      ? t('marketplace.cart_empty')
                      : totalCartCount === 1
                      ? t('marketplace.cart_item_singular')
                      : t('marketplace.cart_items', { count: totalCartCount })}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Added-To-Cart Notification Toast */}
      {addedNotice && (
        <div className={cn(
          "fixed bottom-6 z-50 animate-bounce",
          direction === 'rtl' ? 'left-6' : 'right-6'
        )}>
          <div className="bg-[#016ba5] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 font-body text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span className="font-medium">{addedNotice}</span>
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="ml-2 underline font-bold text-amber-300 hover:text-white"
            >
              {t('marketplace.toast_view_cart')}
            </button>
          </div>
        </div>
      )}

      {/* 3. Search, Filter & Controls Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full overflow-hidden">
        
        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1 min-w-0">
            <Search className={cn(
              "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500",
              direction === 'rtl' ? 'right-4' : 'left-4'
            )} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('marketplace.search_placeholder')}
              className={cn(
                "w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0F2F4E] text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0F2F4E] focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent font-body text-sm transition-all shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500",
                direction === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'
              )}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full",
                  direction === 'rtl' ? 'left-3' : 'right-3'
                )}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-body text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{t('marketplace.sort_label')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'xp-desc')}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F2F4E] font-headline text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#016ba5] shadow-sm cursor-pointer"
            >
              <option value="featured">{t('marketplace.sort_featured')}</option>
              <option value="price-asc">{t('marketplace.sort_price_asc')}</option>
              <option value="price-desc">{t('marketplace.sort_price_desc')}</option>
              <option value="xp-desc">{t('marketplace.sort_xp_desc')}</option>
            </select>
          </div>
        </div>

        {/* Planet Worlds Category Filter Pills */}
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full sm:flex-wrap">
          <span className={cn(
            "font-body text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap flex-shrink-0",
            direction === 'rtl' ? 'ml-1' : 'mr-1'
          )}>
            {t('marketplace.planet_filter_label')}
          </span>
          {[
            { id: 'all', label: t('marketplace.planet_all') },
            { id: 'thinkers', label: t('marketplace.planet_thinkers') },
            { id: 'brave', label: t('marketplace.planet_brave') },
            { id: 'solvers', label: t('marketplace.planet_solvers') },
            { id: 'heart', label: t('marketplace.planet_heart') },
          ].map((cat) => {
            const isSelected = selectedPlanet === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedPlanet(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-headline text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Age Group & Product Format */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-body">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{t('marketplace.age_filter_label')}</span>
              <div className="flex flex-wrap gap-1">
                {['all', '6-8', '9-11', '12+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-2.5 py-1 rounded-lg font-semibold uppercase transition-colors ${
                      selectedAge === age
                        ? 'bg-slate-800 dark:bg-[#016ba5] text-white'
                        : 'bg-slate-100 dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700'
                    }`}
                  >
                    {age === 'all' ? t('marketplace.age_all') : t('marketplace.age_item', { age })}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">{t('marketplace.format_filter_label')}</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: t('marketplace.format_all') },
                  { id: 'Physical Kit', label: t('marketplace.format_kit') },
                  { id: 'Storybook', label: t('marketplace.format_book') },
                  { id: 'Quest Gear', label: t('marketplace.format_gear') },
                  { id: 'Family Game', label: t('marketplace.format_game') },
                  { id: 'Learning Tool', label: t('marketplace.format_tool') },
                ].map((formatItem) => (
                  <button
                    key={formatItem.id}
                    onClick={() => setSelectedType(formatItem.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      selectedType === formatItem.id
                        ? 'bg-slate-800 dark:bg-[#016ba5] text-white'
                        : 'bg-slate-100 dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700'
                    }`}
                  >
                    {formatItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters action */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-[#fa8221] hover:text-[#e87313] font-semibold underline underline-offset-2 whitespace-nowrap"
            >
              <RotateCcw className={cn("w-3.5 h-3.5", direction === 'rtl' && "rtl-flip")} />
              {t('marketplace.reset_filters')}
            </button>
          )}
        </div>

        {/* 4. Products Grid */}
        {loadingProducts ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-[#016ba5] dark:text-[#38BDF8] animate-spin mb-4" />
            <h3 className="font-headline text-lg font-bold text-slate-700 dark:text-slate-200">
              {t('marketplace.loading_title')}
            </h3>
            <p className="font-body text-xs text-slate-400 mt-1">
              {t('marketplace.loading_desc')}
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50/60 dark:bg-[#0F2F4E]/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 p-8">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-headline text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">
              {t('marketplace.no_results_title')}
            </h3>
            <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {t('marketplace.no_results_desc')}
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              {t('marketplace.reset_filters')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setModalQuantity(1);
                }}
                className="group relative bg-white dark:bg-[#0F2F4E] rounded-3xl border border-slate-200/80 dark:border-slate-700 hover:border-[#016ba5]/40 dark:hover:border-[#38BDF8]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Visual Top Preview Surface */}
                <div className="p-6 bg-slate-50/70 dark:bg-[#0A2540]/80 group-hover:bg-slate-50 dark:group-hover:bg-[#0A2540] transition-colors flex flex-col items-center justify-center relative min-h-[190px]">
                  
                  {/* Category & XP Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="font-headline text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700">
                      {product.ageLabel}
                    </span>
                    <Badge variant="gamification" size="sm">
                      +{product.xpBonus} XP
                    </Badge>
                  </div>

                  {/* Centered Thematic Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${product.iconBg || 'bg-slate-100 text-slate-700'} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getProductIcon(product.category)}
                  </div>

                  <span className="mt-3 font-headline text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wide">
                    {product.productType}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Planet world & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-body text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-[#016ba5] dark:text-[#38BDF8]">{product.planetName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-headline font-bold text-base text-[#1E293B] dark:text-white group-hover:text-[#016ba5] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1 mb-2">
                      {product.title}
                    </h4>

                    {/* Short Description */}
                    <p className="font-body text-xs text-[#64748B] dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                      {product.shortDescription}
                    </p>

                    {/* Key feature tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-[#0A2540] text-slate-600 dark:text-slate-300 rounded-md font-body text-[10px] border border-transparent dark:border-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Tag & Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="font-body text-[10px] text-slate-400 dark:text-slate-500 block uppercase">
                        {t('marketplace.price_label')}
                      </span>
                      <span className="font-headline font-black text-xl text-slate-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      variant="cta"
                      size="sm"
                      icon={<Plus className={cn("w-3.5 h-3.5", direction === 'rtl' && "rtl-flip")} />}
                      iconPosition={direction === 'rtl' ? 'right' : 'left'}
                      onClick={(e) => handleAddToCart(product, 1, e)}
                      className="shadow-sm hover:shadow-cta"
                    >
                      {t('marketplace.add_btn')}
                    </Button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Product Detail View Modal */}
        {selectedProduct && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl overflow-y-auto border border-slate-100 dark:border-slate-700 p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className={cn(
                  "absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                  direction === 'rtl' ? 'left-5' : 'right-5'
                )}
                aria-label={t('profile.close')}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-slate-100 dark:border-slate-700/80 mb-6">
                <div className={`w-24 h-24 rounded-3xl ${selectedProduct.iconBg || 'bg-slate-100 text-slate-700'} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  {getProductIcon(selectedProduct.category)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-headline text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#016ba5]/10 dark:bg-[#016ba5]/25 text-[#016ba5] dark:text-[#38BDF8]">
                      {selectedProduct.planetName}
                    </span>
                    <span className="font-headline text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                      {selectedProduct.ageLabel}
                    </span>
                    <Badge variant="gamification" size="sm">
                      +{selectedProduct.xpBonus} Quest XP
                    </Badge>
                  </div>

                  <h3 className="font-headline text-2xl sm:text-3xl font-black text-[#1E293B] dark:text-white mb-2 leading-snug">
                    {selectedProduct.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-body text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedProduct.rating}</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">
                        {t('marketplace.detail_verified_reviews', { count: selectedProduct.reviewsCount })}
                      </span>
                    </div>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> {t('marketplace.detail_non_toxic')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                
                {/* Left: Descriptions & Guidelines (Cols 1-7) */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h5 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-2 uppercase tracking-wide">
                      {t('marketplace.detail_about')}
                    </h5>
                    <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedProduct.fullDescription}
                    </p>
                  </div>

                  {/* Certified Child-Safe Materials Guarantee */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                    <div className="flex items-center gap-2 mb-2 text-emerald-900 dark:text-emerald-200 font-headline font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{t('marketplace.detail_safety_guarantee')}</span>
                    </div>
                    <ul className="space-y-1.5 font-body text-xs text-emerald-800 dark:text-emerald-300">
                      {selectedProduct.safetyGuidelines.map((guide, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{guide}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customer Reviews Preview */}
                  <div>
                    <h5 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-3 uppercase tracking-wide">
                      {t('marketplace.detail_feedback_title')}
                    </h5>
                    <div className="space-y-3">
                      {selectedProduct.reviews.map((rev, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-100 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-headline font-bold text-xs text-slate-800 dark:text-slate-100">{rev.author}</span>
                            <span className="font-body text-[11px] text-slate-400 dark:text-slate-500">{rev.date}</span>
                          </div>
                          <span className="block font-body text-[11px] text-[#016ba5] dark:text-[#38BDF8] mb-1.5">{rev.role}</span>
                          <p className="font-body text-xs text-slate-600 dark:text-slate-300 italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Skills Learned & XP Bonus (Cols 8-12) */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* Skills Learned breakdown */}
                  <div className="p-5 rounded-2xl bg-[#016ba5]/5 dark:bg-[#016ba5]/15 border border-[#016ba5]/20 dark:border-[#016ba5]/40">
                    <h5 className="font-headline font-bold text-sm text-[#016ba5] dark:text-[#38BDF8] mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      {t('marketplace.detail_skills_title')}
                    </h5>
                    <div className="space-y-2.5">
                      {selectedProduct.skillsLearned.map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-body">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{skill.name}</span>
                          <span className="font-headline font-bold text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[#016ba5] dark:text-sky-300 shadow-xs">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What's in the Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700">
                    <h5 className="font-headline font-bold text-xs text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                      {t('marketplace.detail_package_includes')}
                    </h5>
                    <ul className="font-body text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <li>• {t('marketplace.detail_package_item_1')}</li>
                      <li>• {t('marketplace.detail_package_item_2')}</li>
                      <li>• {t('marketplace.detail_package_item_3')}</li>
                      <li>• {t('marketplace.detail_package_item_4')}</li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* Modal Footer: Quantity Selector & CTA Button */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {t('marketplace.detail_quantity')}
                  </span>
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-[#0A2540] overflow-hidden">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-headline font-bold text-sm px-4 text-slate-900 dark:text-white select-none">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary CTA Button styled in #fa8221 */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="cta"
                    size="lg"
                    icon={<ShoppingBag className="w-4 h-4" />}
                    iconPosition={direction === 'rtl' ? 'right' : 'left'}
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                    }}
                    className="shadow-cta hover:shadow-cta-hover"
                  >
                    {t('marketplace.detail_add_to_cart', { total: (selectedProduct.price * modalQuantity).toFixed(2) })}
                  </Button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 6. Cart Drawer Modal */}
        {cartDrawerOpen && (
          <div 
            className={cn(
              "fixed inset-0 z-50 flex items-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn",
              direction === 'rtl' ? 'justify-start' : 'justify-end'
            )}
            role="dialog"
            aria-modal="true"
          >
            <div className={cn(
              "relative w-full max-w-md h-full bg-white dark:bg-[#0F2F4E] shadow-2xl flex flex-col justify-between p-6 sm:p-8 border-transparent dark:border-slate-700",
              direction === 'rtl' ? 'border-r animate-fadeIn' : 'border-l animate-slideLeft'
            )}>
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#fa8221]" />
                    <h3 className="font-headline text-xl font-bold text-[#1E293B] dark:text-white">
                      {t('marketplace.cart_drawer_title', { count: totalCartCount })}
                    </h3>
                  </div>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    aria-label={t('profile.close')}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {t('marketplace.cart_drawer_empty')}
                    </p>
                    <p className="font-body text-xs text-slate-400 mb-6">
                      {t('marketplace.cart_drawer_empty_desc')}
                    </p>
                    <Button variant="cta" size="sm" onClick={() => setCartDrawerOpen(false)}>
                      {t('marketplace.cart_drawer_browse')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                    {cart.map((cartItem) => {
                      const prod = products.find((p) => p.id === cartItem.id);
                      if (!prod) return null;
                      return (
                        <div
                          key={cartItem.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${prod.iconBg || 'bg-slate-100 text-slate-700'} flex items-center justify-center flex-shrink-0`}>
                              {getProductIcon(prod.category)}
                            </div>
                            <div>
                              <h5 className="font-headline font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-1">
                                {prod.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-body text-xs text-slate-500 dark:text-slate-400">
                                  ${prod.price.toFixed(2)}
                                </span>
                                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-[#0F2F4E]">
                                  <button
                                    onClick={() => handleUpdateCartQuantity(prod.id, -1)}
                                    className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold font-headline text-slate-900 dark:text-white">{cartItem.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartQuantity(prod.id, 1)}
                                    className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={cn(direction === 'rtl' ? 'text-left' : 'text-right')}>
                            <span className="font-headline font-black text-sm text-slate-900 dark:text-white block">
                              ${(prod.price * cartItem.quantity).toFixed(2)}
                            </span>
                            <span className="font-gamification text-[10px] text-[#7C3AED] font-bold">
                              +{prod.xpBonus * cartItem.quantity} XP
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                  <div className="flex items-center justify-between font-body text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="block font-medium">{t('marketplace.cart_subtotal')}</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {t('marketplace.cart_earns_xp', { xp: cartTotalXp })}
                      </span>
                    </div>
                    <span className="font-headline font-black text-2xl text-slate-900 dark:text-white">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs font-body text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span>{t('marketplace.cart_free_shipping')}</span>
                  </div>

                  <Button
                    variant="cta"
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className={cn("w-4 h-4", direction === 'rtl' && "rtl-flip")} />}
                    iconPosition={direction === 'rtl' ? 'left' : 'right'}
                    onClick={() => {
                      setCartDrawerOpen(false);
                      setCheckoutModalOpen(true);
                    }}
                  >
                    {t('marketplace.cart_checkout_btn')}
                  </Button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 7. Interactive Order Placement & Checkout Modal */}
        {checkoutModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="relative w-full max-w-lg bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className={cn(
                  "absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                  direction === 'rtl' ? 'left-5' : 'right-5'
                )}
                aria-label={t('profile.close')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <Badge variant="primary" size="sm">{t('marketplace.checkout_verified')}</Badge>
              </div>

              <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-2">
                {t('marketplace.checkout_title')}
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-6">
                {t('marketplace.checkout_subtitle')}
              </p>

              {/* Order summary mini table */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span>{t('marketplace.checkout_items_in_order', { count: totalCartCount })}</span>
                  <span className="font-headline font-bold text-slate-800 dark:text-slate-100">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-body text-slate-600 dark:text-slate-300 py-1.5 border-b border-slate-200 dark:border-slate-700">
                  <span>{t('marketplace.checkout_delivery')}</span>
                  <span className="font-headline font-bold text-emerald-600 dark:text-emerald-400">{t('marketplace.checkout_free')}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-headline font-black text-slate-900 dark:text-white pt-2">
                  <span>{t('marketplace.checkout_total_due')}</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-gamification text-[#7C3AED] dark:text-purple-400 font-bold">
                  <span>{t('marketplace.checkout_xp_to_unlock')}</span>
                  <span>+{cartTotalXp} Quest XP ✨</span>
                </div>
              </div>

              {/* Guest vs Member Account Banner */}
              {user ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-body text-emerald-800 dark:text-emerald-200 mb-5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>
                    {t('marketplace.checkout_logged_in_as', { email: user.email || '' })}
                  </span>
                </div>
              ) : (
                <div className="p-3.5 bg-gradient-to-r from-[#016ba5]/10 via-slate-50 to-[#fa8221]/10 dark:from-[#016ba5]/20 dark:via-[#0A2540] dark:to-[#fa8221]/15 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body mb-5">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Sparkles className="w-4 h-4 text-[#fa8221] flex-shrink-0" />
                    <span><strong>{t('marketplace.checkout_guest_badge')}</strong> {t('marketplace.checkout_guest_desc')}</span>
                  </div>
                  {onOpenAuth && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutModalOpen(false);
                        onOpenAuth();
                      }}
                      className="text-[#016ba5] dark:text-[#38BDF8] font-headline font-bold hover:underline self-start sm:self-auto text-[11px]"
                    >
                      {t('marketplace.checkout_sign_in_2x')}
                    </button>
                  )}
                </div>
              )}

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {t('marketplace.checkout_name')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('marketplace.checkout_name_placeholder')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      formErrors.name ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  {formErrors.name && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {t('marketplace.checkout_email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('marketplace.checkout_email_placeholder')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      formErrors.email ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  {formErrors.email && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {t('marketplace.checkout_address')}
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t('marketplace.checkout_address_placeholder')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      formErrors.address ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                    }`}
                  />
                  {formErrors.address && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {t('marketplace.checkout_city')}
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Austin"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        formErrors.city ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                    {formErrors.city && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.city}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                      {t('marketplace.checkout_postal')}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="78701"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        formErrors.postalCode ? 'border-red-400 bg-red-50/20 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                    {formErrors.postalCode && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.postalCode}</span>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-2.5">
                  <Button
                    variant="cta"
                    size="lg"
                    fullWidth
                    disabled={submittingOrder}
                    icon={submittingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                    iconPosition={direction === 'rtl' ? 'right' : 'left'}
                  >
                    {submittingOrder
                      ? t('marketplace.checkout_saving')
                      : t('marketplace.checkout_confirm_btn', { total: cartSubtotal.toFixed(2) })}
                  </Button>

                  <p className="text-[11px] font-body text-slate-400 dark:text-slate-500 text-center">
                    {t('marketplace.checkout_security_note')}
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 8. Order Confirmation Celebration Modal */}
        {orderConfirmation && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="relative w-full max-w-md bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-slate-100 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <Badge variant="success" size="md" className="mb-2">
                {t('marketplace.order_confirmed_badge')}
              </Badge>

              <h3 className="font-headline text-2xl font-black text-slate-900 dark:text-white mb-1">
                {t('marketplace.order_confirmed_title')}
              </h3>
              
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 mb-6">
                {t('marketplace.order_confirmed_desc')}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 text-left space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_id_label')}</span>
                  <strong className="font-headline text-slate-800 dark:text-slate-100 tracking-wider">
                    {orderConfirmation.orderId}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_total_paid')}</span>
                  <strong className="font-headline text-slate-800 dark:text-slate-100">
                    ${orderConfirmation.totalAmount.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500 dark:text-slate-400">{t('marketplace.order_xp_unlocked')}</span>
                  <span className="font-gamification font-bold text-[#7C3AED] dark:text-purple-400">
                    +{orderConfirmation.totalXp} XP ✨
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-body pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">
                    {direction === 'rtl' ? 'قاعدة البيانات:' : 'Database Storage:'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                    <Database className="w-3 h-3" />
                    {orderConfirmation.isSupabaseSaved
                      ? t('marketplace.order_storage_supabase')
                      : t('marketplace.order_storage_local')}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="cta"
                  size="md"
                  fullWidth
                  onClick={() => setOrderConfirmation(null)}
                >
                  {t('marketplace.order_continue_btn')}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Marketplace;
