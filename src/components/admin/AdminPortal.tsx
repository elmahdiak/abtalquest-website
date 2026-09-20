import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Package, 
  MessageSquare, 
  BarChart3, 
  LogOut, 
  Search, 
  Clock, 
  AlertCircle, 
  Coins, 
  Sparkles, 
  Users, 
  ArrowUpRight, 
  Mail, 
  ExternalLink,
  Loader2,
  X,
  Crown,
  UserPlus,
  Trash2,
  Shield,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
  Database,
  Copy,
  Check,
  Plus,
  Edit3,
  Tag,
  UploadCloud,
  Layers,
  CheckCircle
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { 
  getStoredWhatsAppPosition, 
  setStoredWhatsAppPosition, 
  type WhatsAppPosition 
} from '../../utils/whatsapp';
import { 
  signInUser, 
  signOutUser, 
  getCurrentUser, 
  verifyIsAdmin,
  isSuperAdmin,
  getAdminUsersList,
  createAdminAccountBySuperAdmin,
  removeAdminAccountBySuperAdmin,
  requestPasswordReset,
  verifyPasswordResetCode,
  completePasswordReset,
  SUPER_ADMIN_EMAIL,
  type AdminUserRecord
} from '../../services/authService';
import { 
  getAllOrdersForAdmin, 
  updateOrderStatus, 
  syncUnsavedOrdersToSupabase,
  checkOrdersDatabaseHealth,
  ORDERS_SCHEMA_SQL,
  type DatabaseHealth,
  getContactMessagesForAdmin, 
  updateContactMessageStatus, 
  getSiteMetrics,
  fetchMarketplaceProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  DEFAULT_CATEGORIES,
  formatPrice,
  type AdminOrder,
  type ContactMessage,
  type SiteMetrics,
  type Product,
  type ProductCategory
} from '../../services/marketplaceService';
import type { User } from '@supabase/supabase-js';

export interface AdminPortalProps {
  onClose?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);

  // Admin Password Recovery state
  const [adminAuthMode, setAdminAuthMode] = useState<'signin' | 'forgot_password' | 'verify_code' | 'new_password'>('signin');
  const [recoveryEmail, setRecoveryEmail] = useState<string>('akmahdi085@gmail.com');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState<string>('');
  const [recoveryConfirmPassword, setRecoveryConfirmPassword] = useState<string>('');
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'messages' | 'analytics' | 'team' | 'settings'>('orders');
  const [whatsappPosition, setWhatsappPosition] = useState<WhatsAppPosition>(getStoredWhatsAppPosition);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Products & Inventory state
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingProductSubmitting, setDeletingProductSubmitting] = useState<boolean>(false);

  // Product Form state
  const [prodTitle, setProdTitle] = useState<string>('');
  const [prodSku, setProdSku] = useState<string>('');
  const [prodCategory, setProdCategory] = useState<string>('thinkers');
  const [prodPlanetName, setProdPlanetName] = useState<string>("Thinkers' Planet");
  const [prodProductType, setProdProductType] = useState<string>('Physical Kit');
  const [prodAgeGroup, setProdAgeGroup] = useState<string>('9-11');
  const [prodAgeLabel, setProdAgeLabel] = useState<string>('Ages 9–11');
  const [prodPrice, setProdPrice] = useState<string>('299');
  const [prodOriginalPrice, setProdOriginalPrice] = useState<string>('');
  const [prodDiscountPercent, setProdDiscountPercent] = useState<string>('0');
  const [prodStockCount, setProdStockCount] = useState<string>('15');
  const [prodInStock, setProdInStock] = useState<boolean>(true);
  const [prodIsBestSeller, setProdIsBestSeller] = useState<boolean>(false);
  const [prodIsNew, setProdIsNew] = useState<boolean>(false);
  const [prodXpBonus, setProdXpBonus] = useState<string>('300');
  const [prodShortDesc, setProdShortDesc] = useState<string>('');
  const [prodFullDesc, setProdFullDesc] = useState<string>('');
  const [prodImageUrl, setProdImageUrl] = useState<string>('');
  const [prodTags, setProdTags] = useState<string>('');
  const [prodSafetyGuidelines, setProdSafetyGuidelines] = useState<string>('');
  const [uploadingProdImage, setUploadingProdImage] = useState<boolean>(false);
  const [prodSubmitting, setProdSubmitting] = useState<boolean>(false);
  const [prodModalError, setProdModalError] = useState<string | null>(null);

  // Categories & Planets state
  const [categoriesList, setCategoriesList] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);
  const [deletingCategorySubmitting, setDeletingCategorySubmitting] = useState<boolean>(false);
  const [deletingCategoryError, setDeletingCategoryError] = useState<string | null>(null);

  // Category Form state
  const [catName, setCatName] = useState<string>('');
  const [catSlug, setCatSlug] = useState<string>('');
  const [catPlanetName, setCatPlanetName] = useState<string>('');
  const [catAccentColor, setCatAccentColor] = useState<string>('#016ba5');
  const [catIcon, setCatIcon] = useState<string>('Sparkles');
  const [catDescription, setCatDescription] = useState<string>('');
  const [catSubmitting, setCatSubmitting] = useState<boolean>(false);
  const [catModalError, setCatModalError] = useState<string | null>(null);

  // Super Admin: Team Management state
  const [adminList, setAdminList] = useState<AdminUserRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState<boolean>(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false);
  const [newAdminFullName, setNewAdminFullName] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [newAdminRole, setNewAdminRole] = useState<'manager' | 'admin' | 'support_admin'>('manager');
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);
  const [adminActionSubmitting, setAdminActionSubmitting] = useState<boolean>(false);

  // Orders filters
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [syncingOrders, setSyncingOrders] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  // Messages filters
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // 1. Initial auth check
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        if (user && mounted) {
          const authorized = await verifyIsAdmin(user);
          setCurrentUser(user);
          setIsAdmin(authorized);
        }
      } catch (err) {
        console.warn('Auth check failed:', err);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for dispatched email events for auto-fill assistance during testing
  useEffect(() => {
    const handleDispatched = (e: Event) => {
      const customEvt = e as CustomEvent<{ code?: string; type?: string; toEmail?: string }>;
      if (customEvt.detail?.code) {
        setDispatchedCode(customEvt.detail.code);
      }
    };
    window.addEventListener('abtalquest:email_dispatched', handleDispatched);
    return () => window.removeEventListener('abtalquest:email_dispatched', handleDispatched);
  }, []);

  // Load team administrators (Super Admin)
  const loadAdmins = async () => {
    setLoadingAdmins(true);
    try {
      const list = await getAdminUsersList();
      setAdminList(list);
    } catch (err) {
      console.warn('Error loading admins:', err);
    } finally {
      setLoadingAdmins(false);
    }
  };

  // 2. Load dashboard data when admin is authenticated
  const loadDashboardData = async (force = false) => {
    if (force) setLoadingData(true);
    try {
      const [ordersList, messagesList, siteStats, health, productsData, loadedCategories] = await Promise.all([
        getAllOrdersForAdmin(),
        getContactMessagesForAdmin(),
        getSiteMetrics(),
        checkOrdersDatabaseHealth(),
        fetchMarketplaceProducts(),
        fetchCategories(),
      ]);

      setOrders(ordersList);
      setMessages(messagesList);
      setMetrics(siteStats);
      setDbHealth(health);
      setProductsList(productsData.products);
      setCategoriesList(loadedCategories);
    } catch (err) {
      console.warn('Dashboard data load error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(ORDERS_SCHEMA_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      setCopiedSql(false);
    }
  };

  // Product CRUD Action Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdSku(`AQ-${(categoriesList[0]?.slug || 'THK').toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`);
    setProdCategory(categoriesList[0]?.id || 'thinkers');
    setProdPlanetName(categoriesList[0]?.planetName || "Thinkers' Planet");
    setProdProductType('Physical Kit');
    setProdAgeGroup('9-11');
    setProdAgeLabel('Ages 9–11');
    setProdPrice('299');
    setProdOriginalPrice('399');
    setProdDiscountPercent('25');
    setProdStockCount('15');
    setProdInStock(true);
    setProdIsBestSeller(false);
    setProdIsNew(true);
    setProdXpBonus('350');
    setProdShortDesc('');
    setProdFullDesc('');
    setProdImageUrl('');
    setProdTags('STEM, Physical Kit, Birchwood');
    setProdSafetyGuidelines('100% sustainably harvested natural birchwood\nSmooth hand-sanded edges with zero splinter hazards\nChild-safe non-toxic organic vegetable stain');
    setProdModalError(null);
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdTitle(prod.title);
    setProdSku(prod.sku || '');
    setProdCategory(prod.category);
    setProdPlanetName(prod.planetName);
    setProdProductType(prod.productType);
    setProdAgeGroup(prod.ageGroup);
    setProdAgeLabel(prod.ageLabel);
    setProdPrice(String(prod.price));
    setProdOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setProdDiscountPercent(String(prod.discountPercent || 0));
    setProdStockCount(String(prod.stockCount !== undefined ? prod.stockCount : 15));
    setProdInStock(prod.inStock !== false);
    setProdIsBestSeller(Boolean(prod.isBestSeller));
    setProdIsNew(Boolean(prod.isNew));
    setProdXpBonus(String(prod.xpBonus || 0));
    setProdShortDesc(prod.shortDescription || '');
    setProdFullDesc(prod.fullDescription || '');
    setProdImageUrl(prod.images && prod.images.length > 0 ? prod.images[0] : '');
    setProdTags(Array.isArray(prod.tags) ? prod.tags.join(', ') : '');
    setProdSafetyGuidelines(Array.isArray(prod.safetyGuidelines) ? prod.safetyGuidelines.join('\n') : '');
    setProdModalError(null);
    setShowProductModal(true);
  };

  const handleProdCategoryChange = (newCat: string) => {
    setProdCategory(newCat);
    const matched = categoriesList.find((c) => c.id === newCat || c.slug === newCat);
    if (matched?.planetName) {
      setProdPlanetName(matched.planetName);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProdImage(true);
    try {
      const url = await uploadProductImage(file);
      setProdImageUrl(url);
    } catch (err: any) {
      setProdModalError('Failed to upload image: ' + (err?.message || 'Unknown error'));
    } finally {
      setUploadingProdImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      setProdModalError('Product title is required');
      return;
    }
    const numPrice = parseFloat(prodPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      setProdModalError('A valid non-negative price is required');
      return;
    }

    setProdSubmitting(true);
    setProdModalError(null);

    try {
      const tagsArray = prodTags.split(',').map((t) => t.trim()).filter(Boolean);
      const safetyArray = prodSafetyGuidelines.split('\n').map((s) => s.trim()).filter(Boolean);
      const numOriginal = prodOriginalPrice ? parseFloat(prodOriginalPrice) : undefined;
      const numDiscount = prodDiscountPercent ? parseInt(prodDiscountPercent, 10) : 0;
      const numStock = prodStockCount ? parseInt(prodStockCount, 10) : 15;
      const numXp = prodXpBonus ? parseInt(prodXpBonus, 10) : 300;

      const productData: Partial<Product> = {
        title: prodTitle.trim(),
        sku: prodSku.trim() || undefined,
        category: prodCategory,
        planetName: prodPlanetName.trim() || 'AbtalQuest Universe',
        productType: prodProductType,
        ageGroup: prodAgeGroup,
        ageLabel: prodAgeLabel.trim() || `Ages ${prodAgeGroup}`,
        price: numPrice,
        originalPrice: numOriginal,
        discountPercent: numDiscount,
        stockCount: numStock,
        inStock: prodInStock && numStock > 0,
        isBestSeller: prodIsBestSeller,
        isNew: prodIsNew,
        xpBonus: numXp,
        shortDescription: prodShortDesc.trim(),
        fullDescription: prodFullDesc.trim(),
        tags: tagsArray,
        safetyGuidelines: safetyArray,
        images: prodImageUrl.trim() ? [prodImageUrl.trim()] : [],
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData as any);
      }

      const refreshed = await fetchMarketplaceProducts();
      setProductsList(refreshed.products);
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err: any) {
      setProdModalError(err?.message || 'Failed to save product');
    } finally {
      setProdSubmitting(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    setDeletingProductSubmitting(true);
    try {
      await deleteProduct(deletingProduct.id);
      const refreshed = await fetchMarketplaceProducts();
      setProductsList(refreshed.products);
      setDeletingProduct(null);
    } catch (err: any) {
      console.warn('Failed to delete product:', err);
    } finally {
      setDeletingProductSubmitting(false);
    }
  };

  // Category CRUD Action Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatPlanetName('');
    setCatAccentColor('#016ba5');
    setCatIcon('Sparkles');
    setCatDescription('');
    setCatModalError(null);
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatPlanetName(cat.planetName || cat.name);
    setCatAccentColor(cat.accentColor || '#016ba5');
    setCatIcon(cat.icon || 'Sparkles');
    setCatDescription(cat.description || '');
    setCatModalError(null);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      setCatModalError('Category name is required');
      return;
    }
    const generatedSlug = (catSlug.trim() || catName.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    setCatSubmitting(true);
    setCatModalError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: catName.trim(),
          slug: generatedSlug,
          planetName: catPlanetName.trim() || catName.trim(),
          accentColor: catAccentColor || '#016ba5',
          icon: catIcon || 'Sparkles',
          description: catDescription.trim(),
        });
      } else {
        await createCategory({
          id: generatedSlug,
          name: catName.trim(),
          slug: generatedSlug,
          planetName: catPlanetName.trim() || catName.trim(),
          accentColor: catAccentColor || '#016ba5',
          icon: catIcon || 'Sparkles',
          description: catDescription.trim(),
        });
      }

      const refreshed = await fetchCategories();
      setCategoriesList(refreshed);
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (err: any) {
      setCatModalError(err?.message || 'Failed to save category');
    } finally {
      setCatSubmitting(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setDeletingCategorySubmitting(true);
    setDeletingCategoryError(null);
    try {
      const countAssigned = productsList.filter(
        (p) => p.category === deletingCategory.id || p.category === deletingCategory.slug
      ).length;

      if (countAssigned > 0) {
        setDeletingCategoryError(
          `Cannot delete "${deletingCategory.name}" because ${countAssigned} product(s) are assigned to it. Please reassign or delete them first.`
        );
        setDeletingCategorySubmitting(false);
        return;
      }

      await deleteCategory(deletingCategory.id);
      const refreshed = await fetchCategories();
      setCategoriesList(refreshed);
      setDeletingCategory(null);
    } catch (err: any) {
      setDeletingCategoryError(err?.message || 'Failed to delete category');
    } finally {
      setDeletingCategorySubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isAdmin) {
      void (async () => {
        if (!isMounted) return;
        await loadDashboardData();
        if (currentUser && isSuperAdmin(currentUser)) {
          await loadAdmins();
        }
      })();
    }
    return () => {
      isMounted = false;
    };
  }, [isAdmin, currentUser]);

  // 3. Real-time synchronizer for orders across tabs & frontend actions
  useEffect(() => {
    if (!isAdmin) return;

    const handleOrderEvent = () => {
      void loadDashboardData(false);
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'abtalquest_orders_history' || e.key === 'abtalquest_contact_messages') {
        void loadDashboardData(false);
      }
    };

    window.addEventListener('abtalquest_order_created', handleOrderEvent);
    window.addEventListener('abtalquest_order_status_updated', handleOrderEvent);
    window.addEventListener('abtalquest_product_updated', handleOrderEvent);
    window.addEventListener('abtalquest_category_updated', handleOrderEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('abtalquest_order_created', handleOrderEvent);
      window.removeEventListener('abtalquest_order_status_updated', handleOrderEvent);
      window.removeEventListener('abtalquest_product_updated', handleOrderEvent);
      window.removeEventListener('abtalquest_category_updated', handleOrderEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [isAdmin]);

  // Handle manual Supabase synchronization
  const handleManualSync = async () => {
    setSyncingOrders(true);
    setSyncFeedback(null);
    try {
      const count = await syncUnsavedOrdersToSupabase(orders);
      await loadDashboardData(false);
      if (count > 0) {
        setSyncFeedback(`Successfully synced ${count} order${count > 1 ? 's' : ''} to Supabase!`);
      } else {
        setSyncFeedback('All orders are synchronized with Supabase.');
      }
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setSyncFeedback('Sync complete.');
      setTimeout(() => setSyncFeedback(null), 3000);
    } finally {
      setSyncingOrders(false);
    }
  };

  // Handle Admin Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      const { user, error } = await signInUser(loginEmail, loginPassword);
      if (error || !user) {
        setAuthError(error || 'Invalid credentials');
        setAuthSubmitting(false);
        return;
      }

      const authorized = await verifyIsAdmin(user);
      if (!authorized) {
        setAuthError('Access restricted: Account does not have verified administrator privileges.');
        await signOutUser();
        setAuthSubmitting(false);
        return;
      }

      setCurrentUser(user);
      setIsAdmin(true);
      if (isSuperAdmin(user)) {
        await loadAdmins();
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Request Admin Password Reset
  const handleRequestAdminReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setRecoverySuccess(null);
    setAuthSubmitting(true);

    try {
      const res = await requestPasswordReset(recoveryEmail);
      if (!res.success) {
        setAuthError(res.error || 'Failed to dispatch verification code.');
        setAuthSubmitting(false);
        return;
      }
      if (res.code) {
        setDispatchedCode(res.code);
      }
      setRecoverySuccess(`A 6-digit security code has been dispatched to ${recoveryEmail}.`);
      setAdminAuthMode('verify_code');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Reset request failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Verify Admin Reset Code
  const handleVerifyAdminCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setRecoverySuccess(null);
    setAuthSubmitting(true);

    try {
      const res = await verifyPasswordResetCode(recoveryEmail, recoveryCode);
      if (!res.success) {
        setAuthError(res.error || 'Invalid or expired 6-digit security code.');
        setAuthSubmitting(false);
        return;
      }
      setRecoverySuccess('Security code verified! You may now set your new password.');
      setAdminAuthMode('new_password');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Code verification failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Complete Admin Reset with New Password
  const handleCompleteAdminReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setRecoverySuccess(null);

    if (recoveryNewPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    if (recoveryNewPassword !== recoveryConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthSubmitting(true);
    try {
      const res = await completePasswordReset(recoveryEmail, recoveryNewPassword);
      if (!res.success) {
        setAuthError(res.error || 'Failed to update password.');
        setAuthSubmitting(false);
        return;
      }

      // Automatically sign in with the new password
      const { user, error } = await signInUser(recoveryEmail, recoveryNewPassword);
      if (!error && user) {
        const authorized = await verifyIsAdmin(user);
        if (authorized) {
          setCurrentUser(user);
          setIsAdmin(true);
          if (isSuperAdmin(user)) {
            await loadAdmins();
          }
          return;
        }
      }

      setLoginEmail(recoveryEmail);
      setLoginPassword(recoveryNewPassword);
      setRecoverySuccess('Password successfully reset! You may now sign in.');
      setAdminAuthMode('signin');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle Super Admin creating a new administrator account
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminActionError(null);
    setAdminActionSuccess(null);
    setAdminActionSubmitting(true);

    const res = await createAdminAccountBySuperAdmin(
      {
        fullName: newAdminFullName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: newAdminRole,
      },
      currentUser
    );

    if (!res.success) {
      setAdminActionError(res.error || 'Failed to provision administrator.');
      setAdminActionSubmitting(false);
      return;
    }

    setAdminActionSuccess(`Administrator "${newAdminFullName}" provisioned successfully!`);
    setNewAdminFullName('');
    setNewAdminEmail('');
    setNewAdminPassword('');
    setAdminActionSubmitting(false);
    setShowAddAdminModal(false);
    await loadAdmins();
  };

  // Handle Super Admin revoking an administrator account
  const handleRevokeAdmin = async (emailToRevoke: string) => {
    if (!window.confirm(`Are you sure you want to revoke admin access for "${emailToRevoke}"?`)) {
      return;
    }

    const res = await removeAdminAccountBySuperAdmin(emailToRevoke, currentUser);
    if (!res.success) {
      alert(res.error || 'Failed to revoke administrator.');
      return;
    }

    await loadAdmins();
  };

  // Safely exit admin mode, remove any secret hashes or query params from URL, and return to public website
  const handleExitAdmin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onClose) {
      onClose();
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('mode');
      url.searchParams.delete('portal');
      url.searchParams.delete('admin');
      url.searchParams.delete('secret');
      url.hash = '#universe';
      window.history.replaceState({}, '', url.pathname + '#universe');
      window.dispatchEvent(new Event('hashchange'));
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setIsAdmin(false);
    handleExitAdmin();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: AdminOrder['status']) => {
    const ok = await updateOrderStatus(orderId, status);
    if (ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    }
  };

  const handleToggleMessageStatus = async (messageId: string, currentStatus: ContactMessage['status']) => {
    const nextStatus: ContactMessage['status'] = currentStatus === 'unread' ? 'read' : 'unread';
    const ok = await updateContactMessageStatus(messageId, nextStatus);
    if (ok) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, status: nextStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: nextStatus });
      }
    }
  };

  const handleUpdateWhatsAppPosition = (newPos: WhatsAppPosition) => {
    setWhatsappPosition(newPos);
    setStoredWhatsAppPosition(newPos);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const orderId = String(o.id || o.orderId || '').toLowerCase();
    const customerName = String(o.customerName || '').toLowerCase();
    const customerEmail = String(o.customerEmail || '').toLowerCase();
    const search = (orderSearch || '').trim().toLowerCase();

    const matchesSearch =
      !search ||
      orderId.includes(search) ||
      customerName.includes(search) ||
      customerEmail.includes(search);

    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered messages
  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'all') return true;
    return m.status === messageFilter;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#fa8221] animate-spin mb-2" />
        <span className="ml-3 font-headline text-sm font-bold">Verifying Administrator Access...</span>
      </div>
    );
  }

  // View 1: Hidden Login & Provisioning Interface
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex flex-col justify-between p-3 sm:p-8 w-full max-w-full overflow-x-hidden">
        <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <AbtalQuestLogo 
              variant="dark" 
              size="sm" 
              showText={true} 
              clickable={true} 
              href="#universe" 
              onClick={handleExitAdmin}
            />
            <span className="hidden sm:inline font-headline text-xs font-bold uppercase tracking-widest text-slate-400 border-l border-slate-700 pl-3">
              Internal Administration Portal
            </span>
          </div>

          <button
            type="button"
            onClick={handleExitAdmin}
            className="font-headline text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Return to Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </header>

        <main className="max-w-md mx-auto w-full py-12">
          <div className="bg-[#1C1C1C] rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            {/* Ambient indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#016ba5] via-[#fa8221] to-[#7C3AED]" />

            {adminAuthMode === 'signin' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#016ba5]/20 text-[#38BDF8] flex items-center justify-center mb-6 border border-[#016ba5]/30">
                  <Lock className="w-6 h-6" />
                </div>

                <h2 className="font-headline text-2xl font-black text-white mb-2">
                  Administrator Sign In
                </h2>
                
                <p className="font-body text-xs text-slate-400 mb-6">
                  Confidential AbtalQuest Admin Portal • Authorized administrator credentials required.
                </p>

                {recoverySuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs font-body text-emerald-300 mb-5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{recoverySuccess}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-300 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-300 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="akmahdi085@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-headline font-bold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminAuthMode('forgot_password');
                          setRecoveryEmail(loginEmail || SUPER_ADMIN_EMAIL);
                          setAuthError(null);
                          setRecoverySuccess(null);
                        }}
                        className="text-[11px] font-headline font-semibold text-[#fa8221] hover:text-orange-300 transition-colors flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Forgot Password?</span>
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={authSubmitting}
                      icon={authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      {authSubmitting ? 'Authenticating...' : 'Sign In as Admin'}
                    </Button>
                  </div>
                </form>
              </>
            )}

            {adminAuthMode === 'forgot_password' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#fa8221]/20 text-[#fa8221] flex items-center justify-center mb-6 border border-[#fa8221]/30">
                  <KeyRound className="w-6 h-6" />
                </div>

                <h2 className="font-headline text-2xl font-black text-white mb-2">
                  Reset Password
                </h2>
                
                <p className="font-body text-xs text-slate-400 mb-6">
                  Enter your registered Super Admin or Administrator email. We will immediately dispatch a secure 6-digit recovery code.
                </p>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-300 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleRequestAdminReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-300 mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="akmahdi085@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#fa8221]"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <Button
                      variant="cta"
                      size="lg"
                      fullWidth
                      disabled={authSubmitting}
                      icon={authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      {authSubmitting ? 'Sending Code...' : 'Send 6-Digit Code'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminAuthMode('signin');
                        setAuthError(null);
                        setRecoverySuccess(null);
                      }}
                      className="w-full py-2 text-xs font-headline font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {adminAuthMode === 'verify_code' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/30">
                  <Mail className="w-6 h-6" />
                </div>

                <h2 className="font-headline text-2xl font-black text-white mb-2">
                  Verify Security Code
                </h2>
                
                <p className="font-body text-xs text-slate-400 mb-4">
                  Enter the 6-digit security code dispatched to <strong className="text-slate-200">{recoveryEmail}</strong>.
                </p>

                {dispatchedCode && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-body text-amber-200 mb-4">
                    <div>
                      <span className="text-[10px] text-amber-400 font-headline font-bold uppercase block">Dispatched Email Code:</span>
                      <strong className="font-mono text-sm tracking-widest text-white">{dispatchedCode}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecoveryCode(dispatchedCode)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-headline font-bold text-[11px] transition-colors"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                {recoverySuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs font-body text-emerald-300 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{recoverySuccess}</span>
                  </div>
                )}

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-300 mb-4">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyAdminCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-300 mb-1 text-center">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={recoveryCode}
                      onChange={(e) => setRecoveryCode(e.target.value.trim().toUpperCase())}
                      placeholder="• • • • • •"
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={authSubmitting || recoveryCode.length < 6}
                      icon={authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      {authSubmitting ? 'Verifying...' : 'Verify Security Code'}
                    </Button>

                    <div className="flex items-center justify-between text-xs font-headline font-semibold pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAdminAuthMode('signin');
                          setAuthError(null);
                          setRecoverySuccess(null);
                        }}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </button>

                      <button
                        type="button"
                        disabled={authSubmitting}
                        onClick={async () => {
                          setAuthError(null);
                          setAuthSubmitting(true);
                          try {
                            const res = await requestPasswordReset(recoveryEmail);
                            if (res.code) setDispatchedCode(res.code);
                            setRecoverySuccess('A fresh code has been sent!');
                          } catch (err) {
                            setAuthError(err instanceof Error ? err.message : 'Resend failed');
                          } finally {
                            setAuthSubmitting(false);
                          }
                        }}
                        className="text-[#38BDF8] hover:text-sky-300 flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend Code</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}

            {adminAuthMode === 'new_password' && (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <h2 className="font-headline text-2xl font-black text-white mb-2">
                  Set New Password
                </h2>
                
                <p className="font-body text-xs text-slate-400 mb-6">
                  Create a secure new password (min. 6 characters) for your administrator account.
                </p>

                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-300 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleCompleteAdminReset} className="space-y-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={recoveryNewPassword}
                      onChange={(e) => setRecoveryNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={recoveryConfirmPassword}
                      onChange={(e) => setRecoveryConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={authSubmitting}
                      icon={authSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      {authSubmitting ? 'Updating...' : 'Update Password & Sign In'}
                    </Button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminAuthMode('signin');
                        setAuthError(null);
                        setRecoverySuccess(null);
                      }}
                      className="w-full py-2 text-xs font-headline font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-left">
                <div className="flex items-center gap-1.5 text-purple-300 font-headline font-bold text-xs mb-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary Super Administrator</span>
                </div>
                <p className="font-body text-[11px] text-slate-400 leading-relaxed">
                  Master Owner: <strong className="text-slate-200">ElMahdi Ak</strong> (akmahdi085@gmail.com).
                  New administrator accounts can only be provisioned from within the dashboard by the Super Administrator.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center py-4 font-body text-xs text-slate-500">
          AbtalQuest Security Protocol • Confidential & Protected
        </footer>
      </div>
    );
  }

  // View 2: Full Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col w-full max-w-full overflow-x-hidden">
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#0A2540] text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AbtalQuestLogo 
              variant="dark" 
              size="sm" 
              showText={true} 
              clickable={true} 
              href="#universe" 
              onClick={handleExitAdmin}
            />
            <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-slate-700">
              {isSuperAdmin(currentUser) ? (
                <span className="font-headline text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-amber-400" /> Super Admin (ElMahdi Ak)
                </span>
              ) : currentUser?.user_metadata?.role === 'manager' ? (
                <span className="font-headline text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Manager Console
                </span>
              ) : (
                <span className="font-headline text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Administrator Console
                </span>
              )}
              <span className="font-body text-xs text-slate-400">
                Logged in as <strong className="text-slate-200">{currentUser?.email}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExitAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-headline font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSignOut}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-headline font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Management</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Products Inventory</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {productsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'categories'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories & Planets</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {categoriesList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Messages</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] font-black animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Key Metrics & Analytics</span>
          </button>

          {isSuperAdmin(currentUser) && (
            <button
              onClick={() => {
                setActiveTab('team');
                loadAdmins();
              }}
              className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'team'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Admin Team & Access</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black">
                MASTER
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#fa8221] text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Platform Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {loadingData ? (
          <div className="py-24 text-center">
            <Loader2 className="w-10 h-10 text-[#016ba5] animate-spin mx-auto mb-3" />
            <h4 className="font-headline font-bold text-slate-700">Loading Dashboard Data...</h4>
          </div>
        ) : (
          <>
            {/* ========================================================
                TAB 1: ORDERS MANAGEMENT
               ======================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-headline text-2xl font-black text-slate-900">
                        Customer Orders ({orders.length})
                      </h2>
                      {dbHealth?.ordersTableExists ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Supabase Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Database Schema Pending
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-slate-500 mt-0.5">
                      Manage all kit and quest gear orders placed across the platform from Supabase database.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {syncFeedback && (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-fadeIn flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {syncFeedback}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={syncingOrders || loadingData}
                      onClick={handleManualSync}
                      icon={<RefreshCw className={`w-3.5 h-3.5 ${syncingOrders ? 'animate-spin' : ''}`} />}
                      iconPosition="left"
                    >
                      {syncingOrders ? 'Syncing...' : 'Sync Cloud'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={loadingData}
                      onClick={() => loadDashboardData(true)}
                      icon={<Clock className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Supabase Database Provisioning Notice Banner */}
                {dbHealth && !dbHealth.ordersTableExists && (
                  <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 space-y-3 shadow-sm animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-headline font-black text-sm text-amber-950">
                            Supabase Database Setup Required for Multi-Device Orders
                          </h3>
                          <p className="font-body text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                            The remote Supabase project (<code className="px-1.5 py-0.5 rounded bg-amber-200/60 font-mono text-[11px] font-bold">sdatbzgyqwxburnsjbax</code>) needs the <code className="px-1.5 py-0.5 rounded bg-amber-200/60 font-mono text-[11px] font-bold">public.orders</code> table created in its SQL schema cache so orders can be saved and retrieved across all admin and customer devices.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleCopySql}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-headline text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          {copiedSql ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                          <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                        </button>
                        <a
                          href="https://supabase.com/dashboard/project/sdatbzgyqwxburnsjbax/sql/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-headline text-xs font-bold transition-all shadow-sm"
                        >
                          <span>Open SQL Editor</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-body text-amber-700">
                        Instructions: Open the SQL Editor, paste the copied SQL script, and click <strong>Run</strong>. Then click <strong>Refresh</strong> above.
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSqlModal(true)}
                        className="text-amber-800 underline font-semibold hover:text-amber-950 text-left"
                      >
                        View SQL Migration Script
                      </button>
                    </div>
                  </div>
                )}

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by Order ID, customer name, email..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold capitalize transition-colors ${
                          orderStatusFilter === status
                            ? 'bg-[#016ba5] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  {filteredOrders.length === 0 ? (
                    <div className="py-16 text-center text-slate-500 font-body text-xs">
                      No orders found matching your criteria.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-body">
                        <thead className="bg-slate-50 border-b border-slate-200 font-headline font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="py-3.5 px-4">Order ID & Date</th>
                            <th className="py-3.5 px-4">Customer Details</th>
                            <th className="py-3.5 px-4">Items Summary</th>
                            <th className="py-3.5 px-4">Total & XP</th>
                            <th className="py-3.5 px-4">Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-4 px-4 font-headline">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-slate-900 block">{order.id}</span>
                                  {order.isSupabaseSaved ? (
                                    <span
                                      title="Synced to Supabase Cloud"
                                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    >
                                      Cloud
                                    </span>
                                  ) : (
                                    <span
                                      title="Saved locally on device (pending cloud sync)"
                                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"
                                    >
                                      Local
                                    </span>
                                  )}
                                </div>
                                <span className="font-body text-[11px] text-slate-400">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <strong className="font-headline text-slate-800 block">
                                  {order.customerName}
                                </strong>
                                <span className="text-slate-500 block text-[11px]">{order.customerEmail}</span>
                                <span className="text-slate-400 block text-[10px]">
                                  {order.city ? `${order.city}, ${order.country}` : order.country}
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <span className="text-slate-700 block font-medium">
                                  {(order.items || []).length} item{(order.items || []).length > 1 ? 's' : ''}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">
                                  {(order.items || []).map((i) => `${i.productTitle} (×${i.quantity})`).join(', ')}
                                </span>
                              </td>

                              <td className="py-4 px-4 font-headline">
                                <span className="font-black text-slate-900 block">
                                  {(order.totalAmount || 0).toLocaleString()} MAD
                                </span>
                                <span className="font-gamification text-[#7C3AED] font-bold text-[10px]">
                                  +{(order.totalXp || 0)} XP
                                </span>
                              </td>

                              <td className="py-4 px-4">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(order.id, e.target.value as AdminOrder['status'])
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-xs font-headline font-bold cursor-pointer border ${
                                    order.status === 'delivered'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : order.status === 'shipped'
                                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                                      : order.status === 'processing'
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  <option value="confirmed">Confirmed</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>

                              <td className="py-4 px-4 text-right">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#016ba5] hover:text-white font-headline text-xs font-semibold text-slate-700 transition-colors"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB: PRODUCTS INVENTORY (CRUD)
               ======================================================== */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-headline text-2xl font-black text-slate-900">
                        Products Inventory ({productsList.length})
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#016ba5] border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#016ba5] animate-pulse" />
                        Live Supabase Sync
                      </span>
                    </div>
                    <p className="font-body text-xs text-slate-500 mt-1">
                      Manage official learning kits, storybooks, pricing, discounts, and real-time inventory counts across devices.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => void loadDashboardData(true)}
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={handleOpenAddProduct}
                      icon={<Plus className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Add New Product
                    </Button>
                  </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="font-body text-xs text-slate-500 block mb-1">Total Catalog</span>
                    <span className="font-headline font-black text-2xl text-slate-900">{productsList.length}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="font-body text-xs text-slate-500 block mb-1">In Stock</span>
                    <span className="font-headline font-black text-2xl text-emerald-600">
                      {productsList.filter((p) => p.inStock !== false && (p.stockCount ?? 15) > 0).length}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="font-body text-xs text-slate-500 block mb-1">Low Stock (≤10)</span>
                    <span className="font-headline font-black text-2xl text-amber-500">
                      {productsList.filter((p) => (p.stockCount ?? 15) <= 10 && (p.stockCount ?? 15) > 0).length}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="font-body text-xs text-slate-500 block mb-1">Total Stock Units</span>
                    <span className="font-headline font-black text-2xl text-[#016ba5]">
                      {productsList.reduce((sum, p) => sum + (p.stockCount ?? 15), 0)}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search products by title, SKU, or tags..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 font-body text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-headline font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    >
                      <option value="all">All Categories</option>
                      {categoriesList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={productStockFilter}
                      onChange={(e) => setProductStockFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-headline font-bold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    >
                      <option value="all">All Stock Statuses</option>
                      <option value="in_stock">In Stock (&gt;10)</option>
                      <option value="low_stock">Low Stock (1–10)</option>
                      <option value="out_of_stock">Out of Stock (0)</option>
                    </select>
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  {productsList.length === 0 ? (
                    <div className="py-16 text-center">
                      <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h4 className="font-headline font-bold text-slate-700 mb-1">No Products Found</h4>
                      <p className="font-body text-xs text-slate-400 mb-4">
                        Your product catalog is empty or waiting for initial database sync.
                      </p>
                      <Button variant="cta" size="sm" onClick={handleOpenAddProduct}>
                        Create First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Category & Planet</th>
                            <th className="py-3 px-4">Age / Type</th>
                            <th className="py-3 px-4">Price / XP</th>
                            <th className="py-3 px-4">Stock Level</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {productsList
                            .filter((prod) => {
                              if (productSearch.trim()) {
                                const q = productSearch.toLowerCase();
                                const matchTitle = prod.title.toLowerCase().includes(q);
                                const matchSku = prod.sku ? prod.sku.toLowerCase().includes(q) : false;
                                const matchPlanet = prod.planetName.toLowerCase().includes(q);
                                if (!matchTitle && !matchSku && !matchPlanet) return false;
                              }
                              if (productCategoryFilter !== 'all') {
                                if (prod.category !== productCategoryFilter && prod.planetName !== productCategoryFilter) {
                                  return false;
                                }
                              }
                              const stock = prod.stockCount !== undefined ? prod.stockCount : 15;
                              if (productStockFilter === 'in_stock' && (stock <= 10 || !prod.inStock)) return false;
                              if (productStockFilter === 'low_stock' && (stock > 10 || stock === 0)) return false;
                              if (productStockFilter === 'out_of_stock' && (stock > 0 && prod.inStock !== false)) return false;
                              return true;
                            })
                            .map((prod) => {
                              const stock = prod.stockCount !== undefined ? prod.stockCount : 15;
                              const isLow = stock > 0 && stock <= 10;
                              const isOut = stock === 0 || prod.inStock === false;

                              return (
                                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                                  {/* Product title & SKU */}
                                  <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                                        {prod.images && prod.images.length > 0 ? (
                                          <img
                                            src={prod.images[0]}
                                            alt={prod.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLElement).style.display = 'none';
                                            }}
                                          />
                                        ) : (
                                          <Package className="w-5 h-5 text-slate-400" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-headline font-bold text-slate-900 flex items-center gap-1.5">
                                          <span>{prod.title}</span>
                                          {prod.isBestSeller && (
                                            <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black">
                                              BEST
                                            </span>
                                          )}
                                          {prod.isNew && (
                                            <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800 text-[9px] font-black">
                                              NEW
                                            </span>
                                          )}
                                        </div>
                                        <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                                          SKU: {prod.sku || prod.id}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Category & Planet */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                                        {prod.category}
                                      </span>
                                      <span className="font-body text-[11px] text-slate-500 block">
                                        {prod.planetName}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Age Group & Type */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      <span className="font-headline font-bold text-slate-700 block">
                                        {prod.ageLabel || prod.ageGroup}
                                      </span>
                                      <span className="font-body text-[11px] text-slate-400 block">
                                        {prod.productType}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Price & XP */}
                                  <td className="py-3.5 px-4">
                                    <div>
                                      <div className="font-headline font-black text-slate-900 text-sm">
                                        {formatPrice(prod.price, 'en')}
                                      </div>
                                      {prod.originalPrice && prod.originalPrice > prod.price && (
                                        <span className="font-body text-[10px] text-slate-400 line-through mr-1">
                                          {formatPrice(prod.originalPrice, 'en')}
                                        </span>
                                      )}
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-full mt-0.5">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        +{prod.xpBonus} XP
                                      </span>
                                    </div>
                                  </td>

                                  {/* Stock Level */}
                                  <td className="py-3.5 px-4">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-headline font-bold ${
                                        isOut
                                          ? 'bg-red-50 text-red-700 border border-red-200'
                                          : isLow
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      }`}
                                    >
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                          isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`}
                                      />
                                      {isOut ? 'Out of Stock' : isLow ? `Low Stock (${stock})` : `In Stock (${stock})`}
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => handleOpenEditProduct(prod)}
                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#016ba5] hover:text-white text-slate-600 transition-colors cursor-pointer"
                                        title="Edit Product"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setDeletingProduct(prod)}
                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                                        title="Delete Product"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB: CATEGORIES & PLANETS (CRUD)
               ======================================================== */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-headline text-2xl font-black text-slate-900">
                        Categories & Planets ({categoriesList.length})
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Tag className="w-3 h-3" />
                        Taxonomy Hub
                      </span>
                    </div>
                    <p className="font-body text-xs text-slate-500 mt-1">
                      Structure your marketplace with themed planets and category pills. Changes sync to customer navigation immediately.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 font-body text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#016ba5] w-44"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => void loadDashboardData(true)}
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={handleOpenAddCategory}
                      icon={<Plus className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Add Category
                    </Button>
                  </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {categoriesList
                    .filter((cat) => {
                      if (!categorySearch.trim()) return true;
                      const q = categorySearch.toLowerCase();
                      return (
                        cat.name.toLowerCase().includes(q) ||
                        (cat.planetName && cat.planetName.toLowerCase().includes(q)) ||
                        (cat.slug && cat.slug.toLowerCase().includes(q))
                      );
                    })
                    .map((cat) => {
                    const assignedProducts = productsList.filter(
                      (p) => p.category === cat.id || p.category === cat.slug
                    );

                    return (
                      <div
                        key={cat.id}
                        className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs font-headline font-bold text-sm shrink-0"
                                style={{ backgroundColor: cat.accentColor || '#016ba5' }}
                              >
                                {cat.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-headline font-black text-base text-slate-900 leading-tight">
                                  {cat.name}
                                </h4>
                                <span className="font-mono text-[11px] text-slate-400 block">
                                  slug: {cat.slug || cat.id}
                                </span>
                              </div>
                            </div>

                            <span
                              className="w-3 h-3 rounded-full shrink-0 mt-1"
                              style={{ backgroundColor: cat.accentColor || '#016ba5' }}
                              title={`Accent color: ${cat.accentColor}`}
                            />
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs font-headline font-semibold text-slate-600">
                              <span className="text-slate-400 font-normal">Planet:</span>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {cat.planetName || cat.name}
                              </span>
                            </div>

                            <p className="font-body text-xs text-slate-500 line-clamp-2">
                              {cat.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-headline font-bold text-xs text-slate-700">
                            {assignedProducts.length} {assignedProducts.length === 1 ? 'kit assigned' : 'kits assigned'}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#016ba5] hover:text-white font-headline text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingCategory(cat);
                                setDeletingCategoryError(null);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white font-headline text-xs font-semibold text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: CONTACT MESSAGES
               ======================================================== */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-headline text-2xl font-black text-slate-900">
                      Contact Inquiries ({messages.length})
                    </h2>
                    <p className="font-body text-xs text-slate-500">
                      Messages submitted by parents and educators through the public website.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMessageFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold ${
                        messageFilter === 'all' ? 'bg-[#016ba5] text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      All ({messages.length})
                    </button>
                    <button
                      onClick={() => setMessageFilter('unread')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold ${
                        messageFilter === 'unread' ? 'bg-[#016ba5] text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      onClick={() => setMessageFilter('read')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold ${
                        messageFilter === 'read' ? 'bg-[#016ba5] text-white' : 'bg-white text-slate-600'
                      }`}
                    >
                      Read ({messages.length - unreadCount})
                    </button>
                  </div>
                </div>

                {/* Messages Grid / List */}
                <div className="space-y-3">
                  {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-body">
                      No messages found in this category.
                    </div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-3xl bg-white border transition-all ${
                          msg.status === 'unread'
                            ? 'border-emerald-300 shadow-sm bg-emerald-50/20'
                            : 'border-slate-200 opacity-90'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-headline font-bold text-xs ${
                              msg.status === 'unread' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {msg.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-headline font-bold text-sm text-slate-900">
                                {msg.name}
                              </h4>
                              <span className="font-body text-xs text-slate-500">{msg.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-body text-[11px] text-slate-400">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-headline font-bold uppercase ${
                              msg.status === 'unread' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <strong className="font-headline text-xs font-bold text-[#016ba5] block mb-1">
                            Topic: {msg.subject}
                          </strong>
                          <p className="font-body text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-headline">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="inline-flex items-center gap-1 text-[#016ba5] hover:underline font-semibold"
                          >
                            <Mail className="w-3.5 h-3.5" /> Reply to Sender
                          </a>

                          <button
                            onClick={() => handleToggleMessageStatus(msg.id, msg.status)}
                            className="text-slate-500 hover:text-slate-800 underline"
                          >
                            {msg.status === 'unread' ? 'Mark as Read' : 'Mark as Unread'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: KEY SITE METRICS & TRAFFIC ANALYTICS
               ======================================================== */}
            {activeTab === 'analytics' && metrics && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-headline text-2xl font-black text-slate-900">
                    Key Site Metrics & Traffic Analytics
                  </h2>
                  <p className="font-body text-xs text-slate-500">
                    Live platform performance, visitor engagement trends, and product velocity.
                  </p>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="font-headline font-bold text-xs uppercase tracking-wider">Gross Revenue</span>
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-headline text-3xl font-black text-slate-900">
                        {metrics.totalRevenue.toLocaleString()} MAD
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <ArrowUpRight className="w-4 h-4" /> +18.2% from last month
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="font-headline font-bold text-xs uppercase tracking-wider">Total Orders</span>
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#016ba5] flex items-center justify-center">
                          <Package className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-headline text-3xl font-black text-slate-900">
                        {metrics.totalOrders}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      Conversion rate: <strong className="text-slate-800">{metrics.conversionRate}%</strong>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="font-headline font-bold text-xs uppercase tracking-wider">Quest XP Unlocked</span>
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-headline text-3xl font-black text-[#7C3AED]">
                        +{metrics.totalXpAwarded.toLocaleString()} XP
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      Character development points
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="font-headline font-bold text-xs uppercase tracking-wider">Weekly Visitors</span>
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#fa8221] flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-headline text-3xl font-black text-slate-900">
                        {metrics.activeVisitorsWeek.toLocaleString()}
                      </h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Organic & Parent Referrals
                    </div>
                  </div>
                </div>

                {/* Charts Grid: 7-Day Trend + Planet Popularity */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: 7-Day Trend Chart (Cols 1-7) */}
                  <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-headline font-bold text-base text-slate-900">
                          7-Day Traffic & Sales Velocity
                        </h4>
                        <span className="font-body text-xs text-slate-500">
                          Daily visitors vs. kit orders placed
                        </span>
                      </div>
                      <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        Last 7 Days
                      </span>
                    </div>

                    <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100">
                      {metrics.recentDaysTrend.map((t, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-body text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            ${t.revenue}
                          </span>
                          <div 
                            style={{ height: `${Math.max(20, Math.min(100, (t.revenue / 250) * 100))}%` }}
                            className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-[#016ba5] to-[#fa8221] group-hover:brightness-110 transition-all shadow-sm"
                          />
                          <span className="font-headline font-bold text-xs text-slate-600">
                            {t.day}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-xs font-body text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[#016ba5]" />
                        <span>Daily Orders Activity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-[#fa8221]" />
                        <span>Revenue Volume</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Planet Sales Distribution (Cols 8-12) */}
                  <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 className="font-headline font-bold text-base text-slate-900 mb-1">
                      Planet World Engagement
                    </h4>
                    <span className="font-body text-xs text-slate-500 block mb-6">
                      Distribution of kits purchased by life skill planet
                    </span>

                    <div className="space-y-4">
                      {metrics.planetSales.map((p, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-headline font-bold">
                            <span className="text-slate-800">{p.planet}</span>
                            <span className="text-slate-500">{p.salesCount} kits</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.max(15, (p.salesCount / (metrics.totalOrders || 1)) * 100)}%`,
                                backgroundColor: p.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Top Performing Learning Kits Leaderboard */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-headline font-bold text-base text-slate-900 mb-1">
                    Top Performing Learning Kits
                  </h4>
                  <p className="font-body text-xs text-slate-500 mb-6">
                    Bestselling physical kits and chronicles ranked by units ordered.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics.topProducts.map((prod, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#016ba5]/10 text-[#016ba5] font-headline font-black text-sm flex items-center justify-center">
                            #{idx + 1}
                          </div>
                          <div>
                            <h5 className="font-headline font-bold text-xs text-slate-800 line-clamp-1">
                              {prod.title}
                            </h5>
                            <span className="font-body text-[11px] text-slate-500">
                              {prod.unitsSold} units shipped
                            </span>
                          </div>
                        </div>
                        <span className="font-headline font-black text-sm text-slate-900">
                          ${prod.revenue.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================
                TAB 4: ADMIN TEAM & ACCESS (SUPER ADMIN EXCLUSIVE)
               ======================================================== */}
            {activeTab === 'team' && isSuperAdmin(currentUser) && (
              <div className="space-y-6">
                {/* Header & Action Banner */}
                <div className="bg-gradient-to-r from-[#0A2540] via-purple-950 to-[#0A2540] rounded-3xl p-6 sm:p-8 border border-purple-900/60 shadow-xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-headline font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Master Authority
                      </span>
                      <span className="font-body text-xs text-purple-300">
                        Exclusive to ElMahdi Ak
                      </span>
                    </div>
                    <h3 className="font-headline text-2xl font-black text-white">
                      Administrator Team & Access Management
                    </h3>
                    <p className="font-body text-xs text-slate-300 max-w-xl">
                      As the primary Super Administrator, you are the only person who can provision new administrator accounts or revoke team permissions.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadAdmins}
                      icon={<Clock className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="cta"
                      size="md"
                      onClick={() => {
                        setAdminActionError(null);
                        setAdminActionSuccess(null);
                        setShowAddAdminModal(true);
                      }}
                      icon={<UserPlus className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Add Administrator
                    </Button>
                  </div>
                </div>

                {adminActionSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-headline font-bold flex items-center justify-between animate-fadeIn">
                    <span>{adminActionSuccess}</span>
                    <button onClick={() => setAdminActionSuccess(null)} className="text-emerald-500 hover:text-emerald-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Admin stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="font-body text-xs text-slate-500 block mb-1">Total Admin Directory</span>
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-black text-2xl text-slate-900">{adminList.length}</span>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="font-body text-xs text-slate-500 block mb-1">Super Administrator</span>
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-black text-sm text-purple-900">ElMahdi Ak</span>
                      <Crown className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="font-body text-xs text-slate-500 block mb-1">Provisioning Authority</span>
                    <div className="flex items-center justify-between">
                      <span className="font-headline font-black text-sm text-emerald-600">Restricted (Locked)</span>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Admin Users Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-headline font-bold text-sm text-slate-900">
                      Authorized Team Members ({adminList.length})
                    </h4>
                    <span className="font-body text-xs text-slate-400">
                      Public registration is completely disabled
                    </span>
                  </div>

                  {loadingAdmins ? (
                    <div className="py-12 text-center">
                      <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
                      <span className="font-body text-xs text-slate-400">Loading administrator directory...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 font-headline font-bold border-b border-slate-200 uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Administrator</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Provisioned By</th>
                            <th className="py-3 px-4">Date Added</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-body">
                          {adminList.map((adm) => (
                            <tr key={adm.id || adm.email} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-headline font-black text-xs ${
                                    adm.isSuperAdmin
                                      ? 'bg-gradient-to-br from-amber-400 to-purple-600 text-white shadow-sm'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {adm.fullName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="font-headline font-bold text-slate-900 block">
                                      {adm.fullName}
                                    </span>
                                    {adm.isSuperAdmin && (
                                      <span className="text-[10px] text-purple-600 font-headline font-bold">
                                        ★ Primary Owner
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-body text-slate-600 font-medium">
                                {adm.email}
                              </td>
                              <td className="py-3.5 px-4">
                                  {adm.isSuperAdmin ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-headline font-extrabold text-[10px] flex items-center gap-1 w-max shadow-xs">
                                      <Crown className="w-3 h-3 text-amber-500" /> Super Admin
                                    </span>
                                  ) : adm.role === 'manager' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <ShieldCheck className="w-3 h-3 text-indigo-600" /> Manager
                                    </span>
                                  ) : adm.role === 'support_admin' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-headline font-bold text-[10px] w-max">
                                      Support Admin
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-headline font-bold text-[10px] w-max">
                                      Full Administrator
                                    </span>
                                  )}
                                </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                {adm.createdBy}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                {new Date(adm.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {adm.isSuperAdmin ? (
                                  <span className="text-[10px] font-headline font-bold text-slate-400 italic">
                                    Permanent
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleRevokeAdmin(adm.email)}
                                    className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors inline-flex items-center gap-1 text-[11px] font-headline font-semibold"
                                    title="Revoke Administrator Access"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Revoke</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 5: PLATFORM & WIDGET SETTINGS
               ======================================================== */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <h3 className="font-headline text-2xl font-black text-slate-900 tracking-tight">
                    Platform & Widget Settings
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
                    Manage floating customer widgets, support contact channels, and live communication preferences.
                  </p>
                </div>

                {/* Floating WhatsApp Chat Configuration Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center border border-[#25D366]/20 shadow-xs">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-headline text-lg font-black text-slate-900">
                          Floating WhatsApp Support Widget
                        </h4>
                        <p className="font-body text-xs text-slate-500 mt-0.5">
                          Configure screen corner positioning, contact endpoint, and responsiveness across the entire website.
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-headline font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live on All Pages
                    </span>
                  </div>

                  {/* Position Switcher Cards */}
                  <div className="mb-8">
                    <label className="block font-headline text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                      Widget Screen Corner Positioning
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                      {/* Option 1: Bottom Right */}
                      <button
                        type="button"
                        onClick={() => handleUpdateWhatsAppPosition('bottom-right')}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          whatsappPosition === 'bottom-right'
                            ? 'bg-emerald-50/60 border-[#25D366] shadow-sm ring-2 ring-[#25D366]/20'
                            : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="font-headline font-bold text-sm text-slate-900 flex items-center gap-2">
                              Bottom-Right Corner
                            </span>
                            {whatsappPosition === 'bottom-right' && (
                              <span className="px-2 py-0.5 rounded-full bg-[#25D366] text-white font-headline font-black text-[10px]">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="font-body text-xs text-slate-500 leading-relaxed mb-4">
                            Standard, high-conversion position favored by enterprise web apps. Sits unobtrusively at the lower-right margin.
                          </p>
                        </div>

                        {/* Schematic Mini-Viewport */}
                        <div className="w-full h-16 rounded-xl bg-white border border-slate-200/80 relative p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                          <div className="w-full h-2 rounded bg-slate-100 flex items-center gap-1 px-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                          </div>
                          <div className="flex justify-end">
                            <div className="w-4 h-4 rounded-full bg-[#25D366] shadow-sm flex items-center justify-center text-white text-[8px]">
                              ●
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Option 2: Bottom Left */}
                      <button
                        type="button"
                        onClick={() => handleUpdateWhatsAppPosition('bottom-left')}
                        className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          whatsappPosition === 'bottom-left'
                            ? 'bg-emerald-50/60 border-[#25D366] shadow-sm ring-2 ring-[#25D366]/20'
                            : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="font-headline font-bold text-sm text-slate-900 flex items-center gap-2">
                              Bottom-Left Corner
                            </span>
                            {whatsappPosition === 'bottom-left' && (
                              <span className="px-2 py-0.5 rounded-full bg-[#25D366] text-white font-headline font-black text-[10px]">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="font-body text-xs text-slate-500 leading-relaxed mb-4">
                            Alternative left-docked position to prevent overlap with right-docked shopping carts or pagination controls.
                          </p>
                        </div>

                        {/* Schematic Mini-Viewport */}
                        <div className="w-full h-16 rounded-xl bg-white border border-slate-200/80 relative p-1.5 flex flex-col justify-between overflow-hidden shadow-inner">
                          <div className="w-full h-2 rounded bg-slate-100 flex items-center gap-1 px-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                          </div>
                          <div className="flex justify-start">
                            <div className="w-4 h-4 rounded-full bg-[#25D366] shadow-sm flex items-center justify-center text-white text-[8px]">
                              ●
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Connected WhatsApp Number Details */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-headline text-xs font-bold text-slate-700 block mb-0.5">
                        Connected WhatsApp Endpoint
                      </span>
                      <span className="font-mono text-sm font-bold text-slate-900">
                        +212 7 54 40 21 29 <span className="text-xs text-slate-400 font-normal">(wa.me/212754402129)</span>
                      </span>
                    </div>

                    <a
                      href="https://wa.me/212754402129"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-headline font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Test Chat Link</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ========================================================
          MODAL 1: ADD / EDIT PRODUCT
         ======================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowProductModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#016ba5] font-headline font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" /> {editingProduct ? 'Inventory Update' : 'Catalog Expansion'}
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
              {editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Learning Kit / Product'}
            </h3>
            <p className="font-body text-xs text-slate-500 mb-5">
              Enter product details, category taxonomy, pricing, inventory stock, and media. Changes write directly to Supabase.
            </p>

            {prodModalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{prodModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Column 1: Core Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      placeholder="e.g. Celestial Astrolabe & Stargazer Map"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        SKU Identifier
                      </label>
                      <input
                        type="text"
                        value={prodSku}
                        onChange={(e) => setProdSku(e.target.value)}
                        placeholder="e.g. AQ-THK-109"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Category & Planet *
                      </label>
                      <select
                        value={prodCategory}
                        onChange={(e) => handleProdCategoryChange(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      >
                        {categoriesList.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.planetName || 'Planet'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Product Type
                      </label>
                      <select
                        value={prodProductType}
                        onChange={(e) => setProdProductType(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      >
                        <option value="Physical Kit">Physical Kit</option>
                        <option value="Storybook">Storybook</option>
                        <option value="Quest Gear">Quest Gear</option>
                        <option value="Family Game">Family Game</option>
                        <option value="Learning Tool">Learning Tool</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Age Group & Label
                      </label>
                      <select
                        value={prodAgeGroup}
                        onChange={(e) => {
                          setProdAgeGroup(e.target.value);
                          setProdAgeLabel(`Ages ${e.target.value}`);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      >
                        <option value="6-8">Ages 6–8</option>
                        <option value="9-11">Ages 9–11</option>
                        <option value="12+">Ages 12+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Selling Price (MAD) *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="299"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Original Price (MAD)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={prodOriginalPrice}
                        onChange={(e) => setProdOriginalPrice(e.target.value)}
                        placeholder="399 (optional)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={prodDiscountPercent}
                        onChange={(e) => setProdDiscountPercent(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Quest XP Bonus
                      </label>
                      <input
                        type="number"
                        value={prodXpBonus}
                        onChange={(e) => setProdXpBonus(e.target.value)}
                        placeholder="300"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>
                  </div>

                  {/* Badges & Flags */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-headline font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={prodIsBestSeller}
                        onChange={(e) => setProdIsBestSeller(e.target.checked)}
                        className="w-4 h-4 rounded text-[#fa8221] focus:ring-[#fa8221]"
                      />
                      <span>Best Seller</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-headline font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={prodIsNew}
                        onChange={(e) => setProdIsNew(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600"
                      />
                      <span>New Arrival</span>
                    </label>
                  </div>
                </div>

                {/* Column 2: Inventory, Media, and Descriptions */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                        Stock Count Units
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prodStockCount}
                        onChange={(e) => setProdStockCount(e.target.value)}
                        placeholder="15"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs font-headline font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={prodInStock}
                          onChange={(e) => setProdInStock(e.target.checked)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                        />
                        <span>In Stock Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Image Upload & URL */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Product Image (Upload or URL)
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        placeholder="Paste image URL (https://...)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                      <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-headline text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                        {uploadingProdImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingProdImage ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingProdImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {prodImageUrl && (
                      <div className="relative w-full h-24 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={prodImageUrl}
                          alt="Product Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setProdImageUrl('')}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/60 text-white hover:bg-slate-900"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={prodTags}
                      onChange={(e) => setProdTags(e.target.value)}
                      placeholder="e.g. Birchwood Gears, No Batteries, Screen-Free"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Short Tagline / Teaser
                    </label>
                    <textarea
                      rows={2}
                      value={prodShortDesc}
                      onChange={(e) => setProdShortDesc(e.target.value)}
                      placeholder="Punchy one-sentence summary for card previews..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={prodFullDesc}
                      onChange={(e) => setProdFullDesc(e.target.value)}
                      placeholder="Detailed educational journey and hands-on assembly experience..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cta"
                  size="sm"
                  disabled={prodSubmitting}
                  icon={prodSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {prodSubmitting ? 'Saving to Supabase...' : editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: DELETE PRODUCT CONFIRMATION
         ======================================================== */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setDeletingProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-2">
              Delete Product?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingProduct.title}</strong>? This will remove the item from the Supabase products table and all customer marketplace catalogs.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProduct(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={deletingProductSubmitting}
                onClick={handleConfirmDeleteProduct}
                className="bg-red-600 hover:bg-red-700 text-white"
                icon={deletingProductSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                iconPosition="left"
              >
                {deletingProductSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: ADD / EDIT CATEGORY
         ======================================================== */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-headline font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3 h-3" /> Category Management
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
            </h3>
            <p className="font-body text-xs text-slate-500 mb-5">
              Categories drive the marketplace taxonomy navigation pills and themed universe planets.
            </p>

            {catModalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{catModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  placeholder="e.g. Robotics & Automation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Slug (URL & Pill Key)
                  </label>
                  <input
                    type="text"
                    required
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="e.g. robotics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Planet Name
                  </label>
                  <input
                    type="text"
                    value={catPlanetName}
                    onChange={(e) => setCatPlanetName(e.target.value)}
                    placeholder="e.g. Solvers' Planet"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={catAccentColor}
                      onChange={(e) => setCatAccentColor(e.target.value)}
                      className="w-9 h-9 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={catAccentColor}
                      onChange={(e) => setCatAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Icon Theme
                  </label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  >
                    <option value="Brain">Brain (Thinkers)</option>
                    <option value="Compass">Compass (Brave)</option>
                    <option value="Wrench">Wrench (Solvers)</option>
                    <option value="Heart">Heart (Heart)</option>
                    <option value="BookOpen">BookOpen (Stories)</option>
                    <option value="Gamepad2">Gamepad2 (Games)</option>
                    <option value="Sparkles">Sparkles (Cosmic)</option>
                    <option value="Shield">Shield (Armor)</option>
                    <option value="Tag">Tag (Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Short educational summary for this category..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCategoryModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cta"
                  size="sm"
                  disabled={catSubmitting}
                  icon={catSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {catSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: DELETE CATEGORY CONFIRMATION
         ======================================================== */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setDeletingCategory(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-2">
              Delete Category?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-4 leading-relaxed">
              Are you sure you want to delete <strong>{deletingCategory.name}</strong>?
            </p>

            {deletingCategoryError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{deletingCategoryError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingCategory(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={deletingCategorySubmitting}
                onClick={handleConfirmDeleteCategory}
                className="bg-red-600 hover:bg-red-700 text-white"
                icon={deletingCategorySubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                iconPosition="left"
              >
                {deletingCategorySubmitting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin: Provision New Administrator Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowAddAdminModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-headline font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500" /> Super Admin Provisioning
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
              Provision Administrator Account
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6">
              Create an authorized account. Only you (ElMahdi Ak) can authorize new team members.
            </p>

            {adminActionError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{adminActionError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Administrator Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newAdminFullName}
                  onChange={(e) => setNewAdminFullName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. sarah@abtalquest.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Initial Temporary Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Administrative Role & Permissions
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'manager' | 'admin' | 'support_admin')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="manager">Manager (Full Operations & Platform Access)</option>
                  <option value="admin">Administrator (Orders, Inquiries & Analytics)</option>
                  <option value="support_admin">Support Administrator (Orders & Inquiries Only)</option>
                </select>
                <p className="text-[11px] font-body text-slate-500 mt-1">
                  Managers hold operational access across orders, inquiries, inventory, and metrics.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddAdminModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cta"
                  size="sm"
                  disabled={adminActionSubmitting}
                  icon={adminActionSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {adminActionSubmitting ? 'Provisioning...' : 'Provision Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">Order Inspection</Badge>
              <span className="font-headline font-bold text-xs text-slate-400">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-4">
              Order {selectedOrder.id}
            </h3>

            {/* Customer information card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-body space-y-1.5 mb-6">
              <div><strong>Recipient:</strong> {selectedOrder.customerName}</div>
              <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              <div>
                <strong>Shipping Address:</strong> {selectedOrder.shippingAddress},{' '}
                {selectedOrder.city} {selectedOrder.postalCode}, {selectedOrder.country}
              </div>
            </div>

            {/* Items table */}
            <div className="mb-6">
              <h5 className="font-headline font-bold text-xs text-slate-700 uppercase tracking-wider mb-2">
                Order Items
              </h5>
              <div className="space-y-2">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <strong className="font-headline text-slate-800 block">{item.productTitle}</strong>
                      <span className="text-slate-500 font-body">Qty: {item.quantity} × {(item.unitPrice || 0).toLocaleString()} MAD</span>
                    </div>
                    <span className="font-headline font-bold text-slate-900">
                      {((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()} MAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <span className="font-body text-xs text-slate-500 block">Total Due:</span>
                <span className="font-headline font-black text-2xl text-slate-900">
                  {(selectedOrder.totalAmount || 0).toLocaleString()} MAD
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Migration Script Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowSqlModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">Supabase Database Setup</Badge>
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-1">
              Orders & Line Items SQL Migration
            </h3>
            <p className="font-body text-xs text-slate-500 mb-4">
              Copy and execute this script in your Supabase project SQL Editor to enable full multi-device database persistence and Row-Level Security for orders.
            </p>

            <div className="relative flex-1 bg-slate-900 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-emerald-400 max-h-[50vh] border border-slate-800">
              <pre className="whitespace-pre-wrap">{ORDERS_SCHEMA_SQL}</pre>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
              <a
                href="https://supabase.com/dashboard/project/sdatbzgyqwxburnsjbax/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-[#016ba5] hover:underline"
              >
                <span>Open Supabase SQL Editor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <Button
                  variant="cta"
                  size="sm"
                  onClick={handleCopySql}
                  icon={copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {copiedSql ? 'Copied SQL!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSqlModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
