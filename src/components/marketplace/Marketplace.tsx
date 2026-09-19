import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  type Product, 
  DEFAULT_PRODUCTS,
  fetchMarketplaceProducts, 
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
import { MarketplaceHeader } from './MarketplaceHeader';
import { MarketplaceBannerCarousel } from './MarketplaceBannerCarousel';
import { MarketplaceCategoryPills } from './MarketplaceCategoryPills';
import { MarketplaceProductGrid } from './MarketplaceProductGrid';
import { MarketplaceProductDetailModal } from './MarketplaceProductDetailModal';
import { MarketplaceTaxonomyDrawer } from './MarketplaceTaxonomyDrawer';
import { MarketplaceWishlistDrawer } from './MarketplaceWishlistDrawer';
import { MarketplaceCartDrawer } from './MarketplaceCartDrawer';
import { MarketplaceCheckoutModal, type CheckoutFormData } from './MarketplaceCheckoutModal';
import { MarketplaceConfirmationModal } from './MarketplaceConfirmationModal';
import { MarketplaceFooter } from './MarketplaceFooter';

export interface MarketplaceProps {
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ user, onOpenAuth }) => {
  // Products and database health state
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    country: 'United States',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  // Load products and health from Supabase on mount
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
        console.warn('Error loading products:', err);
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

  // Category Pill Selection Handler
  const handleSelectPill = useCallback((pillId: string) => {
    setActivePill(pillId);
    if (pillId === 'all') {
      setSelectedPlanet('all');
      setSelectedType('all');
      setSearchTerm('');
    } else if (['thinkers', 'brave', 'solvers', 'heart'].includes(pillId)) {
      setSelectedPlanet(pillId);
    } else if (pillId === 'format-book') {
      setSelectedType('Storybook');
    } else if (pillId === 'format-game') {
      setSelectedType('Family Game');
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

      // Planet filter
      if (selectedPlanet !== 'all' && product.category !== selectedPlanet) {
        return false;
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
  const handleSubmitOrder = async (e: React.FormEvent) => {
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
    setSubmittingOrder(true);

    try {
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
        shippingCost: 0, // Free shipping standard
        totalAmount: cartSubtotal,
        totalXp: cartTotalXp,
      });

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-body">
      
      {/* 1. Header & Search Experience */}
      <MarketplaceHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        products={products}
        onSelectProduct={setSelectedProduct}
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

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlistIds={wishlistIds}
          cartIds={cart.map((c) => c.id)}
        />

      </main>

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
        onSelectProduct={setSelectedProduct}
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
        onSelectProduct={setSelectedProduct}
      />

      {/* 8. Product Detail Modal */}
      <MarketplaceProductDetailModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, qty) => handleAddToCart(product, qty)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onSelectRelatedProduct={(related) => setSelectedProduct(related)}
      />

      {/* 9. Checkout Modal */}
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

      {/* 10. Order Confirmation Modal */}
      <MarketplaceConfirmationModal
        orderConfirmation={orderConfirmation}
        onClose={() => setOrderConfirmation(null)}
      />

      {/* 11. E-Commerce Marketplace Footer */}
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
