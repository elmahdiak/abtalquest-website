import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  type Product, 
  DEFAULT_PRODUCTS,
  fetchMarketplaceProducts, 
  fetchCategories,
  type ProductCategory,
  DEFAULT_CATEGORIES,
  syncCartToSupabase, 
  loadCartFromSupabase, 
  placeOrder, 
  checkSupabaseHealth, 
  type SupabaseHealth, 
  type OrderConfirmation,
  loadWishlistFromStorage,
  saveWishlistToStorage,
  toggleWishlistItem
} from '../../services/marketplaceService';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';
import { incrementCouponUsage, type Coupon } from '../../services/couponService';
import { MarketplaceHeader } from './MarketplaceHeader';
import { MarketplaceBannerCarousel } from './MarketplaceBannerCarousel';
import { MarketplaceCategoryPills } from './MarketplaceCategoryPills';
import { MarketplaceProductGrid } from './MarketplaceProductGrid';
import { MarketplaceProductDetailPage } from './MarketplaceProductDetailPage';
import { MarketplaceTaxonomyDrawer } from './MarketplaceTaxonomyDrawer';
import { MarketplaceWishlistDrawer } from './MarketplaceWishlistDrawer';
import { MarketplaceCartDrawer } from './MarketplaceCartDrawer';
import { MarketplaceCheckoutModal, type CheckoutFormData } from './MarketplaceCheckoutModal';
import { PayzoneHostedModal } from './PayzoneHostedModal';
import { MarketplaceConfirmationModal } from './MarketplaceConfirmationModal';
import { MarketplaceFooter } from './MarketplaceFooter';

export interface MarketplaceProps {
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
  initialProductId?: string | null;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ 
  user, 
  onOpenAuth,
  initialProductId = null,
}) => {
  // Products and database health state
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);
  const [_supabaseStatus, setSupabaseStatus] = useState<SupabaseHealth | null>(null);

  // Search, taxonomy, and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlanet, setSelectedPlanet] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activePill, setActivePill] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'xp-desc'>('featured');

  // Drawers and Modals visibility
  const [isTaxonomyOpen, setIsTaxonomyOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Dedicated Product Page Route State
  const [activeProductId, setActiveProductId] = useState<string | null>(initialProductId);

  // Parse and sync URL product route on mount and browser navigation (popstate / hashchange)
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      // Check pattern like #marketplace/product/prod-1 or #/marketplace/product/prod-1
      const hashMatch = hash.match(/#\/?marketplace\/product\/([a-zA-Z0-9_-]+)/);
      if (hashMatch && hashMatch[1]) {
        setActiveProductId(hashMatch[1]);
        return;
      }

      // Check pathname pattern like /marketplace/product/prod-1
      const pathMatch = pathname.match(/\/marketplace\/product\/([a-zA-Z0-9_-]+)/);
      if (pathMatch && pathMatch[1]) {
        setActiveProductId(pathMatch[1]);
        return;
      }

      // If user navigated back to catalog root
      if (hash === '#marketplace' || hash === '#/marketplace' || hash === '' || hash === '#universe') {
        setActiveProductId(null);
      }
    };

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Navigation handler between catalog and dedicated product page
  const handleSelectProduct = useCallback((product: Product | null) => {
    if (product) {
      setActiveProductId(product.id);
      const targetHash = `#marketplace/product/${product.id}`;
      if (window.location.hash !== targetHash) {
        if (typeof document !== 'undefined' && 'startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
          (document as any).startViewTransition(() => {
            window.history.pushState({ productId: product.id }, '', targetHash);
          });
        } else {
          window.history.pushState({ productId: product.id }, '', targetHash);
        }
      }
    } else {
      setActiveProductId(null);
      if (window.location.hash.includes('/product/')) {
        if (typeof document !== 'undefined' && 'startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
          (document as any).startViewTransition(() => {
            window.history.pushState({}, '', '#marketplace');
          });
        } else {
          window.history.pushState({}, '', '#marketplace');
        }
      }
    }
  }, []);

  // Wishlist state (persisted locally)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => loadWishlistFromStorage());

  // Cart state
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);

  // Checkout and confirmation state
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Morocco',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPayzoneModalOpen, setIsPayzoneModalOpen] = useState(false);
  const [pendingPayzoneInput, setPendingPayzoneInput] = useState<{
    userId?: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    country: string;
    items: any[];
    subtotal: number;
    shippingCost: number;
    totalAmount: number;
    totalXp: number;
    cndpConsent: boolean;
    couponCode?: string;
    discountAmount?: number;
  } | null>(null);

  // Auto-fill user credentials when signed in
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

  // Load products, categories, and health from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [result, health, loadedCategories] = await Promise.all([
          fetchMarketplaceProducts(),
          checkSupabaseHealth(),
          fetchCategories(),
        ]);

        if (isMounted) {
          setProducts(result.products);
          setCategories(loadedCategories);
          setIsFromSupabase(result.isFromSupabase);
          setSupabaseStatus(health);
          setLoadingProducts(false);
        }
      } catch (err) {
        console.warn('Error loading products/categories:', err);
        if (isMounted) {
          setProducts(DEFAULT_PRODUCTS);
          setCategories(DEFAULT_CATEGORIES);
          setLoadingProducts(false);
        }
      }
    }

    loadData();

    // Listen for live product & category updates dispatched across dashboard & window
    const handleProductChange = () => {
      fetchMarketplaceProducts().then((res) => {
        if (isMounted) {
          setProducts(res.products);
          setIsFromSupabase(res.isFromSupabase);
        }
      });
    };

    const handleCategoryChange = () => {
      fetchCategories().then((cats) => {
        if (isMounted) {
          setCategories(cats);
        }
      });
    };

    window.addEventListener('abtalquest_product_updated', handleProductChange);
    window.addEventListener('abtalquest_category_updated', handleCategoryChange);

    // Real-time Supabase subscription across devices worldwide
    let productChannel: any = null;
    if (isSupabaseConfigured()) {
      try {
        productChannel = supabase
          .channel('public_products_live_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            () => {
              fetchMarketplaceProducts().then((res) => {
                if (isMounted) {
                  setProducts(res.products);
                  setIsFromSupabase(res.isFromSupabase);
                }
              });
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime subscription error for products:', err);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('abtalquest_product_updated', handleProductChange);
      window.removeEventListener('abtalquest_category_updated', handleCategoryChange);
      if (productChannel) {
        supabase.removeChannel(productChannel);
      }
    };
  }, []);

  // Load cart from Supabase / localStorage on mount
  useEffect(() => {
    let isMounted = true;
    async function initCart() {
      const savedCart = await loadCartFromSupabase();
      if (isMounted && savedCart) {
        const items = Object.entries(savedCart)
          .filter(([, qty]) => typeof qty === 'number' && qty > 0)
          .map(([id, quantity]) => ({ id, quantity }));
        if (items.length > 0) {
          setCart(items);
        }
      }
    }
    initCart();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync cart to Supabase on changes
  const persistCart = useCallback((updatedCart: { id: string; quantity: number }[]) => {
    setCart(updatedCart);
    const cartRecord: Record<string, number> = {};
    updatedCart.forEach((item) => {
      cartRecord[item.id] = item.quantity;
    });
    syncCartToSupabase(cartRecord).catch((err) => {
      console.warn('Cart sync warning:', err);
    });
  }, []);

  // Wishlist handlers
  const handleToggleWishlist = useCallback((product: Product) => {
    const updated = toggleWishlistItem(product.id);
    setWishlistIds(updated);
  }, []);

  const handleRemoveFromWishlist = useCallback((productId: string) => {
    const updated = wishlistIds.filter((id) => id !== productId);
    setWishlistIds(updated);
    saveWishlistToStorage(updated);
  }, [wishlistIds]);

  // Cart operations
  const handleAddToCart = useCallback((product: Product, quantity = 1) => {
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
  }, [persistCart]);

  const handleUpdateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { id: string; quantity: number }[];

      persistCart(updated);
      return updated;
    });
  }, [persistCart]);

  const handleRemoveItem = useCallback((productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      persistCart(updated);
      return updated;
    });
  }, [persistCart]);

  const handleMoveToCart = useCallback((product: Product) => {
    handleAddToCart(product, 1);
    handleRemoveFromWishlist(product.id);
  }, [handleAddToCart, handleRemoveFromWishlist]);

  // Computed Cart metrics
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, curr) => {
      const prod = products.find((p) => p.id === curr.id);
      return acc + (prod ? prod.price * curr.quantity : 0);
    }, 0);
  }, [cart, products]);

  const cartTotalXp = useMemo(() => {
    return cart.reduce((acc, curr) => {
      const prod = products.find((p) => p.id === curr.id);
      return acc + (prod ? prod.xpBonus * curr.quantity : 0);
    }, 0);
  }, [cart, products]);

  // Computed Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Category Pill Selection Handler
  const handleSelectPill = useCallback((pillId: string) => {
    setActivePill(pillId);
    if (pillId === 'all') {
      setSelectedPlanet('all');
      setSelectedType('all');
      setSearchTerm('');
    } else if (['bestsellers', 'new', 'deals'].includes(pillId)) {
      setSelectedPlanet('all');
    } else if (pillId === 'format-book') {
      setSelectedType('Storybook');
    } else if (pillId === 'format-game') {
      setSelectedType('Family Game');
    } else {
      setSelectedPlanet(pillId);
    }
  }, []);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search term filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(q);
        const matchPlanet = product.planetName.toLowerCase().includes(q);
        const matchType = product.productType.toLowerCase().includes(q);
        const matchDesc = product.shortDescription.toLowerCase().includes(q);
        const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
        const matchSku = product.sku ? product.sku.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchPlanet && !matchType && !matchDesc && !matchTags && !matchSku) {
          return false;
        }
      }

      // Planet / Category filter
      if (selectedPlanet !== 'all') {
        const catLower = (product.category || '').toLowerCase();
        const planetLower = (product.planetName || '').toLowerCase();
        const filterLower = selectedPlanet.toLowerCase();
        const isDirectCategoryMatch = catLower === filterLower;
        const isPlanetMatch = planetLower === filterLower || planetLower.includes(filterLower);
        if (!isDirectCategoryMatch && !isPlanetMatch) {
          return false;
        }
      }

      // Age filter
      if (selectedAge !== 'all' && product.ageGroup !== selectedAge) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && product.productType !== selectedType) {
        return false;
      }

      // Active Pill Special Filters
      if (activePill === 'bestsellers' && !product.isBestSeller) {
        return false;
      }
      if (activePill === 'new' && !product.isNew) {
        return false;
      }
      if (activePill === 'deals' && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'xp-desc') return b.xpBonus - a.xpBonus;
      return 0; // featured default
    });
  }, [products, searchTerm, selectedPlanet, selectedAge, selectedType, activePill, sortBy]);

  // Clear single or all filters
  const handleClearFilter = useCallback((key: 'planet' | 'age' | 'type' | 'search' | 'all') => {
    if (key === 'planet' || key === 'all') setSelectedPlanet('all');
    if (key === 'age' || key === 'all') setSelectedAge('all');
    if (key === 'type' || key === 'all') setSelectedType('all');
    if (key === 'search' || key === 'all') setSearchTerm('');
    if (key === 'all') setActivePill('all');
  }, []);

  // Taxonomy Selection Handler
  const handleSelectCategoryFromDrawer = useCallback((filter: { planet?: string; age?: string; type?: string; special?: string }) => {
    if (filter.planet) {
      setSelectedPlanet(filter.planet);
      setActivePill(filter.planet);
    }
    if (filter.age) setSelectedAge(filter.age);
    if (filter.type) setSelectedType(filter.type);
    if (filter.special) {
      setActivePill(filter.special);
    }
  }, []);

  // Checkout submission
  const handleSubmitOrder = async (
    e: React.FormEvent,
    paymentMethod: 'cod' | 'payzone' = 'cod',
    cndpConsent: boolean = true,
    appliedCoupon?: Coupon | null,
    discountAmount: number = 0
  ) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid email is required';
    }
    if (!formData.address.trim()) errors.address = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const orderItems = cart.map((item) => {
      const prod = products.find((p) => p.id === item.id);
      return {
        productId: item.id,
        productTitle: prod?.title || 'AbtalQuest Learning Kit',
        quantity: item.quantity,
        unitPrice: prod?.price || 24.99,
        xpBonus: (prod?.xpBonus || 300) * item.quantity,
      };
    });

    const effectiveTotal = Math.max(0, Math.round((cartSubtotal - discountAmount) * 100) / 100);

    const baseOrderPayload = {
      userId: user?.id,
      customerName: formData.name,
      customerEmail: formData.email,
      shippingAddress: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
      items: orderItems,
      subtotal: cartSubtotal,
      shippingCost: 0, // Free shipping standard
      totalAmount: effectiveTotal,
      totalXp: cartTotalXp,
      cndpConsent,
      couponCode: appliedCoupon?.code,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
    };

    if (paymentMethod === 'payzone') {
      // Direct user to hosted 3D Secure / CMI simulation gateway
      setPendingPayzoneInput(baseOrderPayload);
      setIsCheckoutOpen(false);
      setIsPayzoneModalOpen(true);
      return;
    }

    // Cash on Delivery flow: immediate persistence
    setSubmittingOrder(true);
    try {
      const confirmation = await placeOrder({
        ...baseOrderPayload,
        paymentMethod: 'cod',
        paymentStatus: 'pending_cod',
      });

      // Increment coupon usage if promo applied
      if (appliedCoupon?.code) {
        incrementCouponUsage(appliedCoupon.code).catch((err) => {
          console.warn('Coupon increment error:', err);
        });
      }

      // Clear cart upon successful confirmation
      persistCart([]);
      setIsCheckoutOpen(false);
      setOrderConfirmation(confirmation);
    } catch (err) {
      console.error('Failed to submit order:', err);
      alert('Could not record order. Please verify your connection.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Payzone Tokenized Success Handler
  const handlePayzoneSuccess = async (result: {
    token: string;
    paymentRef: string;
    cardBrand: string;
    last4: string;
  }) => {
    if (!pendingPayzoneInput) return;
    setSubmittingOrder(true);

    try {
      const confirmation = await placeOrder({
        ...pendingPayzoneInput,
        paymentMethod: 'payzone',
        paymentStatus: 'paid',
        paymentToken: result.token,
        paymentRef: result.paymentRef,
      });

      // Increment coupon usage if promo applied
      if (pendingPayzoneInput.couponCode) {
        incrementCouponUsage(pendingPayzoneInput.couponCode).catch((err) => {
          console.warn('Coupon increment error:', err);
        });
      }

      persistCart([]);
      setIsPayzoneModalOpen(false);
      setPendingPayzoneInput(null);
      setOrderConfirmation(confirmation);
    } catch (err) {
      console.error('Failed to finalize Payzone order:', err);
      alert('Transaction authorized but could not record order. Please contact support.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Active selected product for the dedicated product page
  const activeProduct = useMemo(() => {
    if (!activeProductId) return null;
    return products.find((p) => p.id === activeProductId) || null;
  }, [activeProductId, products]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-body flex flex-col">
      
      {/* 1. Header & Search Experience */}
      <MarketplaceHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        products={products}
        onSelectProduct={handleSelectProduct}
        onOpenTaxonomy={() => setIsTaxonomyOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        user={user}
        onOpenAuth={onOpenAuth}
        isLiveSupabase={isFromSupabase}
      />

      {/* Main Content Body: Dedicated Product Page or Catalog Feed */}
      {activeProduct ? (
        <main className="flex-1 w-full">
          <MarketplaceProductDetailPage
            product={activeProduct}
            allProducts={products}
            onBackToMarketplace={() => handleSelectProduct(null)}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(activeProduct.id)}
          />
        </main>
      ) : (
        <main className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 flex-1 w-full">
          {/* 2. Promotional Banners Carousel */}
          <MarketplaceBannerCarousel
            onFilterPlanet={(planet) => {
              setSelectedPlanet(planet);
              setActivePill(planet);
            }}
          />

          {/* 3. Horizontal Category Pills Selector */}
          <MarketplaceCategoryPills
            activePill={activePill}
            onSelectPill={handleSelectPill}
            totalProductsCount={products.length}
            categories={categories}
            categoryCounts={categoryCounts}
          />

          {/* 4. Product Grid & Instant Sorting */}
          <MarketplaceProductGrid
            products={filteredProducts}
            isLoading={loadingProducts}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={{
              planet: selectedPlanet,
              age: selectedAge,
              type: selectedType,
              search: searchTerm,
            }}
            onClearFilter={handleClearFilter}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            cartIds={cart.map((c) => c.id)}
          />
        </main>
      )}

      {/* 5. Slide-Out Taxonomy Drawer */}
      <MarketplaceTaxonomyDrawer
        isOpen={isTaxonomyOpen}
        onClose={() => setIsTaxonomyOpen(false)}
        onSelectCategory={handleSelectCategoryFromDrawer}
        activePlanet={selectedPlanet}
        activeAge={selectedAge}
        activeType={selectedType}
      />

      {/* 6. Slide-Out Wishlist Drawer */}
      <MarketplaceWishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlistIds}
        products={products}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* 7. Slide-Out Cart Drawer */}
      <MarketplaceCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onSelectProduct={handleSelectProduct}
      />

      {/* 8. Checkout Modal */}
      <MarketplaceCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        user={user}
        onOpenAuth={onOpenAuth}
        cartTotalCount={totalCartCount}
        cartSubtotal={cartSubtotal}
        cartTotalXp={cartTotalXp}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        submittingOrder={submittingOrder}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* 8.5 Payzone Hosted 3D Secure / CMI Modal */}
      <PayzoneHostedModal
        isOpen={isPayzoneModalOpen}
        onClose={() => {
          setIsPayzoneModalOpen(false);
          setIsCheckoutOpen(true);
        }}
        orderTotal={pendingPayzoneInput?.totalAmount || cartSubtotal}
        customerName={pendingPayzoneInput?.customerName || formData.name}
        customerEmail={pendingPayzoneInput?.customerEmail || formData.email}
        onPaymentSuccess={handlePayzoneSuccess}
      />

      {/* 9. Order Confirmation Modal */}
      <MarketplaceConfirmationModal
        orderConfirmation={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />

      {/* 10. E-Commerce Marketplace Footer */}
      <MarketplaceFooter
        onFilterPlanet={(planet) => {
          setSelectedPlanet(planet);
          setActivePill(planet);
        }}
      />

    </div>
  );
};

export default Marketplace;
