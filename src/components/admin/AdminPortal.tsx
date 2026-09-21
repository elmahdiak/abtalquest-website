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
  Mail, 
  ExternalLink,
  Loader2,
  X,
  Menu,
  Crown,
  UserPlus,
  Trash2,
  Shield,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
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
  CheckCircle,
  BookOpen,
  Eye,
  FileText,
  Globe,
  Download,
  UserCheck,
  CreditCard,
  Banknote,
  Bell,
  CheckCheck,
  Sun,
  Moon,
  TrendingUp,
  ShoppingBag,
  Calendar,
  Percent,
  Ticket
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { useTheme } from '../../context/ThemeContext';
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
  updateAdminUserRoleAndPermissions,
  hasAdminTabPermission,
  ROLE_DEFAULT_PERMISSIONS,
  ROLE_DISPLAY_NAMES,
  requestPasswordReset,
  verifyPasswordResetCode,
  completePasswordReset,
  SUPER_ADMIN_EMAIL,
  type AdminUserRecord,
  type AdminRole,
  type AdminTabPermission
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
  getFilteredSiteMetrics,
  type AnalyticsTimeframe,
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
import {
  fetchAdminNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
  setupRealtimeNotificationSubscriptions,
  formatRelativeTime,
  type AdminNotification
} from '../../services/notificationService';
import {
  fetchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  subscribeToBlogChanges,
  checkBlogsDatabaseHealth,
  BLOGS_SCHEMA_SQL,
  DEFAULT_BLOG_CATEGORIES,
  type BlogPost,
  type BlogsDatabaseHealth
} from '../../services/blogService';
import {
  fetchSubscribers,
  deleteSubscriber,
  exportSubscribersToCSV,
  subscribeEmail,
  SUBSCRIBERS_SCHEMA_SQL,
  type Subscriber
} from '../../services/subscriberService';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponActive,
  DEFAULT_COUPONS,
  type Coupon,
  type CreateCouponInput
} from '../../services/couponService';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../supabaseClient';

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
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'coupons' | 'blogs' | 'subscribers' | 'messages' | 'analytics' | 'team' | 'settings'>('orders');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('abtalquest_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('abtalquest_admin_sidebar_collapsed', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  // Keyboard shortcut (Ctrl+B or Cmd+B) to toggle sidebar collapse on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [whatsappPosition, setWhatsappPosition] = useState<WhatsAppPosition>(getStoredWhatsAppPosition);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Notifications state
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('all');

  // Analytics Timeframe state
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<AnalyticsTimeframe>('overview');

  // Coupons & Promo Codes state
  const [couponsList, setCouponsList] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [couponSearch, setCouponSearch] = useState<string>('');
  const [couponStatusFilter, setCouponStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [deletingCouponSubmitting, setDeletingCouponSubmitting] = useState<boolean>(false);
  const [couponSubmitting, setCouponSubmitting] = useState<boolean>(false);
  const [couponModalError, setCouponModalError] = useState<string | null>(null);
  const [couponActionSuccess, setCouponActionSuccess] = useState<string | null>(null);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);

  // Coupon Form state
  const [cpCode, setCpCode] = useState<string>('');
  const [cpDiscountType, setCpDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [cpDiscountValue, setCpDiscountValue] = useState<string>('10');
  const [cpMinOrder, setCpMinOrder] = useState<string>('0');
  const [cpUsageLimit, setCpUsageLimit] = useState<string>('');
  const [cpExpiresAt, setCpExpiresAt] = useState<string>('');
  const [cpIsActive, setCpIsActive] = useState<boolean>(true);

  // Products & Inventory state
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletingProductSubmitting, setDeletingProductSubmitting] = useState<boolean>(false);
  const [deletingProductError, setDeletingProductError] = useState<string | null>(null);
  const [productActionSuccess, setProductActionSuccess] = useState<string | null>(null);

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

  // Blogs & Articles state
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [blogsDbHealth, setBlogsDbHealth] = useState<BlogsDatabaseHealth | null>(null);
  const [copiedBlogSql, setCopiedBlogSql] = useState<boolean>(false);
  const [showBlogSqlModal, setShowBlogSqlModal] = useState<boolean>(false);
  const [blogSearch, setBlogSearch] = useState<string>('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [blogStatusFilter, setBlogStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [showBlogModal, setShowBlogModal] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);
  const [deletingBlogSubmitting, setDeletingBlogSubmitting] = useState<boolean>(false);
  const [previewingBlog, setPreviewingBlog] = useState<BlogPost | null>(null);
  const [blogSubmitting, setBlogSubmitting] = useState<boolean>(false);
  const [blogModalError, setBlogModalError] = useState<string | null>(null);
  const [blogImageUploading, setBlogImageUploading] = useState<boolean>(false);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState<string>('');
  const [blogSlug, setBlogSlug] = useState<string>('');
  const [blogExcerpt, setBlogExcerpt] = useState<string>('');
  const [blogContent, setBlogContent] = useState<string>('');
  const [blogCategory, setBlogCategory] = useState<string>('Emotional Wellness');
  const [blogCustomCategory, setBlogCustomCategory] = useState<string>('');
  const [blogTags, setBlogTags] = useState<string>('parenting, emotional-wellness');
  const [blogImageUrl, setBlogImageUrl] = useState<string>('');
  const [blogAuthorName, setBlogAuthorName] = useState<string>('Dr. Amina Mansour');
  const [blogAuthorRole, setBlogAuthorRole] = useState<string>('Child Psychologist');
  const [blogReadTime, setBlogReadTime] = useState<string>('5 min read');
  const [blogIsPublished, setBlogIsPublished] = useState<boolean>(true);
  const [blogFeatured, setBlogFeatured] = useState<boolean>(false);

  // Super Admin: Team Management state
  const [adminList, setAdminList] = useState<AdminUserRecord[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState<boolean>(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false);
  const [newAdminFullName, setNewAdminFullName] = useState<string>('');
  const [newAdminEmail, setNewAdminEmail] = useState<string>('');
  const [newAdminPassword, setNewAdminPassword] = useState<string>('');
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>('manager');
  const [adminActionError, setAdminActionError] = useState<string | null>(null);
  const [adminActionSuccess, setAdminActionSuccess] = useState<string | null>(null);
  const [adminActionSubmitting, setAdminActionSubmitting] = useState<boolean>(false);

  // Super Admin: Edit Manager Access & Role modal state
  const [editingAdmin, setEditingAdmin] = useState<AdminUserRecord | null>(null);
  const [editAdminFullName, setEditAdminFullName] = useState<string>('');
  const [editAdminRole, setEditAdminRole] = useState<AdminRole>('manager');
  const [editAdminPermissions, setEditAdminPermissions] = useState<AdminTabPermission[]>([]);
  const [editAdminSubmitting, setEditAdminSubmitting] = useState<boolean>(false);
  const [editAdminError, setEditAdminError] = useState<string | null>(null);

  // Orders filters
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<'all' | 'payzone' | 'cod'>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [syncingOrders, setSyncingOrders] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  // Messages filters
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Subscribers & Explorer Club state
  const [subscribersList, setSubscribersList] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState<boolean>(false);
  const [subscribersError, setSubscribersError] = useState<string | null>(null);
  const [subscribersTableMissing, setSubscribersTableMissing] = useState<boolean>(false);
  const [subscriberSearch, setSubscriberSearch] = useState<string>('');
  const [subscriberSourceFilter, setSubscriberSourceFilter] = useState<string>('all');
  const [deletingSubscriber, setDeletingSubscriber] = useState<Subscriber | null>(null);
  const [deletingSubscriberSubmitting, setDeletingSubscriberSubmitting] = useState<boolean>(false);
  const [subscriberActionSuccess, setSubscriberActionSuccess] = useState<string | null>(null);
  const [showAddSubscriberModal, setShowAddSubscriberModal] = useState<boolean>(false);
  const [newSubEmail, setNewSubEmail] = useState<string>('');
  const [newSubSource, setNewSubSource] = useState<string>('explorer_club');
  const [newSubSubmitting, setNewSubSubmitting] = useState<boolean>(false);
  const [newSubError, setNewSubError] = useState<string | null>(null);
  const [copiedSubscribersSql, setCopiedSubscribersSql] = useState<boolean>(false);
  const [showSubscribersSqlModal, setShowSubscribersSqlModal] = useState<boolean>(false);

  // Derive active user role and granular tab permissions
  const currentUserRecord = adminList.find(
    (a) => a.email.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  const currentUserRole: AdminRole = isSuperAdmin(currentUser)
    ? 'super_admin'
    : (currentUserRecord?.role || (currentUser?.user_metadata?.role as AdminRole) || 'admin');

  const currentUserPermissions: AdminTabPermission[] = isSuperAdmin(currentUser)
    ? ROLE_DEFAULT_PERMISSIONS.super_admin
    : (currentUserRecord?.permissions && currentUserRecord.permissions.length > 0
        ? currentUserRecord.permissions
        : (Array.isArray(currentUser?.user_metadata?.permissions) && currentUser.user_metadata.permissions.length > 0
            ? (currentUser.user_metadata.permissions as AdminTabPermission[])
            : ROLE_DEFAULT_PERMISSIONS[currentUserRole] || ROLE_DEFAULT_PERMISSIONS.admin));

  const canAccess = (tab: AdminTabPermission): boolean => {
    return hasAdminTabPermission(currentUser, tab, currentUserPermissions);
  };

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

  // Load subscribers
  const loadSubscribers = async () => {
    setSubscribersLoading(true);
    setSubscribersError(null);
    try {
      const res = await fetchSubscribers();
      setSubscribersList(res.subscribers);
      setSubscribersTableMissing(!!res.isTableMissing);
      if (res.error && !res.isTableMissing) {
        setSubscribersError(res.error);
      }
    } catch (err: any) {
      setSubscribersError(err?.message || 'Failed to load subscribers');
    } finally {
      setSubscribersLoading(false);
    }
  };

  // Listen for subscriber real-time events across windows
  useEffect(() => {
    const handleSubChanged = () => {
      loadSubscribers();
    };
    window.addEventListener('abtalquest:subscriber_added', handleSubChanged);
    window.addEventListener('abtalquest:subscriber_deleted', handleSubChanged);
    return () => {
      window.removeEventListener('abtalquest:subscriber_added', handleSubChanged);
      window.removeEventListener('abtalquest:subscriber_deleted', handleSubChanged);
    };
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
      const [ordersList, messagesList, siteStats, health, productsData, loadedCategories, loadedBlogs, subscribersData, blogsHealth, loadedCoupons] = await Promise.all([
        getAllOrdersForAdmin(),
        getContactMessagesForAdmin(),
        getSiteMetrics(),
        checkOrdersDatabaseHealth(),
        fetchMarketplaceProducts(),
        fetchCategories(),
        fetchBlogs(),
        fetchSubscribers(),
        checkBlogsDatabaseHealth(),
        fetchCoupons(),
      ]);

      setOrders(ordersList);
      setMessages(messagesList);
      setMetrics(siteStats);
      setDbHealth(health);
      setProductsList(productsData.products);
      setCategoriesList(loadedCategories);
      setBlogsList(loadedBlogs);
      setBlogsDbHealth(blogsHealth);
      setSubscribersList(subscribersData.subscribers);
      setCouponsList(loadedCoupons);
      setSubscribersTableMissing(!!subscribersData.isTableMissing);
      if (subscribersData.error && !subscribersData.isTableMissing) {
        setSubscribersError(subscribersData.error);
      }

      // Fetch live notifications aggregated from Supabase & recent events
      const notifs = await fetchAdminNotifications(ordersList, messagesList, subscribersData.subscribers);
      setNotifications(notifs);
    } catch (err) {
      console.warn('Dashboard data load error:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Set up Supabase Realtime notification subscription
  useEffect(() => {
    if (!isAdmin) return;
    const unsubscribe = setupRealtimeNotificationSubscriptions((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
    });
    return () => {
      unsubscribe();
    };
  }, [isAdmin]);

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllNotificationsRead = async () => {
    await markAllNotificationsAsRead(notifications);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = async () => {
    await clearAllNotifications(notifications);
    setNotifications([]);
  };

  const handleNotificationClick = async (notif: AdminNotification) => {
    await handleMarkNotificationRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      setNotificationsOpen(false);
    }
  };

  const handleCopyBlogSql = async () => {
    try {
      await navigator.clipboard.writeText(BLOGS_SCHEMA_SQL);
      setCopiedBlogSql(true);
      setTimeout(() => setCopiedBlogSql(false), 3000);
    } catch {
      setCopiedBlogSql(false);
    }
  };

  const handleCopySubscribersSql = async () => {
    try {
      await navigator.clipboard.writeText(SUBSCRIBERS_SCHEMA_SQL);
      setCopiedSubscribersSql(true);
      setTimeout(() => setCopiedSubscribersSql(false), 3000);
    } catch {
      setCopiedSubscribersSql(false);
    }
  };

  const handleConfirmDeleteSubscriber = async () => {
    if (!deletingSubscriber) return;
    setDeletingSubscriberSubmitting(true);
    try {
      await deleteSubscriber(deletingSubscriber.id);
      setSubscribersList((prev) => prev.filter((s) => s.id !== deletingSubscriber.id));
      setSubscriberActionSuccess(`Removed subscriber: ${deletingSubscriber.email}`);
      setDeletingSubscriber(null);
      setTimeout(() => setSubscriberActionSuccess(null), 5000);
    } catch (err: any) {
      alert(`Error removing subscriber: ${err?.message || 'Unknown error'}`);
    } finally {
      setDeletingSubscriberSubmitting(false);
    }
  };

  const handleSaveManualSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;
    setNewSubSubmitting(true);
    setNewSubError(null);
    try {
      const res = await subscribeEmail(newSubEmail.trim(), newSubSource);
      if (res.success) {
        setSubscriberActionSuccess(
          res.isDuplicate ? `Email already registered: ${newSubEmail}` : `Successfully added subscriber: ${newSubEmail}`
        );
        setShowAddSubscriberModal(false);
        setNewSubEmail('');
        loadSubscribers();
        setTimeout(() => setSubscriberActionSuccess(null), 5000);
      } else {
        setNewSubError(res.message);
      }
    } catch (err: any) {
      setNewSubError(err?.message || 'Failed to add subscriber');
    } finally {
      setNewSubSubmitting(false);
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
    setProdImageUrl(prod.images && prod.images.length > 0 ? prod.images[0] : (prod.imageUrl || prod.image || ''));
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

    if (file.size > 10 * 1024 * 1024) {
      setProdModalError('Image file is too large. Please select an image under 10MB.');
      return;
    }

    setUploadingProdImage(true);
    setProdModalError(null);
    try {
      const url = await uploadProductImage(file);
      setProdImageUrl(url);
    } catch (err: any) {
      console.error('[AdminPortal] Product image upload error:', err);
      setProdModalError(err?.message || 'Failed to upload product image to Supabase Storage.');
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

    if (prodImageUrl.trim().startsWith('data:')) {
      setProdModalError('Base64 image strings cannot be saved. Please upload the image file to Supabase Storage or enter an external public image URL.');
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

      const matchedCategory = categoriesList.find((c) => c.id === prodCategory || c.slug === prodCategory);

      const productData: Partial<Product> = {
        title: prodTitle.trim(),
        sku: prodSku.trim() || undefined,
        category: prodCategory,
        planetName: prodPlanetName.trim() || matchedCategory?.planetName || 'AbtalQuest Universe',
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
        imageUrl: prodImageUrl.trim() || undefined,
        image: prodImageUrl.trim() || undefined,
        image_url: prodImageUrl.trim() || undefined,
        accentColor: matchedCategory?.accentColor || '#016ba5',
        iconBg: matchedCategory?.accentColor ? `bg-[${matchedCategory.accentColor}]/10 text-[${matchedCategory.accentColor}]` : undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setProductActionSuccess(`Product "${prodTitle.trim()}" updated successfully in Supabase!`);
      } else {
        await createProduct(productData as any);
        setProductActionSuccess(`Product "${prodTitle.trim()}" created successfully in Supabase!`);
      }

      const refreshed = await fetchMarketplaceProducts();
      setProductsList(refreshed.products);
      setShowProductModal(false);
      setEditingProduct(null);
      setTimeout(() => setProductActionSuccess(null), 6000);
    } catch (err: any) {
      console.error('[AdminPortal] Error saving product to Supabase:', err);
      setProdModalError(err?.message || 'Failed to save product to Supabase. Please verify database connection and schema.');
    } finally {
      setProdSubmitting(false);
    }
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    setDeletingProductSubmitting(true);
    setDeletingProductError(null);
    try {
      const deletedTitle = deletingProduct.title;
      await deleteProduct(deletingProduct.id);
      const refreshed = await fetchMarketplaceProducts();
      setProductsList(refreshed.products);
      setDeletingProduct(null);
      setProductActionSuccess(`Product "${deletedTitle}" deleted successfully from Supabase.`);
      setTimeout(() => setProductActionSuccess(null), 6000);
    } catch (err: any) {
      console.error('[AdminPortal] Failed to delete product:', err);
      setDeletingProductError(err?.message || 'Failed to delete product from Supabase. Check database permissions.');
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

  // Coupon Action Handlers
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCpCode('');
    setCpDiscountType('percentage');
    setCpDiscountValue('10');
    setCpMinOrder('0');
    setCpUsageLimit('');
    setCpExpiresAt('');
    setCpIsActive(true);
    setCouponModalError(null);
    setShowCouponModal(true);
  };

  const handleOpenEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCpCode(coupon.code);
    setCpDiscountType(coupon.discountType);
    setCpDiscountValue(String(coupon.discountValue));
    setCpMinOrder(String(coupon.minOrderAmount || 0));
    setCpUsageLimit(coupon.usageLimit !== null && coupon.usageLimit !== undefined ? String(coupon.usageLimit) : '');
    setCpExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '');
    setCpIsActive(coupon.isActive);
    setCouponModalError(null);
    setShowCouponModal(true);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['ABTAL', 'QUEST', 'HERO', 'MOROCCO', 'EXPLORE', 'KIDS', 'SUPER'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setCpCode(`${p}${num}`);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = cpCode.trim().toUpperCase();
    if (!cleanCode) {
      setCouponModalError('Le code promo est requis.');
      return;
    }
    const val = parseFloat(cpDiscountValue);
    if (isNaN(val) || val <= 0) {
      setCouponModalError('La valeur de réduction doit être un nombre positif.');
      return;
    }
    if (cpDiscountType === 'percentage' && val > 100) {
      setCouponModalError('Un pourcentage ne peut pas dépasser 100%.');
      return;
    }

    setCouponSubmitting(true);
    setCouponModalError(null);

    try {
      const payload: CreateCouponInput = {
        code: cleanCode,
        discountType: cpDiscountType,
        discountValue: val,
        minOrderAmount: parseFloat(cpMinOrder) || 0,
        usageLimit: cpUsageLimit.trim() ? parseInt(cpUsageLimit.trim(), 10) : null,
        expiresAt: cpExpiresAt.trim() ? new Date(`${cpExpiresAt.trim()}T23:59:59Z`).toISOString() : null,
        isActive: cpIsActive,
      };

      if (editingCoupon) {
        const res = await updateCoupon(editingCoupon.id, payload);
        if (res.success && res.coupon) {
          setCouponsList((prev) => prev.map((c) => (c.id === editingCoupon.id ? res.coupon! : c)));
          setCouponActionSuccess(`Coupon "${cleanCode}" mis à jour avec succès !`);
          setShowCouponModal(false);
          setTimeout(() => setCouponActionSuccess(null), 4000);
        } else {
          setCouponModalError(res.error || 'Erreur lors de la mise à jour');
        }
      } else {
        const res = await createCoupon(payload);
        if (res.success && res.coupon) {
          setCouponsList((prev) => [res.coupon!, ...prev]);
          setCouponActionSuccess(`Coupon "${cleanCode}" créé avec succès !`);
          setShowCouponModal(false);
          setTimeout(() => setCouponActionSuccess(null), 4000);
        } else {
          setCouponModalError(res.error || 'Erreur lors de la création');
        }
      }
    } catch (err: any) {
      setCouponModalError(err?.message || 'Erreur inattendue');
    } finally {
      setCouponSubmitting(false);
    }
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      const next = !currentActive;
      setCouponsList((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: next } : c)));
      await toggleCouponActive(id, next);
    } catch (err) {
      console.warn('Failed to toggle coupon active:', err);
    }
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setDeletingCoupon(coupon);
  };

  const handleConfirmDeleteCoupon = async () => {
    if (!deletingCoupon) return;
    setDeletingCouponSubmitting(true);
    try {
      await deleteCoupon(deletingCoupon.id);
      setCouponsList((prev) => prev.filter((c) => c.id !== deletingCoupon.id));
      setCouponActionSuccess(`Coupon "${deletingCoupon.code}" supprimé avec succès.`);
      setDeletingCoupon(null);
      setTimeout(() => setCouponActionSuccess(null), 4000);
    } catch (err: any) {
      alert(`Erreur lors de la suppression: ${err?.message || 'Erreur inconnue'}`);
    } finally {
      setDeletingCouponSubmitting(false);
    }
  };

  const handleCopyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCouponCode(code);
      setTimeout(() => setCopiedCouponCode(null), 2500);
    } catch {
      // ignore
    }
  };

  // Blog Action Handlers
  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCategory(DEFAULT_BLOG_CATEGORIES[0] || 'Emotional Wellness');
    setBlogCustomCategory('');
    setBlogTags('parenting, emotional-wellness, resilience');
    setBlogImageUrl('');
    setBlogAuthorName(currentUser?.user_metadata?.full_name || 'AbtalQuest Editorial Team');
    setBlogAuthorRole('Child Development Specialist');
    setBlogReadTime('5 min read');
    setBlogIsPublished(true);
    setBlogFeatured(false);
    setBlogModalError(null);
    setShowBlogModal(true);
  };

  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    if (DEFAULT_BLOG_CATEGORIES.includes(blog.category)) {
      setBlogCategory(blog.category);
      setBlogCustomCategory('');
    } else {
      setBlogCategory('custom');
      setBlogCustomCategory(blog.category);
    }
    setBlogTags(blog.tags.join(', '));
    setBlogImageUrl(blog.imageUrl || '');
    setBlogAuthorName(blog.authorName);
    setBlogAuthorRole(blog.authorRole || '');
    setBlogReadTime(blog.readTime || '5 min read');
    setBlogIsPublished(blog.isPublished);
    setBlogFeatured(blog.featured);
    setBlogModalError(null);
    setShowBlogModal(true);
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setBlogModalError('Image file is too large. Please select an image under 10MB.');
      return;
    }

    setBlogImageUploading(true);
    setBlogModalError(null);
    try {
      const url = await uploadBlogImage(file);
      setBlogImageUrl(url);
    } catch (err: any) {
      console.error('[AdminPortal] Blog image upload error:', err);
      setBlogModalError(err?.message || 'Failed to upload blog image to Supabase Storage.');
    } finally {
      setBlogImageUploading(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogExcerpt.trim() || !blogContent.trim()) {
      setBlogModalError('Please fill in Title, Excerpt, and Full Content.');
      return;
    }

    if (blogImageUrl.trim().startsWith('data:')) {
      setBlogModalError('Base64 image strings cannot be saved. Please upload the image file to Supabase Storage or enter an external public image URL.');
      return;
    }

    setBlogSubmitting(true);
    setBlogModalError(null);
    try {
      const resolvedCategory =
        blogCategory === 'custom' && blogCustomCategory.trim()
          ? blogCustomCategory.trim()
          : blogCategory;

      const parsedTags = blogTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      if (editingBlog) {
        await updateBlog(editingBlog.id, {
          title: blogTitle,
          slug: blogSlug,
          excerpt: blogExcerpt,
          content: blogContent,
          category: resolvedCategory,
          tags: parsedTags,
          imageUrl: blogImageUrl,
          authorName: blogAuthorName,
          authorRole: blogAuthorRole,
          readTime: blogReadTime,
          isPublished: blogIsPublished,
          featured: blogFeatured,
        });
      } else {
        await createBlog({
          title: blogTitle,
          slug: blogSlug,
          excerpt: blogExcerpt,
          content: blogContent,
          category: resolvedCategory,
          tags: parsedTags,
          imageUrl: blogImageUrl,
          authorName: blogAuthorName,
          authorRole: blogAuthorRole,
          readTime: blogReadTime,
          isPublished: blogIsPublished,
          featured: blogFeatured,
        });
      }

      const refreshed = await fetchBlogs();
      setBlogsList(refreshed);
      setShowBlogModal(false);
      setEditingBlog(null);
    } catch (err: any) {
      setBlogModalError(err?.message || 'Failed to save blog post');
    } finally {
      setBlogSubmitting(false);
    }
  };

  const handleToggleBlogPublished = async (blog: BlogPost) => {
    try {
      await updateBlog(blog.id, { isPublished: !blog.isPublished });
      const refreshed = await fetchBlogs();
      setBlogsList(refreshed);
    } catch (err: any) {
      console.warn('Failed to toggle published status:', err);
      alert(`Failed to update publication status: ${err?.message || 'Database error'}`);
    }
  };

  const handleConfirmDeleteBlog = async () => {
    if (!deletingBlog) return;
    setDeletingBlogSubmitting(true);
    try {
      await deleteBlog(deletingBlog.id);
      const refreshed = await fetchBlogs();
      setBlogsList(refreshed);
      setDeletingBlog(null);
    } catch (err: any) {
      console.warn('Failed to delete blog:', err);
      alert(`Failed to delete blog post: ${err?.message || 'Database error'}`);
    } finally {
      setDeletingBlogSubmitting(false);
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
      if (e.key === 'abtalquest_orders_history' || e.key === 'abtalquest_contact_messages' || e.key === 'abtalquest_blogs_local') {
        void loadDashboardData(false);
      }
    };

    window.addEventListener('abtalquest_order_created', handleOrderEvent);
    window.addEventListener('abtalquest_order_status_updated', handleOrderEvent);
    window.addEventListener('abtalquest_product_updated', handleOrderEvent);
    window.addEventListener('abtalquest_category_updated', handleOrderEvent);
    window.addEventListener('abtalquest_blog_updated', handleOrderEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Cross-device Supabase Realtime synchronization for blogs
    const unsubscribeBlogs = subscribeToBlogChanges(() => {
      void fetchBlogs().then(setBlogsList);
      void checkBlogsDatabaseHealth().then(setBlogsDbHealth);
    });

    // Cross-device Supabase Realtime synchronization for products
    let adminProductChannel: any = null;
    if (isSupabaseConfigured()) {
      try {
        adminProductChannel = supabase
          .channel('admin_products_live_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'products' },
            () => {
              void loadDashboardData(false);
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Realtime admin product channel error:', err);
      }
    }

    return () => {
      window.removeEventListener('abtalquest_order_created', handleOrderEvent);
      window.removeEventListener('abtalquest_order_status_updated', handleOrderEvent);
      window.removeEventListener('abtalquest_product_updated', handleOrderEvent);
      window.removeEventListener('abtalquest_category_updated', handleOrderEvent);
      window.removeEventListener('abtalquest_blog_updated', handleOrderEvent);
      window.removeEventListener('storage', handleStorageEvent);
      unsubscribeBlogs();
      if (adminProductChannel) {
        supabase.removeChannel(adminProductChannel);
      }
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

  // Handle opening Edit Manager Access modal
  const handleOpenEditAdminModal = (adm: AdminUserRecord) => {
    setEditingAdmin(adm);
    setEditAdminFullName(adm.fullName);
    setEditAdminRole(adm.role);
    const currentPerms = adm.permissions && adm.permissions.length > 0
      ? adm.permissions
      : (ROLE_DEFAULT_PERMISSIONS[adm.role] || ROLE_DEFAULT_PERMISSIONS.admin);
    setEditAdminPermissions(currentPerms);
    setEditAdminError(null);
  };

  // Handle changing role inside Edit modal (auto-fills default permissions)
  const handleRoleChangeInEditModal = (newRole: AdminRole) => {
    setEditAdminRole(newRole);
    setEditAdminPermissions(ROLE_DEFAULT_PERMISSIONS[newRole] || ROLE_DEFAULT_PERMISSIONS.admin);
  };

  // Handle toggling individual tab permission inside Edit modal
  const togglePermissionInEditModal = (perm: AdminTabPermission) => {
    setEditAdminPermissions((prev) => {
      if (prev.includes(perm)) {
        if (prev.length === 1) return prev; // Keep at least one tab
        return prev.filter((p) => p !== perm);
      } else {
        return [...prev, perm];
      }
    });
  };

  // Handle saving manager access and role updates
  const handleSaveEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setEditAdminSubmitting(true);
    setEditAdminError(null);

    const res = await updateAdminUserRoleAndPermissions(
      {
        email: editingAdmin.email,
        fullName: editAdminFullName,
        role: editAdminRole,
        permissions: editAdminPermissions,
      },
      currentUser
    );

    if (!res.success) {
      setEditAdminError(res.error || 'Failed to update manager access.');
      setEditAdminSubmitting(false);
      return;
    }

    // If the currently signed in user was edited, ensure their active tab remains valid
    if (editingAdmin.email.toLowerCase() === currentUser?.email?.toLowerCase()) {
      if (!hasAdminTabPermission(currentUser, activeTab, editAdminPermissions)) {
        const candidateTabs: AdminTabPermission[] = [
          'orders', 'blogs', 'messages', 'subscribers', 'products', 'categories', 'coupons', 'analytics', 'settings'
        ];
        const nextAllowed = candidateTabs.find((t) => hasAdminTabPermission(currentUser, t, editAdminPermissions));
        if (nextAllowed) setActiveTab(nextAllowed);
      }
    }

    setAdminActionSuccess(`Access privileges and role for "${editAdminFullName || editingAdmin.email}" updated successfully to ${ROLE_DISPLAY_NAMES[editAdminRole] || editAdminRole}!`);
    setEditAdminSubmitting(false);
    setEditingAdmin(null);
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

  // Filtered orders & payment method counts
  const payzoneOrdersCount = orders.filter((o) => o.paymentMethod === 'payzone').length;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === 'cod' || !o.paymentMethod).length;

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

    const matchesPayment =
      orderPaymentFilter === 'all' ||
      (orderPaymentFilter === 'payzone' && o.paymentMethod === 'payzone') ||
      (orderPaymentFilter === 'cod' && (o.paymentMethod === 'cod' || !o.paymentMethod));

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Filtered messages
  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'all') return true;
    return m.status === messageFilter;
  });

  // Filtered blogs
  const filteredBlogs = blogsList.filter((b) => {
    const s = blogSearch.toLowerCase();
    const matchesSearch =
      !s ||
      b.title.toLowerCase().includes(s) ||
      b.excerpt.toLowerCase().includes(s) ||
      b.authorName.toLowerCase().includes(s) ||
      b.tags.some((t) => t.toLowerCase().includes(s));

    const matchesCategory = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;
    const matchesStatus =
      blogStatusFilter === 'all' ||
      (blogStatusFilter === 'published' && b.isPublished) ||
      (blogStatusFilter === 'draft' && !b.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
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
    <div className="h-screen max-h-screen w-full bg-slate-100 text-slate-800 flex overflow-hidden">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity cursor-pointer"
        />
      )}

      {/* Left Vertical Sidebar (Sticky / Fixed h-screen) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen bg-[#0A2540] border-r border-slate-800/80 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'
        } w-64`}
      >
        {/* Brand Header at top of Sidebar */}
        <div className={`p-4 border-b border-slate-800/80 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-between md:justify-center md:flex-col md:gap-2' : 'justify-between'}`}>
          <AbtalQuestLogo 
            variant="dark" 
            size="sm" 
            showText={!isSidebarCollapsed} 
            clickable={true} 
            href="#universe" 
            onClick={handleExitAdmin}
          />
          {/* Mobile Sidebar Close Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse / Expand Toggle Button inside sidebar header */}
          <button
            type="button"
            onClick={toggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
            className={`hidden md:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer ${
              isSidebarCollapsed ? 'mt-1 w-8 h-8' : ''
            }`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-[#fa8221]" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation Links Grouped Vertically */}
        <div className={`flex-1 p-3.5 space-y-5 overflow-y-auto ${isSidebarCollapsed ? 'md:p-2 md:space-y-4' : ''}`}>
          {/* Section 1: Commerce & Inventory */}
          {(canAccess('orders') || canAccess('products') || canAccess('categories') || canAccess('coupons')) && (
            <div>
              {!isSidebarCollapsed ? (
                <div className="px-3 pb-2 text-[10px] font-headline font-black uppercase tracking-wider text-slate-400/80 flex items-center justify-between">
                  <span>Commerce & Inventory</span>
                </div>
              ) : (
                <div className="hidden md:block border-t border-slate-800/80 my-2 mx-1" />
              )}
              <div className="space-y-1">
                {canAccess('orders') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Orders' : undefined}
                    onClick={() => {
                      setActiveTab('orders');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'orders'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Package className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Orders</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {orders.length}
                    </span>
                  </button>
                )}

                {canAccess('products') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Products Inventory' : undefined}
                    onClick={() => {
                      setActiveTab('products');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'products'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'products' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Products Inventory</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {productsList.length}
                    </span>
                  </button>
                )}

                {canAccess('categories') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Categories & Planets' : undefined}
                    onClick={() => {
                      setActiveTab('categories');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'categories'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Tag className={`w-4 h-4 shrink-0 ${activeTab === 'categories' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Categories & Planets</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {categoriesList.length}
                    </span>
                  </button>
                )}

                {canAccess('coupons') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Coupons & Codes Promo' : undefined}
                    onClick={() => {
                      setActiveTab('coupons');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'coupons'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Ticket className={`w-4 h-4 shrink-0 ${activeTab === 'coupons' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Coupons & Codes Promo</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'coupons' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {couponsList.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

            {/* Section 2: Content & Community */}
          {(canAccess('blogs') || canAccess('subscribers') || canAccess('messages')) && (
            <div>
              {!isSidebarCollapsed ? (
                <div className="px-3 pb-2 text-[10px] font-headline font-black uppercase tracking-wider text-slate-400/80 flex items-center justify-between">
                  <span>Content & Community</span>
                </div>
              ) : (
                <div className="hidden md:block border-t border-slate-800/80 my-2 mx-1" />
              )}
              <div className="space-y-1">
                {canAccess('blogs') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Blogs & Articles' : undefined}
                    onClick={() => {
                      setActiveTab('blogs');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'blogs'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <BookOpen className={`w-4 h-4 shrink-0 ${activeTab === 'blogs' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Blogs & Articles</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'blogs' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {blogsList.length}
                    </span>
                  </button>
                )}

                {canAccess('subscribers') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Explorer Club' : undefined}
                    onClick={() => {
                      setActiveTab('subscribers');
                      loadSubscribers();
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'subscribers'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Mail className={`w-4 h-4 shrink-0 ${activeTab === 'subscribers' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Explorer Club</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                      activeTab === 'subscribers' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      {subscribersList.length}
                    </span>
                  </button>
                )}

                {canAccess('messages') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Contact Messages' : undefined}
                    onClick={() => {
                      setActiveTab('messages');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'messages'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <MessageSquare className={`w-4 h-4 shrink-0 ${activeTab === 'messages' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Contact Messages</span>
                    </div>
                    {unreadCount > 0 ? (
                      <>
                        <span className={`px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-black animate-pulse shadow-sm ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'}`}>
                          {unreadCount}
                        </span>
                        {isSidebarCollapsed && (
                          <span className="hidden md:inline-block w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-pulse" />
                        )}
                      </>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'} ${
                        activeTab === 'messages' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {messages.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

            {/* Section 3: Intelligence & System */}
          {(canAccess('analytics') || canAccess('team') || canAccess('settings')) && (
            <div>
              {!isSidebarCollapsed ? (
                <div className="px-3 pb-2 text-[10px] font-headline font-black uppercase tracking-wider text-slate-400/80 flex items-center justify-between">
                  <span>Intelligence & System</span>
                </div>
              ) : (
                <div className="hidden md:block border-t border-slate-800/80 my-2 mx-1" />
              )}
              <div className="space-y-1">
                {canAccess('analytics') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Key Metrics' : undefined}
                    onClick={() => {
                      setActiveTab('analytics');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'analytics'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'analytics' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Key Metrics</span>
                    </div>
                  </button>
                )}

                {canAccess('team') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Admin Team (MASTER)' : undefined}
                    onClick={() => {
                      setActiveTab('team');
                      loadAdmins();
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'team'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-300 hover:text-white hover:bg-purple-900/40'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <Crown className="w-4 h-4 shrink-0 text-amber-300" />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Admin Team</span>
                    </div>
                    <span className={`px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black ${isSidebarCollapsed ? 'md:hidden' : 'inline-block'}`}>
                      MASTER
                    </span>
                  </button>
                )}

                {canAccess('settings') && (
                  <button
                    type="button"
                    title={isSidebarCollapsed ? 'Platform Settings' : undefined}
                    onClick={() => {
                      setActiveTab('settings');
                      setSidebarOpen(false);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl font-headline text-xs font-bold transition-all flex items-center group cursor-pointer relative ${
                      isSidebarCollapsed ? 'md:justify-center md:px-0' : 'justify-between'
                    } ${
                      activeTab === 'settings'
                        ? 'bg-[#fa8221] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'md:justify-center' : 'gap-2.5'}`}>
                      <SlidersHorizontal className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      <span className={isSidebarCollapsed ? 'md:hidden' : 'inline'}>Platform Settings</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
          </div>

          {/* Sidebar Footer Card: Connectivity & Info */}
          <div className={`p-3.5 border-t border-slate-800/80 bg-slate-900/40 ${isSidebarCollapsed ? 'md:p-2' : ''}`}>
            {!isSidebarCollapsed ? (
              <>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-headline font-bold text-slate-300">
                      Supabase Live
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">v2.4</span>
                </div>
                <div className="text-center mt-2">
                  <p className="font-body text-[10px] text-slate-500">
                    AbtalQuest Enterprise Portal
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60" title="Supabase Live v2.4 • AbtalQuest Enterprise Portal">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            )}
          </div>
        </aside>

        {/* Right Content Workspace Column */}
        <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          {/* Top Bar Navigation Header */}
          <header className="bg-[#0A2540] text-white border-b border-slate-800 h-14 sm:h-16 shrink-0 z-30 w-full flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Mobile Sidebar Hamburger Toggle */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open navigation menu"
                  className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa8221] cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Desktop Sidebar Collapse / Expand Toggle in Top Bar */}
                <button
                  type="button"
                  onClick={toggleSidebarCollapse}
                  aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  title={isSidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
                  className="hidden md:inline-flex items-center justify-center p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa8221] cursor-pointer"
                >
                  {isSidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-[#fa8221]" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>

                {/* Mobile Brand Emblem */}
                <div className="md:hidden">
                  <AbtalQuestLogo 
                    variant="dark" 
                    size="sm" 
                    showText={false} 
                    clickable={true} 
                    href="#universe" 
                    onClick={handleExitAdmin}
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  {isSuperAdmin(currentUser) ? (
                    <span className="font-headline text-xs font-black uppercase tracking-wider text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-amber-400" /> Super Admin
                    </span>
                  ) : currentUserRole === 'content_manager' ? (
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Content Manager
                    </span>
                  ) : currentUserRole === 'marketplace_manager' ? (
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" /> Marketplace Manager
                    </span>
                  ) : currentUserRole === 'support_admin' || currentUserRole === 'support' ? (
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 border border-sky-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Support Specialist
                    </span>
                  ) : currentUserRole === 'manager' ? (
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Manager
                    </span>
                  ) : (
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Administrator
                    </span>
                  )}
                  <span className="font-body text-xs text-slate-400 hidden sm:inline">
                    Logged in as <strong className="text-slate-200">{currentUser?.email}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* 1. Notification Center Toggle Button & Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    aria-label="Centre de notifications"
                    className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa8221] cursor-pointer flex items-center justify-center"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter((n) => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white font-headline font-black text-[10px] animate-pulse border-2 border-[#0A2540] shadow-sm">
                        {notifications.filter((n) => !n.isRead).length > 99 ? '99+' : notifications.filter((n) => !n.isRead).length}
                      </span>
                    )}
                  </button>

                  {/* Notification Center Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn text-slate-800 dark:text-slate-100">
                      {/* Header */}
                      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/40">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
                            Notifications
                          </h4>
                          {notifications.filter((n) => !n.isRead).length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 font-headline font-bold text-[10px]">
                              {notifications.filter((n) => !n.isRead).length} non lue{notifications.filter((n) => !n.isRead).length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {notifications.filter((n) => !n.isRead).length > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllNotificationsRead}
                              title="Tout marquer comme lu"
                              className="p-1 rounded-lg text-xs text-slate-500 hover:text-[#016ba5] dark:hover:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span className="text-[11px] hidden sm:inline">Tout lire</span>
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllNotifications}
                              title="Effacer l'historique"
                              className="p-1 rounded-lg text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Filter Tabs: Toutes vs Non lues */}
                      <div className="flex border-b border-slate-100 dark:border-slate-800 text-xs font-headline font-bold">
                        <button
                          type="button"
                          onClick={() => setNotificationFilter('all')}
                          className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
                            notificationFilter === 'all'
                              ? 'border-[#016ba5] dark:border-[#38BDF8] text-[#016ba5] dark:text-[#38BDF8] bg-slate-50/50 dark:bg-slate-800/30'
                              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          Toutes ({notifications.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setNotificationFilter('unread')}
                          className={`flex-1 py-2 text-center transition-colors cursor-pointer border-b-2 ${
                            notificationFilter === 'unread'
                              ? 'border-[#016ba5] dark:border-[#38BDF8] text-[#016ba5] dark:text-[#38BDF8] bg-slate-50/50 dark:bg-slate-800/30'
                              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          Non lues ({notifications.filter((n) => !n.isRead).length})
                        </button>
                      </div>

                      {/* Notification Items List */}
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                        {(notificationFilter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications).length === 0 ? (
                          <div className="py-8 text-center px-4">
                            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-body">
                              {notificationFilter === 'unread'
                                ? 'Aucune notification non lue'
                                : 'Aucune notification pour le moment'}
                            </p>
                          </div>
                        ) : (
                          (notificationFilter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 sm:p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group ${
                                !n.isRead ? 'bg-[#016ba5]/5 dark:bg-[#016ba5]/15' : ''
                              }`}
                            >
                              {/* Type Icon */}
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                n.type === 'order'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                  : n.type === 'payment_failed'
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                  : n.type === 'message'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              }`}>
                                {n.type === 'order' ? (
                                  <Package className="w-4 h-4" />
                                ) : n.type === 'payment_failed' ? (
                                  <AlertCircle className="w-4 h-4" />
                                ) : n.type === 'message' ? (
                                  <MessageSquare className="w-4 h-4" />
                                ) : (
                                  <Mail className="w-4 h-4" />
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <h5 className={`font-headline text-xs font-bold truncate ${
                                    !n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {n.title}
                                  </h5>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-body">
                                    {formatRelativeTime(n.timestamp)}
                                  </span>
                                </div>
                                <p className="text-[11px] font-body text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                                  {n.message}
                                </p>
                              </div>

                              {/* Unread indicator */}
                              {!n.isRead && (
                                <span className="w-2 h-2 rounded-full bg-[#016ba5] dark:bg-[#38BDF8] shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Dark / Light Mode Toggle Button */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                  title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 dark:hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#fa8221] cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-sky-300" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExitAdmin}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-headline font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-headline font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area beside Sidebar - INDEPENDENT INTERNAL SCROLL */}
          <main className="flex-1 min-w-0 bg-slate-100 dark:bg-[#071727] p-4 sm:p-6 lg:p-8 overflow-y-auto text-slate-800 dark:text-slate-100">
            <div className="w-full max-w-7xl mx-auto space-y-6">
            {loadingData ? (
              <div className="py-24 text-center">
                <Loader2 className="w-10 h-10 text-[#016ba5] animate-spin mx-auto mb-3" />
                <h4 className="font-headline font-bold text-slate-700">Loading Dashboard Data...</h4>
              </div>
            ) : !canAccess(activeTab) ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto my-12 shadow-sm animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <Lock className="w-8 h-8" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-headline font-bold uppercase tracking-wider mb-2 inline-block">
                  Restricted Section
                </span>
                <h3 className="font-headline font-black text-2xl text-slate-900 mb-2">Access Denied</h3>
                <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
                  Your administrative profile (<strong className="text-slate-800">{ROLE_DISPLAY_NAMES[currentUserRole] || currentUserRole}</strong>) does not hold access privileges for the <strong className="text-slate-800">{activeTab.toUpperCase()}</strong> section. Please contact Primary Super Administrator ElMahdi Ak to request access.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const candidateTabs: AdminTabPermission[] = [
                      'orders', 'blogs', 'messages', 'subscribers', 'products', 'categories', 'coupons', 'analytics', 'settings'
                    ];
                    const nextAllowed = candidateTabs.find((t) => canAccess(t));
                    if (nextAllowed) setActiveTab(nextAllowed);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#fa8221] hover:bg-[#e0731a] text-white font-headline text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Return to Permitted Section
                </button>
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
                        Customer Orders ({filteredOrders.length}{filteredOrders.length !== orders.length ? ` of ${orders.length}` : ''})
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

                {/* Filter & Search Bar with Payment Method Separation */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                  <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search Order ID, customer, email..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    {/* Payment Method Separation Quick-Filter Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          orderPaymentFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <span>All Payments</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          orderPaymentFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {orders.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('payzone')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          orderPaymentFilter === 'payzone'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Credit Card (Payzone)</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          orderPaymentFilter === 'payzone' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700 font-bold'
                        }`}>
                          {payzoneOrdersCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderPaymentFilter('cod')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          orderPaymentFilter === 'cod'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>Cash on Delivery (COD)</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          orderPaymentFilter === 'cod' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 font-bold'
                        }`}>
                          {codOrdersCount}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100">
                    <span className="text-[11px] font-headline font-bold uppercase tracking-wider text-slate-400 mr-1.5">
                      Status:
                    </span>
                    {['all', 'pending_cod', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => {
                      const countForStatus = orders.filter((o) => {
                        const matchesPayment =
                          orderPaymentFilter === 'all' ||
                          (orderPaymentFilter === 'payzone' && o.paymentMethod === 'payzone') ||
                          (orderPaymentFilter === 'cod' && (o.paymentMethod === 'cod' || !o.paymentMethod));
                        return matchesPayment && (status === 'all' || o.status === status);
                      }).length;

                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setOrderStatusFilter(status)}
                          className={`px-3 py-1 rounded-lg text-xs font-headline font-bold capitalize transition-colors flex items-center gap-1.5 cursor-pointer ${
                            orderStatusFilter === status
                              ? 'bg-[#016ba5] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{status === 'pending_cod' ? 'Pending COD' : status}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                            orderStatusFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                          }`}>
                            {countForStatus}
                          </span>
                        </button>
                      );
                    })}
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
                            <th className="py-3.5 px-4">Payment</th>
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
                                <div className="flex items-center gap-1.5 mb-1">
                                  {order.paymentMethod === 'payzone' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#016ba5] border border-blue-200">
                                      <CreditCard className="w-3 h-3" />
                                      Payzone / CMI
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <Banknote className="w-3 h-3" />
                                      Cash on Delivery
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[11px]">
                                  <span className={`font-semibold ${
                                    order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                                  }`}>
                                    {order.paymentStatus === 'paid' ? 'Paid (3D Secure)' : 'Pending COD'}
                                  </span>
                                </div>
                                {order.paymentRef && (
                                  <span className="text-[9px] font-mono text-slate-400 block tracking-tight mt-0.5">
                                    Ref: {order.paymentRef}
                                  </span>
                                )}
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
                                      : order.status === 'pending_cod'
                                      ? 'bg-orange-50 text-orange-700 border-orange-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  <option value="pending_cod">Pending COD</option>
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

                {/* Success Notification Banner */}
                {productActionSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between text-xs font-headline font-bold text-emerald-800 shadow-sm animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{productActionSuccess}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductActionSuccess(null)}
                      className="p-1 text-emerald-500 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

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
                                        {(() => {
                                          const tableProductImg = (prod.images && prod.images.length > 0 ? prod.images[0] : (prod.imageUrl || prod.image));
                                          return tableProductImg ? (
                                            <img
                                              src={tableProductImg}
                                              alt={prod.title}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                (e.target as HTMLElement).style.display = 'none';
                                              }}
                                            />
                                          ) : (
                                            <Package className="w-5 h-5 text-slate-400" />
                                          );
                                        })()}
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
                TAB: COUPONS & PROMO CODES MANAGEMENT
               ======================================================== */}
            {activeTab === 'coupons' && (() => {
              const activeCount = couponsList.filter((c) => c.isActive).length;
              const inactiveCount = couponsList.filter((c) => !c.isActive).length;
              const expiredCount = couponsList.filter((c) => {
                if (!c.expiresAt) return false;
                const d = new Date(c.expiresAt);
                return !isNaN(d.getTime()) && d.getTime() < Date.now();
              }).length;
              const totalUsage = couponsList.reduce((acc, c) => acc + (c.timesUsed || 0), 0);

              const filteredCoupons = couponsList.filter((c) => {
                if (couponSearch.trim()) {
                  const q = couponSearch.trim().toLowerCase();
                  if (!c.code.toLowerCase().includes(q)) return false;
                }
                if (couponStatusFilter === 'active') return c.isActive;
                if (couponStatusFilter === 'inactive') return !c.isActive;
                if (couponStatusFilter === 'expired') {
                  if (!c.expiresAt) return false;
                  const d = new Date(c.expiresAt);
                  return !isNaN(d.getTime()) && d.getTime() < Date.now();
                }
                return true;
              });

              return (
                <div className="space-y-6">
                  {/* Header with Title and Action Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="primary" size="sm">
                          <Ticket className="w-3 h-3 mr-1" />
                          Moteur de Réductions
                        </Badge>
                        <Badge variant="success" size="sm" pulse>
                          Supabase Live ({couponsList.length})
                        </Badge>
                      </div>
                      <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        Codes Promo & Coupons
                      </h2>
                      <p className="font-body text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Gérez les codes promotionnels appliqués par les familles lors du passage en caisse.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleOpenAddCoupon}
                        icon={<Plus className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Créer un Code Promo
                      </Button>
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => loadDashboardData(true)}
                        icon={<RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />}
                        iconPosition="left"
                      >
                        Actualiser
                      </Button>
                    </div>
                  </div>

                  {/* Success notification banner */}
                  {couponActionSuccess && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs font-body text-emerald-800 dark:text-emerald-200 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{couponActionSuccess}</span>
                    </div>
                  )}

                  {/* 4 KPI Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Total Coupons</span>
                        <Ticket className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8]" />
                      </div>
                      <p className="font-headline text-2xl font-black text-slate-900 dark:text-white">
                        {couponsList.length}
                      </p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">Configurés sur la plateforme</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Codes Actifs</span>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </div>
                      <p className="font-headline text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {activeCount}
                      </p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">Disponibles au checkout</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Utilisations</span>
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="font-headline text-2xl font-black text-purple-600 dark:text-purple-400">
                        {totalUsage}
                      </p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">Commandes avec réduction</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                        <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Codes Expirés</span>
                        <Clock className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="font-headline text-2xl font-black text-amber-600 dark:text-amber-400">
                        {expiredCount}
                      </p>
                      <p className="font-body text-[10px] text-slate-400 mt-0.5">Validité échue</p>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponSearch}
                        onChange={(e) => setCouponSearch(e.target.value)}
                        placeholder="Rechercher par code (ex: WELCOME10)..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-body text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                      />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCouponStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer ${
                          couponStatusFilter === 'all'
                            ? 'bg-[#016ba5] text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Tous ({couponsList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCouponStatusFilter('active')}
                        className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer ${
                          couponStatusFilter === 'active'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Actifs ({activeCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCouponStatusFilter('inactive')}
                        className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer ${
                          couponStatusFilter === 'inactive'
                            ? 'bg-slate-700 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Inactifs ({inactiveCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setCouponStatusFilter('expired')}
                        className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer ${
                          couponStatusFilter === 'expired'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        Expirés ({expiredCount})
                      </button>
                    </div>
                  </div>

                  {/* Coupons Grid / Cards */}
                  {filteredCoupons.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0A2540] border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                      <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                      <h4 className="font-headline text-sm font-bold text-slate-700 dark:text-slate-200">
                        Aucun code promo trouvé
                      </h4>
                      <p className="font-body text-xs text-slate-400 max-w-sm mx-auto">
                        {couponSearch || couponStatusFilter !== 'all'
                          ? 'Aucun coupon ne correspond à vos filtres actuels.'
                          : 'Créez votre premier code promotionnel pour offrir des réductions exclusives à vos clients.'}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleOpenAddCoupon}
                        icon={<Plus className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Créer un Code Promo
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCoupons.map((coupon) => {
                        const isExpired = coupon.expiresAt ? new Date(coupon.expiresAt).getTime() < Date.now() : false;
                        const usageRatio = coupon.usageLimit ? Math.min(100, Math.round((coupon.timesUsed / coupon.usageLimit) * 100)) : 0;
                        const isLimitReached = coupon.usageLimit ? coupon.timesUsed >= coupon.usageLimit : false;

                        return (
                          <div
                            key={coupon.id}
                            className={`p-5 rounded-3xl bg-white dark:bg-[#0A2540] border transition-all hover:shadow-md flex flex-col justify-between ${
                              !coupon.isActive
                                ? 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50/50 dark:bg-slate-900/40'
                                : isExpired || isLimitReached
                                ? 'border-amber-200 dark:border-amber-900/60'
                                : 'border-slate-200/80 dark:border-slate-800'
                            }`}
                          >
                            <div>
                              {/* Top Bar: Code badge + active switch */}
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="px-3 py-1.5 rounded-xl bg-[#016ba5]/10 dark:bg-[#016ba5]/25 border border-[#016ba5]/30 flex items-center gap-1.5 font-mono font-black text-xs text-[#016ba5] dark:text-[#38BDF8] tracking-wider">
                                    <Tag className="w-3.5 h-3.5" />
                                    <span>{coupon.code}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCouponCode(coupon.code)}
                                    title="Copier le code"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                  >
                                    {copiedCouponCode === coupon.code ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>

                                {/* Active toggle switch */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    coupon.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                  }`}
                                  title={coupon.isActive ? 'Désactiver le coupon' : 'Activer le coupon'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                      coupon.isActive ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </div>

                              {/* Value Display */}
                              <div className="flex items-baseline gap-2 mb-4">
                                <span className="font-headline text-3xl font-black text-slate-900 dark:text-white">
                                  {coupon.discountType === 'percentage'
                                    ? `-${coupon.discountValue}%`
                                    : `-${coupon.discountValue} DH`}
                                </span>
                                <span className="text-xs font-headline font-bold text-slate-400 uppercase">
                                  {coupon.discountType === 'percentage' ? 'Pourcentage' : 'Montant Fixe'}
                                </span>
                              </div>

                              {/* Conditions and Attributes */}
                              <div className="space-y-2.5 text-xs font-body border-t border-slate-100 dark:border-slate-800/80 pt-3">
                                {/* Minimum Order */}
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Montant min :</span>
                                  <span className="font-headline font-bold">
                                    {coupon.minOrderAmount > 0 ? `${coupon.minOrderAmount} DH` : 'Sans minimum'}
                                  </span>
                                </div>

                                {/* Expiration */}
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                                  <span className="text-slate-400">Expiration :</span>
                                  <span className="font-headline font-semibold flex items-center gap-1">
                                    {coupon.expiresAt ? (
                                      <>
                                        <span>{new Date(coupon.expiresAt).toLocaleDateString('fr-FR')}</span>
                                        {isExpired && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                                            Expiré
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-slate-400 font-normal">Illimitée</span>
                                    )}
                                  </span>
                                </div>

                                {/* Usage Progress */}
                                <div>
                                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1">
                                    <span className="text-slate-400">Utilisation :</span>
                                    <span className="font-headline font-bold">
                                      {coupon.timesUsed} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'utilisations'}
                                      {isLimitReached && (
                                        <span className="ml-1 text-[10px] text-amber-500 font-bold">(Limite atteinte)</span>
                                      )}
                                    </span>
                                  </div>
                                  {coupon.usageLimit && (
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${
                                          usageRatio >= 100
                                            ? 'bg-amber-500'
                                            : usageRatio > 75
                                            ? 'bg-blue-500'
                                            : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${usageRatio}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditCoupon(coupon)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-headline text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCoupon(coupon)}
                                className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 font-headline text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Create / Edit Coupon Modal */}
                  {showCouponModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="relative w-full max-w-lg bg-white dark:bg-[#0A2540] rounded-3xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setShowCouponModal(false)}
                          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 mb-1">
                          <Ticket className="w-5 h-5 text-[#016ba5] dark:text-[#38BDF8]" />
                          <Badge variant="primary" size="sm">
                            {editingCoupon ? 'Édition' : 'Création'}
                          </Badge>
                        </div>

                        <h3 className="font-headline text-xl font-black text-slate-900 dark:text-white mb-1">
                          {editingCoupon ? `Modifier le Code ${editingCoupon.code}` : 'Créer un Nouveau Code Promo'}
                        </h3>
                        <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-5">
                          Définissez le code, la valeur de la remise et les conditions d'application.
                        </p>

                        {couponModalError && (
                          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-600 dark:text-red-300 mb-4">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span>{couponModalError}</span>
                          </div>
                        )}

                        <form onSubmit={handleSaveCoupon} className="space-y-4">
                          {/* Code string with generator button */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200">
                                Code Promo (ex: WELCOME10) *
                              </label>
                              <button
                                type="button"
                                onClick={handleGenerateRandomCode}
                                className="text-[11px] font-headline font-semibold text-[#016ba5] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>Générer un code</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              required
                              value={cpCode}
                              onChange={(e) => setCpCode(e.target.value.toUpperCase())}
                              placeholder="ex. RAMADAN2026"
                              className="w-full uppercase font-mono px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-headline text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                            />
                          </div>

                          {/* Discount Type: Percentage vs Fixed */}
                          <div>
                            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                              Type de Réduction *
                            </label>
                            <div className="grid grid-cols-2 gap-2.5">
                              <button
                                type="button"
                                onClick={() => setCpDiscountType('percentage')}
                                className={`p-3 rounded-xl border-2 font-headline text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                  cpDiscountType === 'percentage'
                                    ? 'border-[#016ba5] bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8]'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                                }`}
                              >
                                <Percent className="w-4 h-4" />
                                <span>Pourcentage (%)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setCpDiscountType('fixed')}
                                className={`p-3 rounded-xl border-2 font-headline text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                  cpDiscountType === 'fixed'
                                    ? 'border-[#016ba5] bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8]'
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                                }`}
                              >
                                <Banknote className="w-4 h-4" />
                                <span>Montant Fixe (DH)</span>
                              </button>
                            </div>
                          </div>

                          {/* Discount Value */}
                          <div>
                            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                              Valeur de la Réduction {cpDiscountType === 'percentage' ? '(%)' : '(DH)'} *
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              max={cpDiscountType === 'percentage' ? 100 : undefined}
                              step="any"
                              value={cpDiscountValue}
                              onChange={(e) => setCpDiscountValue(e.target.value)}
                              placeholder={cpDiscountType === 'percentage' ? '15' : '50'}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-headline text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                            />
                          </div>

                          {/* Minimum Order Amount */}
                          <div>
                            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                              Montant Minimum du Panier (DH)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              value={cpMinOrder}
                              onChange={(e) => setCpMinOrder(e.target.value)}
                              placeholder="0 pour aucun minimum"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-headline text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                            />
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Le code ne sera applicable que si le panier atteint ce sous-total.
                            </span>
                          </div>

                          {/* Usage Limit & Expiration Date */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                                Limite d'Utilisations
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={cpUsageLimit}
                                onChange={(e) => setCpUsageLimit(e.target.value)}
                                placeholder="Vide = illimité"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-headline text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                                Date d'Expiration
                              </label>
                              <input
                                type="date"
                                value={cpExpiresAt}
                                onChange={(e) => setCpExpiresAt(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-headline text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                              />
                            </div>
                          </div>

                          {/* Active Status Checkbox */}
                          <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-headline font-bold text-slate-700 dark:text-slate-300">
                              <input
                                type="checkbox"
                                checked={cpIsActive}
                                onChange={(e) => setCpIsActive(e.target.checked)}
                                className="w-4 h-4 text-[#016ba5] rounded border-slate-300 dark:border-slate-600 focus:ring-[#016ba5]"
                              />
                              <span>Activer ce code immédiatement</span>
                            </label>
                          </div>

                          {/* Actions */}
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                            <Button
                              variant="outline"
                              size="md"
                              type="button"
                              onClick={() => setShowCouponModal(false)}
                            >
                              Annuler
                            </Button>
                            <Button
                              variant="primary"
                              size="md"
                              type="submit"
                              disabled={couponSubmitting}
                              icon={couponSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              iconPosition="left"
                            >
                              {couponSubmitting
                                ? 'Enregistrement...'
                                : editingCoupon
                                ? 'Mettre à jour le code'
                                : 'Créer le code promo'}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Delete Coupon Confirmation Modal */}
                  {deletingCoupon && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="relative w-full max-w-sm bg-white dark:bg-[#0A2540] rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
                          <Trash2 className="w-6 h-6" />
                        </div>

                        <h3 className="font-headline text-lg font-black text-slate-900 dark:text-white mb-1">
                          Supprimer le Code Promo
                        </h3>
                        <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-5">
                          Êtes-vous sûr de vouloir supprimer définitivement le code <strong className="text-slate-800 dark:text-slate-200">{deletingCoupon.code}</strong> ? Les clients ne pourront plus l'utiliser.
                        </p>

                        <div className="flex items-center justify-end gap-2.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingCouponSubmitting}
                            onClick={() => setDeletingCoupon(null)}
                          >
                            Annuler
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={deletingCouponSubmitting}
                            onClick={handleConfirmDeleteCoupon}
                            icon={deletingCouponSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            iconPosition="left"
                          >
                            {deletingCouponSubmitting ? 'Suppression...' : 'Confirmer la suppression'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ========================================================
                TAB: BLOGS & ARTICLES MANAGEMENT
               ======================================================== */}
            {activeTab === 'blogs' && (
              <div className="space-y-6">
                {/* Header with Title and Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {blogsDbHealth?.tableReady ? (
                        <Badge variant="success" size="sm" pulse>
                          Supabase Live ({blogsDbHealth.count})
                        </Badge>
                      ) : blogsDbHealth && !blogsDbHealth.tableReady ? (
                        <Badge variant="warning" size="sm">
                          Schema Pending Setup
                        </Badge>
                      ) : (
                        <Badge variant="primary" size="sm">
                          Supabase Synced
                        </Badge>
                      )}
                      <span className="font-body text-xs text-slate-400">Public Parenting Resources</span>
                    </div>
                    <h2 className="font-headline text-2xl font-black text-slate-900">
                      Blogs & Parenting Resources ({blogsList.length})
                    </h2>
                    <p className="font-body text-xs text-slate-500">
                      Manage articles, emotional wellness guides, and digital safety essays published on the AbtalQuest public portal.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="cta"
                      size="sm"
                      onClick={handleOpenAddBlog}
                      icon={<Plus className="w-4 h-4" />}
                      iconPosition="left"
                    >
                      Create Blog Post
                    </Button>
                  </div>
                </div>

                {/* Missing Table Attention Alert */}
                {blogsDbHealth && !blogsDbHealth.tableReady && (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 animate-fadeIn shadow-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-headline font-black text-sm text-amber-900">
                          Remote Supabase Table &quot;blogs&quot; Pending Setup
                        </h4>
                        <p className="font-body text-xs text-amber-800 mt-0.5">
                          Articles are currently served from local defaults. Execute the SQL migration in your Supabase SQL Editor to enable live cloud persistence and real-time multi-device synchronization.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handleCopyBlogSql}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-headline text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedBlogSql ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied SQL!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SQL Script</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowBlogSqlModal(true)}
                        className="px-3 py-2 rounded-xl border border-amber-300 hover:bg-amber-100 text-amber-800 font-headline text-xs font-bold transition-all cursor-pointer"
                      >
                        View SQL
                      </button>
                    </div>
                  </div>
                )}

                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="font-headline text-xs font-bold uppercase tracking-wider">Total Articles</span>
                      <BookOpen className="w-4 h-4 text-[#016ba5]" />
                    </div>
                    <div className="font-headline text-2xl font-black text-slate-900">
                      {blogsList.length}
                    </div>
                    <span className="font-body text-[11px] text-slate-400">Authored content pieces</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="font-headline text-xs font-bold uppercase tracking-wider">Published</span>
                      <Globe className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="font-headline text-2xl font-black text-emerald-600">
                      {blogsList.filter((b) => b.isPublished).length}
                    </div>
                    <span className="font-body text-[11px] text-emerald-600 font-semibold">Live on public website</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="font-headline text-xs font-bold uppercase tracking-wider">Drafts</span>
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="font-headline text-2xl font-black text-amber-600">
                      {blogsList.filter((b) => !b.isPublished).length}
                    </div>
                    <span className="font-body text-[11px] text-slate-400">Unpublished or in-review</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                      <span className="font-headline text-xs font-bold uppercase tracking-wider">Total Reads</span>
                      <Eye className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="font-headline text-2xl font-black text-purple-600">
                      {blogsList.reduce((acc, b) => acc + (b.viewsCount || 0), 0).toLocaleString()}
                    </div>
                    <span className="font-body text-[11px] text-slate-400">Combined visitor views</span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, excerpt, author, tags..."
                      value={blogSearch}
                      onChange={(e) => setBlogSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-body text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
                    {/* Category Filter */}
                    <select
                      value={blogCategoryFilter}
                      onChange={(e) => setBlogCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-headline font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    >
                      <option value="all">All Categories</option>
                      {Array.from(new Set([...DEFAULT_BLOG_CATEGORIES, ...blogsList.map((b) => b.category)])).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* Status Filter */}
                    <select
                      value={blogStatusFilter}
                      onChange={(e) => setBlogStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-headline font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published Only</option>
                      <option value="draft">Drafts Only</option>
                    </select>

                    {(blogSearch || blogCategoryFilter !== 'all' || blogStatusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setBlogSearch('');
                          setBlogCategoryFilter('all');
                          setBlogStatusFilter('all');
                        }}
                        className="text-xs font-headline font-bold text-[#fa8221] hover:underline px-2 whitespace-nowrap"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Blog Posts Table */}
                <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-headline font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-3.5 px-4">Article</th>
                          <th className="py-3.5 px-4">Category & Tags</th>
                          <th className="py-3.5 px-4">Author</th>
                          <th className="py-3.5 px-4">Read Time</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4">Published Date</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredBlogs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
                              <p className="font-headline font-bold text-slate-600">No blog posts found</p>
                              <p className="font-body text-xs text-slate-400 mt-1">
                                {blogSearch || blogCategoryFilter !== 'all' || blogStatusFilter !== 'all'
                                  ? 'Try adjusting your search query or filters.'
                                  : 'Click "Create Blog Post" to add your first article!'}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredBlogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* Article Cover & Title */}
                              <td className="py-3.5 px-4 max-w-sm">
                                <div className="flex items-center gap-3">
                                  {blog.imageUrl ? (
                                    <img
                                      src={blog.imageUrl}
                                      alt={blog.title}
                                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                      <BookOpen className="w-5 h-5 text-slate-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <h4 className="font-headline font-bold text-slate-900 line-clamp-1 leading-snug">
                                      {blog.title}
                                    </h4>
                                    <p className="font-body text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                      {blog.excerpt}
                                    </p>
                                    <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                                      /{blog.slug}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Category & Tags */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#016ba5]/10 text-[#016ba5] font-headline font-bold text-[10px]">
                                    {blog.category}
                                  </span>
                                  {blog.tags && blog.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {blog.tags.slice(0, 2).map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="text-[9px] font-body text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                      {blog.tags.length > 2 && (
                                        <span className="text-[9px] font-body text-slate-400">
                                          +{blog.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Author */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-headline font-bold text-slate-800 block">
                                    {blog.authorName}
                                  </span>
                                  {blog.authorRole && (
                                    <span className="font-body text-[11px] text-slate-400 block">
                                      {blog.authorRole}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Read Time */}
                              <td className="py-3.5 px-4">
                                <span className="font-body text-xs text-slate-600 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-[#fa8221]" />
                                  {blog.readTime || '5 min read'}
                                </span>
                              </td>

                              {/* Status Toggle */}
                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleBlogPublished(blog)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-headline font-bold cursor-pointer transition-all ${
                                    blog.isPublished
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                                  }`}
                                  title="Click to toggle status"
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                  <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                                </button>
                              </td>

                              {/* Creation Date */}
                              <td className="py-3.5 px-4 font-body text-xs text-slate-400">
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setPreviewingBlog(blog)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Preview / Read Full Article"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditBlog(blog)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-[#016ba5] hover:bg-slate-100 transition-colors cursor-pointer"
                                    title="Edit Post"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingBlog(blog)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Post"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB: EXPLORER CLUB & COMMUNITY SUBSCRIBERS
               ======================================================== */}
            {activeTab === 'subscribers' && (() => {
              const filteredSubscribers = subscribersList.filter((s) => {
                const matchesSearch = subscriberSearch.trim() === '' || s.email.toLowerCase().includes(subscriberSearch.trim().toLowerCase());
                const matchesSource = subscriberSourceFilter === 'all' || s.source === subscriberSourceFilter;
                return matchesSearch && matchesSource;
              });

              const explorerClubCount = subscribersList.filter((s) => s.source === 'explorer_club').length;
              const parentingDigestCount = subscribersList.filter((s) => s.source === 'parenting_digest').length;
              const newThisMonthCount = subscribersList.filter((s) => {
                try {
                  const created = new Date(s.createdAt).getTime();
                  return (Date.now() - created) < 30 * 24 * 3600 * 1000;
                } catch {
                  return false;
                }
              }).length;

              return (
                <div className="space-y-6">
                  {/* Top Header & Actions Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" size="sm">Explorer Club Community</Badge>
                        <span className="font-headline font-bold text-xs text-slate-400">
                          {subscribersList.length} Total Subscribed
                        </span>
                      </div>
                      <h2 className="font-headline text-2xl font-black text-slate-900">
                        Explorer Club & Newsletter Subscribers
                      </h2>
                      <p className="font-body text-xs text-slate-500">
                        Real-time parent subscriber leads persisted directly in Supabase PostgreSQL.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportSubscribersToCSV(filteredSubscribers)}
                        icon={<Download className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Export CSV ({filteredSubscribers.length})
                      </Button>

                      <Button
                        variant="cta"
                        size="sm"
                        onClick={() => {
                          setNewSubEmail('');
                          setNewSubSource('explorer_club');
                          setNewSubError(null);
                          setShowAddSubscriberModal(true);
                        }}
                        icon={<Plus className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Add Subscriber
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSubscribersSqlModal(true)}
                        icon={<Database className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        SQL Setup
                      </Button>

                      <button
                        onClick={loadSubscribers}
                        disabled={subscribersLoading}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                        title="Refresh Subscribers"
                      >
                        <RefreshCw className={`w-4 h-4 ${subscribersLoading ? 'animate-spin text-[#016ba5]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Success Toast Banner */}
                  {subscriberActionSuccess && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-800 animate-fadeIn">
                      <div className="flex items-center gap-2 font-headline font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{subscriberActionSuccess}</span>
                      </div>
                      <button
                        onClick={() => setSubscriberActionSuccess(null)}
                        className="text-emerald-500 hover:text-emerald-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Error Toast Banner */}
                  {subscribersError && !subscribersTableMissing && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-rose-800 animate-fadeIn">
                      <div className="flex items-center gap-2 font-headline font-bold text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{subscribersError}</span>
                      </div>
                      <button
                        onClick={() => setSubscribersError(null)}
                        className="text-rose-500 hover:text-rose-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Missing Table Attention Alert */}
                  {subscribersTableMissing && (
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 animate-fadeIn shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-headline font-black text-sm text-amber-900">
                            Remote Supabase Table &quot;subscribers&quot; Pending Setup
                          </h4>
                          <p className="font-body text-xs text-amber-800 mt-0.5">
                            Subscribers are temporarily safeguarded locally. Run the idempotent SQL migration in your Supabase SQL Editor to enable full remote cloud persistence.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={handleCopySubscribersSql}
                          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-headline text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedSubscribersSql ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied SQL!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy SQL Script</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowSubscribersSqlModal(true)}
                          className="px-3 py-2 rounded-xl border border-amber-300 hover:bg-amber-100 text-amber-800 font-headline text-xs font-bold transition-all cursor-pointer"
                        >
                          View SQL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Total Subscribers
                        </span>
                        <span className="font-headline font-black text-2xl text-slate-900 mt-1 block">
                          {subscribersList.length}
                        </span>
                        <span className="font-body text-[11px] text-emerald-600 font-bold mt-0.5 inline-block">
                          Active Community Leads
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#016ba5] flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Explorer Club
                        </span>
                        <span className="font-headline font-black text-2xl text-[#016ba5] mt-1 block">
                          {explorerClubCount}
                        </span>
                        <span className="font-body text-[11px] text-slate-400 font-medium mt-0.5 inline-block">
                          Store & Quest Blueprints
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Parenting Digest
                        </span>
                        <span className="font-headline font-black text-2xl text-emerald-600 mt-1 block">
                          {parentingDigestCount}
                        </span>
                        <span className="font-body text-[11px] text-slate-400 font-medium mt-0.5 inline-block">
                          Resource Guides & Blogs
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="font-body text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          New (Last 30 Days)
                        </span>
                        <span className="font-headline font-black text-2xl text-[#fa8221] mt-1 block">
                          {newThisMonthCount}
                        </span>
                        <span className="font-body text-[11px] text-[#fa8221] font-bold mt-0.5 inline-block">
                          Recent Growth
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#fa8221] flex items-center justify-center">
                        <UserPlus className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative flex-1 w-full sm:w-auto">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                        placeholder="Search subscribers by email address..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-[#016ba5] focus:ring-1 focus:ring-[#016ba5] transition-all"
                      />
                      {subscriberSearch && (
                        <button
                          onClick={() => setSubscriberSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-xs font-body text-slate-500 whitespace-nowrap">Filter Source:</span>
                      <select
                        value={subscriberSourceFilter}
                        onChange={(e) => setSubscriberSourceFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-body bg-white focus:outline-none focus:border-[#016ba5]"
                      >
                        <option value="all">All Sources ({subscribersList.length})</option>
                        <option value="explorer_club">Explorer Club ({explorerClubCount})</option>
                        <option value="parenting_digest">Parenting Digest ({parentingDigestCount})</option>
                        <option value="admin_manual">Admin Manual</option>
                      </select>
                    </div>
                  </div>

                  {/* Subscribers Data Table */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/75">
                            <th className="py-3.5 px-6 font-headline font-bold text-xs text-slate-700 uppercase tracking-wider">
                              Subscriber Email
                            </th>
                            <th className="py-3.5 px-6 font-headline font-bold text-xs text-slate-700 uppercase tracking-wider">
                              Acquisition Channel
                            </th>
                            <th className="py-3.5 px-6 font-headline font-bold text-xs text-slate-700 uppercase tracking-wider">
                              Subscribed At
                            </th>
                            <th className="py-3.5 px-6 font-headline font-bold text-xs text-slate-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="py-3.5 px-6 font-headline font-bold text-xs text-slate-700 uppercase tracking-wider text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-body">
                          {subscribersLoading ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-slate-500">
                                <Loader2 className="w-6 h-6 text-[#016ba5] animate-spin mx-auto mb-2" />
                                <span>Loading subscribers list...</span>
                              </td>
                            </tr>
                          ) : filteredSubscribers.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-16 text-center text-slate-500">
                                <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <h4 className="font-headline font-bold text-slate-700 text-sm">No Subscribers Found</h4>
                                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                                  {subscriberSearch || subscriberSourceFilter !== 'all'
                                    ? 'No subscriber matches your current search filters.'
                                    : 'When parents subscribe via the Explorer Club footer form or parenting digest, their emails will appear here in real time.'}
                                </p>
                                {(subscriberSearch || subscriberSourceFilter !== 'all') && (
                                  <button
                                    onClick={() => {
                                      setSubscriberSearch('');
                                      setSubscriberSourceFilter('all');
                                    }}
                                    className="mt-3 text-xs font-headline font-bold text-[#016ba5] hover:underline"
                                  >
                                    Reset Filters
                                  </button>
                                )}
                              </td>
                            </tr>
                          ) : (
                            filteredSubscribers.map((sub) => {
                              const isExplorerClub = sub.source === 'explorer_club';
                              const isParenting = sub.source === 'parenting_digest';

                              return (
                                <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-4 px-6 font-medium text-slate-900">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <span className="font-bold block text-slate-900 select-all">{sub.email}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">ID: {sub.id.slice(0, 13)}...</span>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-4 px-6">
                                    {isExplorerClub ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-headline font-bold bg-sky-50 text-sky-700 border border-sky-200">
                                        <Sparkles className="w-3 h-3 text-sky-600" />
                                        <span>Explorer Club</span>
                                      </span>
                                    ) : isParenting ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-headline font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <BookOpen className="w-3 h-3 text-emerald-600" />
                                        <span>Parenting Digest</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-headline font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                        <UserCheck className="w-3 h-3 text-purple-600" />
                                        <span>{sub.source}</span>
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-4 px-6 text-slate-600">
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-slate-800">
                                        {new Date(sub.createdAt).toLocaleDateString(undefined, {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="py-4 px-6">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                      Active
                                    </span>
                                  </td>

                                  <td className="py-4 px-6 text-right">
                                    <button
                                      type="button"
                                      onClick={() => setDeletingSubscriber(sub)}
                                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                      title="Remove subscriber"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

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
            {activeTab === 'analytics' && (() => {
              const currentAnalytics = getFilteredSiteMetrics(analyticsTimeframe, orders, productsList, metrics);
              return (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Header with Title and Timeframe Filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h2 className="font-headline text-2xl font-black text-slate-900 dark:text-white">
                          Tableau de Bord & Métriques Clés
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#016ba5] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                          En direct
                        </span>
                      </div>
                      <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                        Performance commerciale, volume des ventes et dynamique des kits d'apprentissage.
                      </p>
                    </div>

                    {/* Timeframe Quick-Filter Buttons */}
                    <div className="bg-white dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center flex-wrap gap-1">
                      <div className="flex items-center gap-1 px-2 text-slate-400 hidden sm:flex">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-headline font-bold uppercase tracking-wider">Période:</span>
                      </div>

                      {[
                        { id: 'overview', label: "Vue d'ensemble" },
                        { id: 'today', label: "Aujourd'hui" },
                        { id: 'week', label: 'Cette semaine' },
                        { id: 'month', label: 'Ce mois' },
                        { id: 'year', label: 'Cette année' },
                      ].map((tf) => (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => setAnalyticsTimeframe(tf.id as AnalyticsTimeframe)}
                          className={`px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer ${
                            analyticsTimeframe === tf.id
                              ? 'bg-[#016ba5] dark:bg-[#38BDF8] text-white dark:text-slate-900 shadow-xs'
                              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4 Primary Performance KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Orders */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2540]/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                          <span className="font-headline font-bold text-xs uppercase tracking-wider">Commandes</span>
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center">
                            <Package className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="font-headline text-3xl font-black text-slate-900 dark:text-white">
                          {currentAnalytics.totalOrders}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{currentAnalytics.statusBreakdown.confirmed + currentAnalytics.statusBreakdown.delivered} validées / livrées</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{currentAnalytics.statusBreakdown.pending_cod} COD</span>
                      </div>
                    </div>

                    {/* Card 2: Gross Revenue */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2540]/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                          <span className="font-headline font-bold text-xs uppercase tracking-wider">Chiffre d'Affaires</span>
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Coins className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="font-headline text-3xl font-black text-slate-900 dark:text-white truncate">
                          {formatPrice(currentAnalytics.totalRevenue, 'fr')}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Période: {currentAnalytics.timeframeLabel}</span>
                      </div>
                    </div>

                    {/* Card 3: Average Order Value / AOV */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2540]/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                          <span className="font-headline font-bold text-xs uppercase tracking-wider">Panier Moyen (AOV)</span>
                          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="font-headline text-3xl font-black text-[#7C3AED] dark:text-purple-300 truncate">
                          {formatPrice(currentAnalytics.averageOrderValue, 'fr')}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                        Valeur moyenne par commande
                      </div>
                    </div>

                    {/* Card 4: Site Visits / Traffic */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2540]/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                          <span className="font-headline font-bold text-xs uppercase tracking-wider">Visites Estimées</span>
                          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#fa8221] dark:text-amber-400 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        <h3 className="font-headline text-3xl font-black text-slate-900 dark:text-white">
                          {currentAnalytics.siteVisits.toLocaleString()}
                        </h3>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Taux de conversion:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{currentAnalytics.conversionRate}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Top Featured Products Leaderboard ("Produits vedettes") */}
                  <div className="bg-white dark:bg-[#0A2540]/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <div>
                        <h4 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                          Produits Vedettes & Meilleures Ventes
                        </h4>
                        <p className="font-body text-xs text-slate-500 dark:text-slate-400">
                          Classement des kits d'apprentissage et chroniques pour: <strong className="text-[#016ba5] dark:text-[#38BDF8]">{currentAnalytics.timeframeLabel}</strong>
                        </p>
                      </div>
                      <span className="text-xs font-headline font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit">
                        {currentAnalytics.topProducts.length} kits répertoriés
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentAnalytics.topProducts.map((prod, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Rank Badge */}
                            <div className={`w-8 h-8 rounded-xl font-headline font-black text-xs flex items-center justify-center shrink-0 ${
                              idx === 0 
                                ? 'bg-amber-400 text-slate-950 shadow-xs' 
                                : idx === 1 
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' 
                                : idx === 2 
                                ? 'bg-amber-700/20 text-amber-700 dark:text-amber-400' 
                                : 'bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8]'
                            }`}>
                              #{idx + 1}
                            </div>

                            {/* Product Thumbnail */}
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-600">
                              {prod.imageUrl ? (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <Package className="w-5 h-5" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <h5 className="font-headline font-bold text-xs text-slate-900 dark:text-white truncate">
                                {prod.title}
                              </h5>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-headline font-semibold text-blue-600 dark:text-blue-400">
                                  {prod.unitsSold} vendus
                                </span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className={`text-[10px] font-bold ${
                                  prod.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                                }`}>
                                  {prod.inStock ? 'En stock' : 'Rupture'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Revenue */}
                          <span className="font-headline font-black text-sm text-slate-900 dark:text-white shrink-0">
                            {formatPrice(prod.revenue, 'fr')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts Grid: Dynamic Velocity Trend + Planet World Engagement */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Dynamic Velocity Chart (Cols 1-7) */}
                    <div className="lg:col-span-7 bg-white dark:bg-[#0A2540]/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                            Activité & Vélocité des Ventes
                          </h4>
                          <span className="font-body text-xs text-slate-500 dark:text-slate-400">
                            Répartition chronologique pour {currentAnalytics.timeframeLabel}
                          </span>
                        </div>
                        <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {currentAnalytics.trendData.length} intervalles
                        </span>
                      </div>

                      <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-800">
                        {currentAnalytics.trendData.map((t, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <span className="text-[10px] font-body text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {t.revenue} Dhs
                            </span>
                            <div 
                              style={{ height: `${Math.max(18, Math.min(100, (t.revenue / Math.max(1, currentAnalytics.totalRevenue * 0.4 || 400)) * 100))}%` }}
                              className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-[#016ba5] to-[#fa8221] group-hover:brightness-110 transition-all shadow-sm"
                            />
                            <span className="font-headline font-bold text-xs text-slate-600 dark:text-slate-400">
                              {t.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-body text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-[#016ba5]" />
                          <span>Commandes ({currentAnalytics.totalOrders})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-[#fa8221]" />
                          <span>Chiffre d'affaires ({formatPrice(currentAnalytics.totalRevenue, 'fr')})</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Planet Sales Distribution (Cols 8-12) */}
                    <div className="lg:col-span-5 bg-white dark:bg-[#0A2540]/80 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h4 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-1">
                        Univers & Planètes Éducatives
                      </h4>
                      <span className="font-body text-xs text-slate-500 dark:text-slate-400 block mb-6">
                        Distribution des kits commandés par pilier de valeurs
                      </span>

                      <div className="space-y-4">
                        {currentAnalytics.planetSales.map((p, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-headline font-bold">
                              <span className="text-slate-800 dark:text-slate-200">{p.planet}</span>
                              <span className="text-slate-500 dark:text-slate-400">{p.salesCount} kits</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700/60 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${Math.max(12, (p.salesCount / Math.max(1, currentAnalytics.totalOrders)) * 100)}%`,
                                  backgroundColor: p.color
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}

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
                                  ) : adm.role === 'content_manager' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <BookOpen className="w-3 h-3 text-emerald-600" /> Content Manager
                                    </span>
                                  ) : adm.role === 'marketplace_manager' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <ShoppingBag className="w-3 h-3 text-indigo-600" /> Marketplace Manager
                                    </span>
                                  ) : adm.role === 'support_admin' || adm.role === 'support' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <MessageSquare className="w-3 h-3 text-sky-600" /> Support Specialist
                                    </span>
                                  ) : adm.role === 'manager' ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <ShieldCheck className="w-3 h-3 text-slate-600" /> Manager
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-headline font-bold text-[10px] flex items-center gap-1 w-max">
                                      <Shield className="w-3 h-3 text-amber-600" /> Full Administrator
                                    </span>
                                  )}
                                  <span className="text-[10px] font-body text-slate-400 mt-1 block">
                                    {adm.permissions ? `${adm.permissions.length} active tabs` : 'Standard permissions'}
                                  </span>
                                </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                {adm.createdBy}
                              </td>
                              <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                {new Date(adm.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {adm.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() ? (
                                  <span className="text-[10px] font-headline font-bold text-slate-400 italic">
                                    Permanent Owner
                                  </span>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditAdminModal(adm)}
                                      className="px-2.5 py-1.5 rounded-lg text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 transition-colors inline-flex items-center gap-1 text-[11px] font-headline font-bold shadow-2xs cursor-pointer"
                                      title="Edit Manager Access & Role"
                                    >
                                      <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                                      <span>Edit Access</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRevokeAdmin(adm.email)}
                                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors inline-flex items-center gap-1 text-[11px] font-headline font-semibold cursor-pointer"
                                      title="Revoke Administrator Access"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Revoke</span>
                                    </button>
                                  </div>
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
          </div>
        </main>
      </div>

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
            <p className="font-body text-xs text-slate-500 mb-5 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingProduct.title}</strong>? This will remove the item from the Supabase products table and all customer marketplace catalogs.
            </p>

            {deletingProductError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{deletingProductError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeletingProduct(null);
                  setDeletingProductError(null);
                }}
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

      {/* ========================================================
          BLOG MODALS (Create/Edit, Delete, Preview)
         ======================================================== */}

      {/* 1. Add / Edit Blog Post Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowBlogModal(false);
                setEditingBlog(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" size="sm">
                {editingBlog ? 'Edit Article' : 'New Article'}
              </Badge>
              <span className="font-body text-xs text-slate-400">
                Supabase Blogs Database Sync
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
              {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6">
              Publish educational articles and child development guides directly to the public website.
            </p>

            {blogModalError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{blogModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveBlog} className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => {
                      setBlogTitle(e.target.value);
                      if (!editingBlog && !blogSlug) {
                        setBlogSlug(e.target.value.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
                      }
                    }}
                    placeholder="e.g. Raising Resilient Kids in the Digital Age"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    URL Slug (Optional identifier)
                  </label>
                  <input
                    type="text"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="e.g. raising-resilient-kids"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  >
                    {DEFAULT_BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom">+ Custom Category</option>
                  </select>
                </div>

                {blogCategory === 'custom' ? (
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Custom Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={blogCustomCategory}
                      onChange={(e) => setBlogCustomCategory(e.target.value)}
                      placeholder="e.g. Early Childhood Psychology"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                    />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Article Excerpt (Card Summary) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="A concise, compelling 1-2 sentence summary displayed on card previews..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                />
              </div>

              {/* Full Article Content */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-headline font-bold text-slate-700">
                    Full Content (Markdown / Multi-paragraph text) *
                  </label>
                  <span className="font-body text-[11px] text-slate-400">
                    Supports ### Headings and paragraphs
                  </span>
                </div>
                <textarea
                  required
                  rows={8}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write or paste your article content here. Use paragraphs and Markdown headers (### Section Title) for structured formatting..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] leading-relaxed"
                />
              </div>

              {/* Author & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={blogAuthorName}
                    onChange={(e) => setBlogAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Amina Mansour"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                    Author Credentials / Role
                  </label>
                  <input
                    type="text"
                    value={blogAuthorRole}
                    onChange={(e) => setBlogAuthorRole(e.target.value)}
                    placeholder="e.g. Child Development Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />
                </div>
              </div>

              {/* Cover Image URL & Direct Upload */}
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Cover Image
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="url"
                    value={blogImageUrl}
                    onChange={(e) => setBlogImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload file"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                  />

                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-headline font-bold cursor-pointer transition-colors shrink-0">
                    {blogImageUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#016ba5]" />
                    ) : (
                      <UploadCloud className="w-4 h-4 text-[#016ba5]" />
                    )}
                    <span>{blogImageUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={blogImageUploading}
                      onChange={handleBlogImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {blogImageUrl && (
                  <div className="mt-2.5 flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <img
                      src={blogImageUrl}
                      alt="Cover preview"
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-headline font-bold text-xs text-slate-800 block">Cover Image Preview</span>
                      <span className="font-mono text-[10px] text-slate-400 truncate block">{blogImageUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBlogImageUrl('')}
                      className="text-xs text-red-500 hover:text-red-700 font-headline font-bold px-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={blogTags}
                  onChange={(e) => setBlogTags(e.target.value)}
                  placeholder="e.g. parenting, screen-free, emotional-wellness, values"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                />
                {blogTags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {blogTags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-body text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles: Published & Featured */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogIsPublished}
                    onChange={(e) => setBlogIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#fa8221] rounded border-slate-300 focus:ring-[#fa8221]"
                  />
                  <div>
                    <span className="font-headline font-bold text-xs text-slate-800 block">
                      Published Status
                    </span>
                    <span className="font-body text-[11px] text-slate-500 block">
                      {blogIsPublished ? 'Live on the public website' : 'Saved as private draft'}
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogFeatured}
                    onChange={(e) => setBlogFeatured(e.target.checked)}
                    className="w-4 h-4 text-[#fa8221] rounded border-slate-300 focus:ring-[#fa8221]"
                  />
                  <div>
                    <span className="font-headline font-bold text-xs text-slate-800 block">
                      Featured Highlight
                    </span>
                    <span className="font-body text-[11px] text-slate-500 block">
                      Pinned at the top of parenting resources
                    </span>
                  </div>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlog(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  type="submit"
                  disabled={blogSubmitting}
                  icon={blogSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {blogSubmitting ? 'Saving Post...' : editingBlog ? 'Update Post' : 'Publish Blog Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Delete Blog Confirmation Modal */}
      {deletingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setDeletingBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-2">
              Delete Blog Post?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <strong>{deletingBlog.title}</strong>? This action will remove the article from the public portal and delete its Supabase record.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingBlog(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={deletingBlogSubmitting}
                onClick={handleConfirmDeleteBlog}
                className="bg-red-600 hover:bg-red-700 text-white"
                icon={deletingBlogSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                iconPosition="left"
              >
                {deletingBlogSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Preview Blog Article Modal */}
      {previewingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setPreviewingBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {previewingBlog.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden max-h-64 bg-slate-100 border border-slate-200">
                <img
                  src={previewingBlog.imageUrl}
                  alt={previewingBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm">{previewingBlog.category}</Badge>
              <span className="font-body text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {previewingBlog.readTime}
              </span>
              <span className="font-body text-xs text-slate-400">
                • {new Date(previewingBlog.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h2 className="font-headline text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
              {previewingBlog.title}
            </h2>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#016ba5] text-white flex items-center justify-center font-headline font-bold text-sm">
                {previewingBlog.authorName.charAt(0)}
              </div>
              <div>
                <span className="font-headline font-bold text-xs text-slate-800 block">
                  {previewingBlog.authorName}
                </span>
                <span className="font-body text-[11px] text-slate-500 block">
                  {previewingBlog.authorRole || 'Contributor'}
                </span>
              </div>
            </div>

            <div className="font-body text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {previewingBlog.content}
            </div>

            {previewingBlog.tags && previewingBlog.tags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {previewingBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-body text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewingBlog(null)}
              >
                Close Preview
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
                  onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="manager">General Manager (Operations & Catalog)</option>
                  <option value="content_manager">Content Manager (Blogs, Explorer Club, Messages)</option>
                  <option value="marketplace_manager">Marketplace Manager (Products, Categories, Coupons, Orders)</option>
                  <option value="support_admin">Support Specialist (Orders & Customer Support)</option>
                  <option value="admin">Full Administrator (Full System Operations & Settings)</option>
                </select>
                <p className="text-[11px] font-body text-slate-500 mt-1">
                  Managers hold operational access across their assigned domains with granular tab permissions.
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

      {/* Super Admin: Edit Manager Access & Role Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEditingAdmin(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-headline font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-purple-600" /> Access Management
              </span>
              <span className="text-[11px] font-body text-slate-400">
                Super Admin Master Authority
              </span>
            </div>

            <h3 className="font-headline text-2xl font-black text-slate-900 mb-1">
              Edit Manager Access & Role
            </h3>
            <p className="font-body text-xs text-slate-500 mb-5">
              Modify account roles and fine-tune granular tab permissions across the platform.
            </p>

            {editAdminError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs font-body text-red-600 mb-5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{editAdminError}</span>
              </div>
            )}

            {/* Target Account Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-headline font-bold text-sm">
                  {editingAdmin.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-headline font-bold text-xs text-slate-900 block">
                    {editingAdmin.fullName}
                  </span>
                  <span className="font-body text-[11px] text-slate-500 font-mono block">
                    {editingAdmin.email}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-headline font-bold text-[10px]">
                Current: {ROLE_DISPLAY_NAMES[editingAdmin.role] || editingAdmin.role}
              </span>
            </div>

            <form onSubmit={handleSaveEditAdmin} className="space-y-5">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1">
                  Manager Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editAdminFullName}
                  onChange={(e) => setEditAdminFullName(e.target.value)}
                  placeholder="Manager Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-body text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1.5">
                  Administrative Role Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'content_manager', name: 'Content Manager', icon: BookOpen, desc: 'Blogs, Explorer Club, Messages' },
                    { id: 'marketplace_manager', name: 'Marketplace Manager', icon: ShoppingBag, desc: 'Products, Categories, Coupons, Orders' },
                    { id: 'support_admin', name: 'Support Specialist', icon: MessageSquare, desc: 'Orders, Inquiries & Support' },
                    { id: 'admin', name: 'Full Administrator', icon: Shield, desc: 'Full operations, inventory & settings' },
                    { id: 'manager', name: 'General Manager', icon: ShieldCheck, desc: 'Broad catalog & operations oversight' },
                    { id: 'super_admin', name: 'Super Admin', icon: Crown, desc: 'Unrestricted master owner privileges' },
                  ].map((roleOption) => {
                    const IconComponent = roleOption.icon;
                    const isSelected = editAdminRole === roleOption.id;
                    return (
                      <button
                        key={roleOption.id}
                        type="button"
                        onClick={() => handleRoleChangeInEditModal(roleOption.id as AdminRole)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-headline font-bold text-xs text-slate-900">
                            <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-500'}`} />
                            <span>{roleOption.name}</span>
                          </div>
                          <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                          }`}>
                            {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                          </span>
                        </div>
                        <span className="font-body text-[10px] text-slate-500 leading-snug">
                          {roleOption.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Tab Permissions Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-headline font-bold text-slate-700">
                    Granular Tab Permissions ({editAdminPermissions.length} enabled)
                  </label>
                  <span className="font-body text-[10px] text-slate-400">
                    Selectively grant or restrict specific sections
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
                  {/* Category: Marketplace & Commerce */}
                  <div>
                    <span className="text-[10px] font-headline font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Commerce & Marketplace
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { tab: 'orders', label: 'Orders' },
                        { tab: 'products', label: 'Products' },
                        { tab: 'categories', label: 'Categories' },
                      ].map(({ tab, label }) => {
                        const checked = editAdminPermissions.includes(tab as AdminTabPermission);
                        return (
                          <label
                            key={tab}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-headline font-semibold cursor-pointer transition-colors ${
                              checked ? 'bg-white border-purple-300 text-slate-900 shadow-2xs' : 'bg-slate-100/60 border-slate-200 text-slate-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermissionInEditModal(tab as AdminTabPermission)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: Promotions & Marketing */}
                  <div>
                    <span className="text-[10px] font-headline font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Promotions & Marketing
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { tab: 'coupons', label: 'Coupons & Promo Codes' },
                        { tab: 'subscribers', label: 'Explorer Club (Subscribers)' },
                      ].map(({ tab, label }) => {
                        const checked = editAdminPermissions.includes(tab as AdminTabPermission);
                        return (
                          <label
                            key={tab}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-headline font-semibold cursor-pointer transition-colors ${
                              checked ? 'bg-white border-purple-300 text-slate-900 shadow-2xs' : 'bg-slate-100/60 border-slate-200 text-slate-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermissionInEditModal(tab as AdminTabPermission)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: Editorial & Support */}
                  <div>
                    <span className="text-[10px] font-headline font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      Content & Support
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { tab: 'blogs', label: 'Blog & Parenting Articles' },
                        { tab: 'messages', label: 'Customer Contact Messages' },
                      ].map(({ tab, label }) => {
                        const checked = editAdminPermissions.includes(tab as AdminTabPermission);
                        return (
                          <label
                            key={tab}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-headline font-semibold cursor-pointer transition-colors ${
                              checked ? 'bg-white border-purple-300 text-slate-900 shadow-2xs' : 'bg-slate-100/60 border-slate-200 text-slate-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermissionInEditModal(tab as AdminTabPermission)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category: System & Intelligence */}
                  <div>
                    <span className="text-[10px] font-headline font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                      System & Platform
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { tab: 'analytics', label: 'Key Metrics & Analytics' },
                        { tab: 'settings', label: 'Platform & Widget Settings' },
                      ].map(({ tab, label }) => {
                        const checked = editAdminPermissions.includes(tab as AdminTabPermission);
                        return (
                          <label
                            key={tab}
                            className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-headline font-semibold cursor-pointer transition-colors ${
                              checked ? 'bg-white border-purple-300 text-slate-900 shadow-2xs' : 'bg-slate-100/60 border-slate-200 text-slate-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePermissionInEditModal(tab as AdminTabPermission)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAdmin(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="cta"
                  size="sm"
                  disabled={editAdminSubmitting}
                  icon={editAdminSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {editAdminSubmitting ? 'Saving Access...' : 'Save Access & Roles'}
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
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-body space-y-1.5 mb-4">
              <div><strong>Recipient:</strong> {selectedOrder.customerName}</div>
              <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              <div>
                <strong>Shipping Address:</strong> {selectedOrder.shippingAddress},{' '}
                {selectedOrder.city} {selectedOrder.postalCode}, {selectedOrder.country}
              </div>
            </div>

            {/* Payment & Legal Compliance Card */}
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs font-body space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold text-slate-800 flex items-center gap-1.5">
                  {selectedOrder.paymentMethod === 'payzone' ? (
                    <>
                      <CreditCard className="w-4 h-4 text-[#016ba5]" />
                      Payment: Credit Card via Payzone / CMI
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Payment: Cash on Delivery (COD)
                    </>
                  )}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedOrder.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {selectedOrder.paymentStatus === 'paid' ? 'Paid (3D-Secure)' : 'Pending Delivery'}
                </span>
              </div>
              {selectedOrder.paymentRef && (
                <div className="text-[11px] text-slate-600">
                  <strong>CMI Transaction Ref:</strong>{' '}
                  <code className="font-mono text-slate-800 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                    {selectedOrder.paymentRef}
                  </code>
                </div>
              )}
              {selectedOrder.paymentToken && (
                <div className="text-[11px] text-slate-600">
                  <strong>Gateway Token:</strong>{' '}
                  <code className="font-mono text-slate-800 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                    {selectedOrder.paymentToken}
                  </code>
                </div>
              )}
              <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Moroccan Law 09-08 (CNDP):</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {selectedOrder.cndpConsent !== false ? 'Consent Verified (Dahir 1-09-15)' : 'Consent Missing'}
                </span>
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
      {/* Delete Subscriber Confirmation Modal */}
      {deletingSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-headline font-black text-xl text-slate-900 mb-2">
              Remove Subscriber?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">{deletingSubscriber.email}</strong> from the Explorer Club subscribers list? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingSubscriber(null)}
                disabled={deletingSubscriberSubmitting}
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleConfirmDeleteSubscriber}
                disabled={deletingSubscriberSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-headline text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {deletingSubscriberSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Delete Subscriber</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscriber Modal */}
      {showAddSubscriberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowAddSubscriberModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">Community Lead</Badge>
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-1">
              Add Subscriber Manually
            </h3>
            <p className="font-body text-xs text-slate-500 mb-5">
              Register a parent or community member email directly into Supabase.
            </p>

            {newSubError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-headline text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{newSubError}</span>
              </div>
            )}

            <form onSubmit={handleSaveManualSubscriber} className="space-y-4">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-[#016ba5] focus:ring-1 focus:ring-[#016ba5]"
                />
              </div>

              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 mb-1.5">
                  Acquisition Channel / Source
                </label>
                <select
                  value={newSubSource}
                  onChange={(e) => setNewSubSource(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-body bg-white focus:outline-none focus:border-[#016ba5]"
                >
                  <option value="explorer_club">Explorer Club (Store Footer)</option>
                  <option value="parenting_digest">Parenting Digest (Blog)</option>
                  <option value="admin_manual">Admin Direct Registration</option>
                  <option value="partner_event">Partner / School Event</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowAddSubscriberModal(false)}
                  disabled={newSubSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="cta"
                  size="sm"
                  type="submit"
                  disabled={newSubSubmitting || !newSubEmail.trim()}
                  icon={newSubSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {newSubSubmitting ? 'Adding...' : 'Add Subscriber'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscribers SQL Migration Modal */}
      {showSubscribersSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowSubscribersSqlModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">Supabase Database Setup</Badge>
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-1">
              Explorer Club Subscribers SQL Migration
            </h3>
            <p className="font-body text-xs text-slate-500 mb-4">
              Execute this script in your Supabase SQL Editor to create the <code className="text-[#016ba5] bg-sky-50 px-1 py-0.5 rounded font-mono">public.subscribers</code> table and configure public insert + admin read/delete Row-Level Security policies.
            </p>

            <div className="relative flex-1 bg-slate-900 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-emerald-400 max-h-[50vh] border border-slate-800">
              <pre className="whitespace-pre-wrap">{SUBSCRIBERS_SCHEMA_SQL}</pre>
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
                  onClick={handleCopySubscribersSql}
                  icon={copiedSubscribersSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {copiedSubscribersSql ? 'Copied SQL!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubscribersSqlModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Posts SQL Migration Modal */}
      {showBlogSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={() => setShowBlogSqlModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" size="sm">Supabase Database Setup</Badge>
            </div>

            <h3 className="font-headline text-xl font-black text-slate-900 mb-1">
              Blogs & Parenting Resources SQL Migration
            </h3>
            <p className="font-body text-xs text-slate-500 mb-4">
              Execute this script in your Supabase SQL Editor to create the <code className="text-[#016ba5] bg-sky-50 px-1 py-0.5 rounded font-mono">public.blogs</code> table, enable real-time replication, and configure public read + authenticated admin write Row-Level Security policies.
            </p>

            <div className="relative flex-1 bg-slate-900 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-emerald-400 max-h-[50vh] border border-slate-800">
              <pre className="whitespace-pre-wrap">{BLOGS_SCHEMA_SQL}</pre>
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
                  onClick={handleCopyBlogSql}
                  icon={copiedBlogSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {copiedBlogSql ? 'Copied SQL!' : 'Copy to Clipboard'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBlogSqlModal(false)}
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
