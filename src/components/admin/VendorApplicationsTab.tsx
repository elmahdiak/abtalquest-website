import React, { useState, useEffect } from 'react';
import {
  Store,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Eye,
  Trash2,
  Database,
  Copy,
  Check,
  X,
  Loader2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  fetchVendorApplications,
  updateVendorApplicationStatus,
  deleteVendorApplication,
  checkVendorDatabaseHealth,
  VENDOR_CATEGORIES,
  DEFAULT_VENDOR_APPLICATIONS,
  VENDOR_APPLICATIONS_SCHEMA_SQL,
  type VendorApplication,
  type VendorApplicationStatus,
  type VendorDatabaseHealth
} from '../../services/vendorService';
import { isSupabaseConfigured } from '../../supabaseClient';

export interface VendorApplicationsTabProps {
  currentUserEmail?: string;
  onPendingCountChange?: (count: number) => void;
}

export const VendorApplicationsTab: React.FC<VendorApplicationsTabProps> = ({
  currentUserEmail = 'akmahdi085@gmail.com',
  onPendingCountChange,
}) => {
  const [applications, setApplications] = useState<VendorApplication[]>(DEFAULT_VENDOR_APPLICATIONS);
  const [loading, setLoading] = useState(true);
  const [dbHealth, setDbHealth] = useState<VendorDatabaseHealth | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | VendorApplicationStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Feedback alerts
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState<VendorApplication | null>(null);

  // Status Change Confirmation Modal (Approve or Reject with Notes)
  const [statusModalApp, setStatusModalApp] = useState<VendorApplication | null>(null);
  const [statusModalTarget, setStatusModalTarget] = useState<VendorApplicationStatus>('approved');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [deletingApp, setDeletingApp] = useState<VendorApplication | null>(null);
  const [deletingSubmitting, setDeletingSubmitting] = useState(false);

  // SQL Schema Modal
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Lightbox Image Preview
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const data = await fetchVendorApplications();
      setApplications(data);
      const pending = data.filter(a => a.status === 'pending').length;
      onPendingCountChange?.(pending);
      const health = await checkVendorDatabaseHealth();
      setDbHealth(health);
    } catch (err: any) {
      console.warn('Failed to load vendor applications:', err);
      setActionError(err?.message || 'Failed to fetch vendor applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered List
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.productDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  // Open Status Change Modal
  const handleOpenStatusModal = (app: VendorApplication, newStatus: VendorApplicationStatus) => {
    setStatusModalApp(app);
    setStatusModalTarget(newStatus);
    setAdminNotes(app.adminNotes || (newStatus === 'approved' ? 'Meets child-safety criteria. Approved for merchant store.' : ''));
  };

  // Submit Status Change
  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalApp) return;

    setStatusSubmitting(true);
    try {
      const res = await updateVendorApplicationStatus(
        statusModalApp.id,
        statusModalTarget,
        adminNotes.trim(),
        currentUserEmail
      );

      if (res.success) {
        setApplications(prev =>
          prev.map(a =>
            a.id === statusModalApp.id
              ? {
                  ...a,
                  status: statusModalTarget,
                  adminNotes: adminNotes.trim(),
                  reviewedBy: currentUserEmail,
                  reviewedAt: new Date().toISOString(),
                }
              : a
          )
        );
        setActionSuccess(`Application for "${statusModalApp.shopName}" marked as ${statusModalTarget.toUpperCase()}!`);
        setTimeout(() => setActionSuccess(null), 3500);
        setStatusModalApp(null);
        if (selectedApp?.id === statusModalApp.id) {
          setSelectedApp(prev => prev ? { ...prev, status: statusModalTarget, adminNotes: adminNotes.trim() } : null);
        }
      } else {
        setActionError(res.error || 'Failed to update application status.');
      }
    } catch (err: any) {
      setActionError(err?.message || 'Error updating application status.');
    } finally {
      setStatusSubmitting(false);
    }
  };

  // Delete Application
  const handleConfirmDelete = async () => {
    if (!deletingApp) return;
    setDeletingSubmitting(true);
    try {
      const res = await deleteVendorApplication(deletingApp.id);
      if (res.success) {
        setApplications(prev => prev.filter(a => a.id !== deletingApp.id));
        setActionSuccess('Application removed successfully.');
        setTimeout(() => setActionSuccess(null), 3000);
        setDeletingApp(null);
        if (selectedApp?.id === deletingApp.id) {
          setSelectedApp(null);
        }
      } else {
        setActionError(res.error || 'Failed to delete application.');
      }
    } catch (err: any) {
      setActionError(err?.message || 'Error deleting application.');
    } finally {
      setDeletingSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER & METRICS BAR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-headline font-black text-slate-900 dark:text-white">
              Parent Vendors Applications
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-headline font-bold bg-[#fa8221]/15 text-[#fa8221] border border-[#fa8221]/20">
              {totalCount} Total
            </span>

            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-headline font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} Pending Review
              </span>
            )}

            {isSupabaseConfigured() && dbHealth?.tableExists && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Supabase Sync
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review incoming parent seller dossiers, inspect safety qualifications, verify sample photos, and grant merchant boutique access.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Applications"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-[#fa8221]")} />
          </button>

          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 font-headline text-xs font-bold transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-sky-500" />
            <span>Database Schema</span>
          </button>
        </div>
      </div>

      {/* Action Alerts */}
      {actionSuccess && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-headline font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-headline font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ========================================================
          2. METRIC SUMMARY STAT CARDS
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-headline font-black uppercase tracking-wider text-slate-400 block mb-1">
            Total Applications
          </span>
          <div className="text-2xl font-headline font-black text-slate-900 dark:text-white">
            {totalCount}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50 shadow-xs">
          <span className="text-[10px] font-headline font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
            Pending Review
          </span>
          <div className="text-2xl font-headline font-black text-amber-700 dark:text-amber-300">
            {pendingCount}
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs">
          <span className="text-[10px] font-headline font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
            Approved Vendors
          </span>
          <div className="text-2xl font-headline font-black text-emerald-700 dark:text-emerald-300">
            {approvedCount}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-[10px] font-headline font-black uppercase tracking-wider text-slate-400 block mb-1">
            Rejected
          </span>
          <div className="text-2xl font-headline font-black text-slate-600 dark:text-slate-300">
            {rejectedCount}
          </div>
        </div>
      </div>

      {/* ========================================================
          3. SEARCH & FILTERS BAR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, boutique, email, phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30"
          >
            <option value="all">All Categories</option>
            {VENDOR_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.labelEn}</option>
            ))}
          </select>

          {/* Status Filter Buttons */}
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              statusFilter === 'all'
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              statusFilter === 'pending'
                ? "bg-amber-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              statusFilter === 'approved'
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {/* ========================================================
          4. APPLICATIONS LIST / DOSSIERS
         ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-headline font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
              No vendor applications found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery ? 'Try clearing your search query or filters.' : 'Parent vendor applications submitted through the public form will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left: Applicant & Brand Details */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-headline font-bold text-base text-slate-900 dark:text-white">
                      {app.shopName}
                    </span>
                    <span className="text-xs text-slate-400">by</span>
                    <span className="font-headline text-xs font-bold text-slate-700 dark:text-slate-300">
                      {app.fullName}
                    </span>

                    {/* Status Pill */}
                    {app.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                        <Clock className="w-3 h-3" />
                        <span>Pending Review</span>
                      </span>
                    )}
                    {app.status === 'approved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        <CheckCircle className="w-3 h-3" />
                        <span>Approved Vendor</span>
                      </span>
                    )}
                    {app.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/25">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-headline font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {app.categoryLabel || app.category}
                    </span>

                    {app.targetAgeGroup && (
                      <span className="text-[11px] text-slate-400">
                        Ages: {app.targetAgeGroup}
                      </span>
                    )}
                  </div>

                  {/* Product Description */}
                  <p className="text-xs font-body text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 max-w-3xl">
                    {app.productDescription}
                  </p>

                  {/* Contact Shortcuts & Social */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-1 font-body">
                    <a
                      href={`mailto:${app.email}`}
                      className="inline-flex items-center gap-1 hover:text-[#016ba5] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{app.email}</span>
                    </a>

                    <a
                      href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#25D366] hover:underline transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>{app.phone} (WhatsApp)</span>
                    </a>

                    {app.websiteOrSocial && (
                      <a
                        href={app.websiteOrSocial}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Shop Link</span>
                      </a>
                    )}

                    <span className="text-[11px] text-slate-400">
                      Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right: Sample Images & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Sample Images Thumbnails */}
                  {app.sampleImages && app.sampleImages.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      {app.sampleImages.slice(0, 3).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLightboxImage(img)}
                          title="Click to view full photo"
                          className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform cursor-pointer shadow-xs"
                        >
                          <img src={img} alt="Sample" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {app.sampleImages.length > 3 && (
                        <span className="text-[11px] font-bold text-slate-400">
                          +{app.sampleImages.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      title="Inspect Full Dossier"
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-headline text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Quick Approve Button */}
                    {app.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(app, 'approved')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Quick Reject Button */}
                    {app.status !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(app, 'rejected')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-400 font-headline text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Delete Application Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingApp(app)}
                      title="Delete Application"
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          5. FULL DOSSIER INSPECTION MODAL
         ======================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-black text-lg text-slate-900 dark:text-white">
                    {selectedApp.shopName}
                  </h3>
                  <p className="text-xs text-slate-500">Applicant: {selectedApp.fullName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-5">
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-headline font-bold text-slate-600 dark:text-slate-300">
                  Current Status:
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-headline font-bold capitalize",
                  selectedApp.status === 'approved' && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                  selectedApp.status === 'pending' && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                  selectedApp.status === 'rejected' && "bg-red-500/15 text-red-700 dark:text-red-300"
                )}>
                  {selectedApp.status}
                </span>
              </div>

              {/* Applicant Info */}
              <div className="grid grid-cols-2 gap-4 text-xs font-body">
                <div>
                  <span className="text-slate-400 block mb-0.5">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="font-bold text-[#016ba5] hover:underline">
                    {selectedApp.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">WhatsApp / Phone</span>
                  <a
                    href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#25D366] hover:underline"
                  >
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Product Category</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedApp.categoryLabel || selectedApp.category}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Target Child Age</span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {selectedApp.targetAgeGroup} Years
                  </strong>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <span className="text-xs font-headline font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Creation Description & Workshop Philosophy:
                </span>
                <p className="text-xs font-body text-slate-600 dark:text-slate-300 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 leading-relaxed border border-slate-100 dark:border-slate-800">
                  {selectedApp.productDescription}
                </p>
              </div>

              {/* Sample Images Gallery */}
              {selectedApp.sampleImages && selectedApp.sampleImages.length > 0 && (
                <div>
                  <span className="text-xs font-headline font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Sample Product Photos ({selectedApp.sampleImages.length})
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedApp.sampleImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxImage(img)}
                        className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-102 transition-transform cursor-pointer shadow-xs"
                      >
                        <img src={img} alt="Product Sample" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Notes */}
              {selectedApp.adminNotes && (
                <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/50">
                  <span className="text-[11px] font-headline font-bold text-purple-900 dark:text-purple-300 block mb-1">
                    Internal Review Notes (Reviewed by {selectedApp.reviewedBy || 'Admin'}):
                  </span>
                  <p className="text-xs text-purple-800 dark:text-purple-200 font-body">
                    {selectedApp.adminNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] text-white font-headline text-xs font-bold hover:bg-[#20bd5a] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                {selectedApp.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApp(null);
                      handleOpenStatusModal(selectedApp, 'approved');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold transition-all cursor-pointer"
                  >
                    Approve Vendor
                  </button>
                )}
                {selectedApp.status !== 'rejected' && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApp(null);
                      handleOpenStatusModal(selectedApp, 'rejected');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. STATUS CHANGE & ADMIN NOTES MODAL
         ======================================================== */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="font-headline font-black text-lg text-slate-900 dark:text-white mb-2">
              {statusModalTarget === 'approved' ? 'Approve Parent Vendor' : 'Reject Application'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-body">
              Update the application status for <strong>{statusModalApp.shopName}</strong> ({statusModalApp.fullName}).
            </p>

            <form onSubmit={handleConfirmStatusChange} className="space-y-4">
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Internal Notes & Curator Feedback
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Non-toxic certificates verified. Boutique access granted."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-headline font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusSubmitting}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-headline text-xs font-bold shadow transition-all cursor-pointer",
                    statusModalTarget === 'approved' ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                  )}
                >
                  {statusSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Confirm {statusModalTarget === 'approved' ? 'Approval' : 'Rejection'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          7. DELETE CONFIRMATION MODAL
         ======================================================== */}
      {deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-black text-base text-slate-900 dark:text-white mb-2">
              Delete Vendor Application?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body mb-6">
              Are you sure you want to permanently delete the application for <strong>{deletingApp.shopName}</strong>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingApp(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 text-xs font-headline font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingSubmitting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold cursor-pointer"
              >
                {deletingSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. SQL SCHEMA MODAL
         ======================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-sky-500" />
                <h3 className="font-headline font-black text-base text-slate-900 dark:text-white">
                  Vendor Applications SQL Schema
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body mb-3">
              Run this SQL script in your Supabase SQL Editor to provision the <code>vendor_applications</code> table and access policies:
            </p>

            <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-[11px] text-slate-200 max-h-64 overflow-y-auto mb-4 border border-slate-800">
              <pre>{VENDOR_APPLICATIONS_SCHEMA_SQL}</pre>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Safe to run multiple times (idempotent <code>CREATE TABLE IF NOT EXISTS</code>).
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(VENDOR_APPLICATIONS_SCHEMA_SQL);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 3000);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fa8221] hover:bg-[#e0731a] text-white font-headline text-xs font-bold transition-all shadow cursor-pointer"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          9. LIGHTBOX IMAGE PREVIEW MODAL
         ======================================================== */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl">
            <img src={lightboxImage} alt="Sample product enlarged" className="max-w-full max-h-[85vh] object-contain" />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApplicationsTab;
