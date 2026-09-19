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
  SlidersHorizontal
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
  getContactMessagesForAdmin, 
  updateContactMessageStatus, 
  getSiteMetrics,
  type AdminOrder,
  type ContactMessage,
  type SiteMetrics 
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
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'analytics' | 'team' | 'settings'>('orders');
  const [whatsappPosition, setWhatsappPosition] = useState<WhatsAppPosition>(getStoredWhatsAppPosition);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

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
      const [ordersList, messagesList, siteStats] = await Promise.all([
        getAllOrdersForAdmin(),
        getContactMessagesForAdmin(),
        getSiteMetrics(),
      ]);

      setOrders(ordersList);
      setMessages(messagesList);
      setMetrics(siteStats);
    } catch (err) {
      console.warn('Dashboard data load error:', err);
    } finally {
      setLoadingData(false);
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
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
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
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all flex items-center gap-2 ${
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
                    <h2 className="font-headline text-2xl font-black text-slate-900">
                      Customer Orders ({orders.length})
                    </h2>
                    <p className="font-body text-xs text-slate-500">
                      Manage all kit and quest gear orders placed across the platform.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadDashboardData(true)}
                      icon={<Clock className="w-3.5 h-3.5" />}
                      iconPosition="left"
                    >
                      Refresh
                    </Button>
                  </div>
                </div>

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
                                <span className="font-bold text-slate-900 block">{order.id}</span>
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
                                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </span>
                                <span className="text-[11px] text-slate-500 line-clamp-1">
                                  {order.items.map((i) => `${i.productTitle} (×${i.quantity})`).join(', ')}
                                </span>
                              </td>

                              <td className="py-4 px-4 font-headline">
                                <span className="font-black text-slate-900 block">
                                  {order.totalAmount.toLocaleString()} MAD
                                </span>
                                <span className="font-gamification text-[#7C3AED] font-bold text-[10px]">
                                  +{order.totalXp} XP
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
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <strong className="font-headline text-slate-800 block">{item.productTitle}</strong>
                      <span className="text-slate-500 font-body">Qty: {item.quantity} × {item.unitPrice.toLocaleString()} MAD</span>
                    </div>
                    <span className="font-headline font-bold text-slate-900">
                      {(item.unitPrice * item.quantity).toLocaleString()} MAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <span className="font-body text-xs text-slate-500 block">Total Due:</span>
                <span className="font-headline font-black text-2xl text-slate-900">
                  {selectedOrder.totalAmount.toLocaleString()} MAD
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
    </div>
  );
};

export default AdminPortal;
