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

export const Marketplace: React.FC = () => {
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
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

    setAddedNotice(`Added "${product.title}" (${quantity}) to your Quest Cart!`);
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
    <div className="bg-white min-h-screen">
      {/* 1. Header Banner & Supabase Live Status Bar */}
      <section className="bg-gradient-to-b from-[#016ba5]/15 via-white to-slate-50/50 pt-10 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary" size="md" icon={<ShoppingBag className="w-4 h-4" />}>
                  AbtalQuest Official Marketplace
                </Badge>
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  100% Screen-Free Physical Gear
                </Badge>

                {/* Supabase Live Status Indicator */}
                <div 
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-semibold border transition-all ${
                    isFromSupabase
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : supabaseStatus?.tableReady
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : supabaseStatus?.connected
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title={supabaseStatus?.message || 'Database status'}
                >
                  <Database className="w-3 h-3 text-[#016ba5]" />
                  <span>
                    {isFromSupabase
                      ? 'Supabase Live Data'
                      : supabaseStatus?.tableReady
                      ? 'Supabase Connected'
                      : supabaseStatus?.connected
                      ? 'Supabase: Ready for Schema'
                      : 'Offline Local Mode'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${isFromSupabase || supabaseStatus?.tableReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                </div>
              </div>

              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mb-3">
                Values-Driven Learning Kits & Offline Quests
              </h1>
              <p className="font-body text-sm sm:text-base text-[#64748B] max-w-3xl leading-relaxed">
                Empower children with screen-free tools, illustrated chronicles, mechanical kits, and cooperative games designed by educators. Certified non-toxic and values-centered.
              </p>
            </div>

            {/* Quick Cart Trigger Pill */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border-2 border-[#016ba5]/20 hover:border-[#016ba5] shadow-sm hover:shadow-md transition-all group"
                aria-label={`Open Quest Cart with ${totalCartCount} items`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[#016ba5]/10 text-[#016ba5] flex items-center justify-center group-hover:bg-[#016ba5] group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#fa8221] text-white font-gamification font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <div className="text-left font-headline">
                  <span className="block text-[11px] text-slate-500 font-medium">Quest Cart</span>
                  <span className="block text-sm font-bold text-slate-900">
                    {totalCartCount === 0 ? 'Empty' : `${totalCartCount} item${totalCartCount > 1 ? 's' : ''}`}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Added-To-Cart Notification Toast */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#016ba5] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 font-body text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
            <span className="font-medium">{addedNotice}</span>
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="ml-2 underline font-bold text-amber-300 hover:text-white"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* 3. Search, Filter & Controls Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search kits, books, tools, skills (e.g. gears, compass, empathy)..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#016ba5] focus:border-transparent font-body text-sm transition-all shadow-sm placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'xp-desc')}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-white font-headline text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#016ba5] shadow-sm cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="xp-desc">Highest Quest XP</option>
            </select>
          </div>
        </div>

        {/* Planet Worlds Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-4 mb-4 border-b border-slate-100">
          <span className="font-body text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Planet World:
          </span>
          {[
            { id: 'all', label: 'All Planets' },
            { id: 'thinkers', label: "Thinkers' Planet (Logic & STEM)" },
            { id: 'brave', label: 'Brave Planet (Resilience & Outdoor)' },
            { id: 'solvers', label: "Solvers' Planet (Problem-Solving)" },
            { id: 'heart', label: 'Heart Planet (Empathy & Values)' },
          ].map((cat) => {
            const isSelected = selectedPlanet === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedPlanet(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-headline text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Age Group & Product Format */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs font-body">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Age:</span>
              <div className="flex gap-1">
                {['all', '6-8', '9-11', '12+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`px-2.5 py-1 rounded-lg font-semibold uppercase ${
                      selectedAge === age
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {age === 'all' ? 'All Ages' : `Ages ${age}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Format:</span>
              <div className="flex gap-1">
                {['all', 'Physical Kit', 'Storybook', 'Quest Gear', 'Family Game', 'Learning Tool'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-2.5 py-1 rounded-lg font-semibold ${
                      selectedType === type
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset Filters action */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-[#fa8221] hover:text-[#e87313] font-semibold underline underline-offset-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>

        {/* 4. Products Grid */}
        {loadingProducts ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-[#016ba5] animate-spin mb-4" />
            <h3 className="font-headline text-lg font-bold text-slate-700">Connecting to Supabase...</h3>
            <p className="font-body text-xs text-slate-400 mt-1">Loading certified safe learning kits</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50/60 rounded-3xl border border-dashed border-slate-200 p-8">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-headline text-lg font-bold text-slate-700 mb-1">
              No Quest Kits Matched Your Filters
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 max-w-md mx-auto">
              Try adjusting your search terms, clearing planet category filters, or exploring all age groups.
            </p>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Reset Filters
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
                className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-[#016ba5]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Visual Top Preview Surface */}
                <div className="p-6 bg-slate-50/70 group-hover:bg-slate-50 transition-colors flex flex-col items-center justify-center relative min-h-[190px]">
                  
                  {/* Category & XP Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="font-headline text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-sm border border-slate-100">
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

                  <span className="mt-3 font-headline text-[11px] font-bold text-slate-500 tracking-wide">
                    {product.productType}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Planet world & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-xs font-body text-slate-500">
                      <span className="font-semibold text-[#016ba5]">{product.planetName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-headline font-bold text-base text-[#1E293B] group-hover:text-[#016ba5] transition-colors line-clamp-1 mb-2">
                      {product.title}
                    </h4>

                    {/* Short Description */}
                    <p className="font-body text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                      {product.shortDescription}
                    </p>

                    {/* Key feature tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-body text-[10px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price Tag & Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-body text-[10px] text-slate-400 block uppercase">Price</span>
                      <span className="font-headline font-black text-xl text-slate-900">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <Button
                      variant="cta"
                      size="sm"
                      icon={<Plus className="w-3.5 h-3.5" />}
                      iconPosition="left"
                      onClick={(e) => handleAddToCart(product, 1, e)}
                      className="shadow-sm hover:shadow-cta"
                    >
                      Add
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
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto border border-slate-100 p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-slate-100 mb-6">
                <div className={`w-24 h-24 rounded-3xl ${selectedProduct.iconBg || 'bg-slate-100 text-slate-700'} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  {getProductIcon(selectedProduct.category)}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-headline text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#016ba5]/10 text-[#016ba5]">
                      {selectedProduct.planetName}
                    </span>
                    <span className="font-headline text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {selectedProduct.ageLabel}
                    </span>
                    <Badge variant="gamification" size="sm">
                      +{selectedProduct.xpBonus} Quest XP
                    </Badge>
                  </div>

                  <h3 className="font-headline text-2xl sm:text-3xl font-black text-[#1E293B] mb-2 leading-snug">
                    {selectedProduct.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-body text-slate-600">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedProduct.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({selectedProduct.reviewsCount} verified parent reviews)
                      </span>
                    </div>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Non-Toxic
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                
                {/* Left: Descriptions & Guidelines (Cols 1-7) */}
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <h5 className="font-headline font-bold text-sm text-slate-900 mb-2 uppercase tracking-wide">
                      About this Quest Kit
                    </h5>
                    <p className="font-body text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedProduct.fullDescription}
                    </p>
                  </div>

                  {/* Certified Child-Safe Materials Guarantee */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2 text-emerald-900 font-headline font-bold text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Official Child Safety & Materials Guarantee</span>
                    </div>
                    <ul className="space-y-1.5 font-body text-xs text-emerald-800">
                      {selectedProduct.safetyGuidelines.map((guide, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{guide}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Customer Reviews Preview */}
                  <div>
                    <h5 className="font-headline font-bold text-sm text-slate-900 mb-3 uppercase tracking-wide">
                      Parent & Educator Feedback
                    </h5>
                    <div className="space-y-3">
                      {selectedProduct.reviews.map((rev, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-headline font-bold text-xs text-slate-800">{rev.author}</span>
                            <span className="font-body text-[11px] text-slate-400">{rev.date}</span>
                          </div>
                          <span className="block font-body text-[11px] text-[#016ba5] mb-1.5">{rev.role}</span>
                          <p className="font-body text-xs text-slate-600 italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right: Skills Learned & XP Bonus (Cols 8-12) */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* Skills Learned breakdown */}
                  <div className="p-5 rounded-2xl bg-[#016ba5]/5 border border-[#016ba5]/20">
                    <h5 className="font-headline font-bold text-sm text-[#016ba5] mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Life Skills Developed
                    </h5>
                    <div className="space-y-2.5">
                      {selectedProduct.skillsLearned.map((skill, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs font-body">
                          <span className="font-medium text-slate-700">{skill.name}</span>
                          <span className="font-headline font-bold text-[10px] px-2 py-0.5 rounded-md bg-white text-[#016ba5] shadow-xs">
                            {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What's in the Box */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <h5 className="font-headline font-bold text-xs text-slate-800 mb-2 uppercase tracking-wide">
                      Package Includes
                    </h5>
                    <ul className="font-body text-xs text-slate-600 space-y-1">
                      <li>• Complete hands-on assembly components</li>
                      <li>• Illustrated parent & child co-quest guide</li>
                      <li>• QR code for digital character milestone XP</li>
                      <li>• Official AbtalQuest completion certificate</li>
                    </ul>
                  </div>

                </div>

              </div>

              {/* Modal Footer: Quantity Selector & CTA Button */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <span className="font-body text-xs text-slate-600 font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-headline font-bold text-sm px-4 select-none">
                      {modalQuantity}
                    </span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
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
                    iconPosition="left"
                    onClick={() => {
                      handleAddToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                    }}
                    className="shadow-cta hover:shadow-cta-hover"
                  >
                    Add to Cart • ${(selectedProduct.price * modalQuantity).toFixed(2)}
                  </Button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 6. Cart Drawer Modal */}
        {cartDrawerOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between p-6 sm:p-8 animate-slideLeft">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#fa8221]" />
                    <h3 className="font-headline text-xl font-bold text-[#1E293B]">
                      Your Quest Cart ({totalCartCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-headline font-bold text-slate-700 mb-1">Your cart is empty</p>
                    <p className="font-body text-xs text-slate-400 mb-6">
                      Explore safe learning kits and start earning Quest XP!
                    </p>
                    <Button variant="cta" size="sm" onClick={() => setCartDrawerOpen(false)}>
                      Browse Marketplace
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
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${prod.iconBg || 'bg-slate-100 text-slate-700'} flex items-center justify-center flex-shrink-0`}>
                              {getProductIcon(prod.category)}
                            </div>
                            <div>
                              <h5 className="font-headline font-bold text-xs text-slate-800 line-clamp-1">
                                {prod.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-body text-xs text-slate-500">
                                  ${prod.price.toFixed(2)}
                                </span>
                                <div className="flex items-center border border-slate-300 rounded-md bg-white">
                                  <button
                                    onClick={() => handleUpdateCartQuantity(prod.id, -1)}
                                    className="p-1 text-slate-500 hover:bg-slate-100"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold font-headline">{cartItem.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartQuantity(prod.id, 1)}
                                    className="p-1 text-slate-500 hover:bg-slate-100"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-headline font-black text-sm text-slate-900 block">
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
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between font-body text-sm text-slate-600">
                    <div>
                      <span className="block font-medium">Subtotal</span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        Earns +{cartTotalXp} Quest XP
                      </span>
                    </div>
                    <span className="font-headline font-black text-2xl text-slate-900">
                      ${cartSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-body text-emerald-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Free Child-Safe Shipping on all learning kits!</span>
                  </div>

                  <Button
                    variant="cta"
                    size="lg"
                    fullWidth
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                    onClick={() => {
                      setCartDrawerOpen(false);
                      setCheckoutModalOpen(true);
                    }}
                  >
                    Proceed to Safe Checkout
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <Badge variant="primary" size="sm">Child-Safe Verified Order</Badge>
              </div>

              <h3 className="font-headline text-2xl font-black text-[#1E293B] mb-2">
                Complete Your Quest Order
              </h3>
              <p className="font-body text-xs text-slate-500 mb-6">
                Your order will be securely recorded into Supabase and dispatched with non-toxic safety packaging.
              </p>

              {/* Order summary mini table */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
                <div className="flex justify-between items-center text-xs font-body text-slate-600 pb-2 border-b border-slate-200">
                  <span>Items in Order ({totalCartCount}):</span>
                  <span className="font-headline font-bold text-slate-800">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-body text-slate-600 py-1.5 border-b border-slate-200">
                  <span>Child-Safe Delivery:</span>
                  <span className="font-headline font-bold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between items-center text-sm font-headline font-black text-slate-900 pt-2">
                  <span>Total Due:</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-xs font-gamification text-[#7C3AED] font-bold">
                  <span>Total XP to Unlock:</span>
                  <span>+{cartTotalXp} Quest XP ✨</span>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Parent / Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Dr. Amina Al-Mansoor"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] ${
                      formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.name && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Email Address (for order tracking & XP code) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] ${
                      formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.email && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.email}</span>}
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Delivery Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Oasis Way, Suite 400"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] ${
                      formErrors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.address && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.address}</span>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Austin"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] ${
                        formErrors.city ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.city && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.city}</span>}
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="78701"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] ${
                        formErrors.postalCode ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                      }`}
                    />
                    {formErrors.postalCode && <span className="text-[11px] text-red-500 mt-1 block">{formErrors.postalCode}</span>}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <Button
                    variant="cta"
                    size="lg"
                    fullWidth
                    disabled={submittingOrder}
                    icon={submittingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    {submittingOrder ? 'Saving to Supabase...' : `Confirm & Place Order ($${cartSubtotal.toFixed(2)})`}
                  </Button>

                  <p className="text-[11px] font-body text-slate-400 text-center">
                    🔒 Zero commercial trackers. 100% money-back guarantee if not satisfied.
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
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <Badge variant="success" size="md" className="mb-2">
                Order Confirmed!
              </Badge>

              <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
                Thank You for Empowering Growth!
              </h3>
              
              <p className="font-body text-xs text-slate-500 mb-6">
                Your values-based quest kit is being hand-packed. We have sent a confirmation email with your digital quest activation pass.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 mb-6">
                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500">Order ID:</span>
                  <strong className="font-headline text-slate-800 tracking-wider">
                    {orderConfirmation.orderId}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500">Total Paid:</span>
                  <strong className="font-headline text-slate-800">
                    ${orderConfirmation.totalAmount.toFixed(2)}
                  </strong>
                </div>

                <div className="flex justify-between items-center text-xs font-body">
                  <span className="text-slate-500">Quest XP Unlocked:</span>
                  <span className="font-gamification font-bold text-[#7C3AED]">
                    +{orderConfirmation.totalXp} XP ✨
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-body pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Supabase Storage:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                    <Database className="w-3 h-3" />
                    {orderConfirmation.isSupabaseSaved ? 'Saved to Supabase DB' : 'Saved to Local Device'}
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
                  Continue Exploring Quests
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
