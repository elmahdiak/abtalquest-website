import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Film,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Check,
  Copy,
  Database,
  X,
  Loader2,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
  reorderBanners,
  uploadBannerMedia,
  checkBannersDatabaseHealth,
  BANNER_GUIDELINES,
  DEFAULT_BANNERS,
  BANNERS_SCHEMA_SQL,
  type MarketplaceBanner,
  type SlideType,
  type BannersDatabaseHealth
} from '../../services/bannerService';
import { isSupabaseConfigured } from '../../supabaseClient';

export interface MarketplaceBannersTabProps {
  onBannersCountChange?: (count: number) => void;
}

export const MarketplaceBannersTab: React.FC<MarketplaceBannersTabProps> = ({
  onBannersCountChange,
}) => {
  const { t } = useLanguage();

  const [banners, setBanners] = useState<MarketplaceBanner[]>(DEFAULT_BANNERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [dbHealth, setDbHealth] = useState<BannersDatabaseHealth | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all');

  // Action feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<MarketplaceBanner | null>(null);
  const [modalSubmitting, setModalSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formType, setFormType] = useState<SlideType>('image');
  const [formMediaUrl, setFormMediaUrl] = useState<string>('');
  const [formTag, setFormTag] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCtaText, setFormCtaText] = useState<string>('Shop Now');
  const [formCtaLink, setFormCtaLink] = useState<string>('thinkers');
  const [formPlanet, setFormPlanet] = useState<string>('thinkers');
  const [formBgGradient, setFormBgGradient] = useState<string>('from-[#016ba5] via-[#0284c7] to-[#0369a1]');
  const [formDuration, setFormDuration] = useState<string>('5');
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Media Upload state
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Delete modal state
  const [deletingBanner, setDeletingBanner] = useState<MarketplaceBanner | null>(null);
  const [deletingSubmitting, setDeletingSubmitting] = useState<boolean>(false);

  // SQL Schema modal state
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Load banners and check DB status
  const loadData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const data = await fetchBanners();
      setBanners(data);
      onBannersCountChange?.(data.length);
      const health = await checkBannersDatabaseHealth();
      setDbHealth(health);
    } catch (err: any) {
      console.warn('Failed to load banners:', err);
      setActionError(err?.message || 'Failed to fetch banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered banners
  const filteredBanners = banners.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tag && b.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.planet && b.planet.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || b.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormType('image');
    setFormMediaUrl('');
    setFormTag('New Season');
    setFormTitle('');
    setFormDescription('');
    setFormCtaText('Explore Gear');
    setFormCtaLink('thinkers');
    setFormPlanet('thinkers');
    setFormBgGradient('from-[#016ba5] via-[#0284c7] to-[#0369a1]');
    setFormDuration('5');
    setFormIsActive(true);
    setModalError(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (banner: MarketplaceBanner) => {
    setEditingBanner(banner);
    setFormType(banner.type);
    setFormMediaUrl(banner.mediaUrl);
    setFormTag(banner.tag || '');
    setFormTitle(banner.title);
    setFormDescription(banner.description || '');
    setFormCtaText(banner.ctaText || 'Explore Now');
    setFormCtaLink(banner.ctaLink || '#marketplace');
    setFormPlanet(banner.planet || 'thinkers');
    setFormBgGradient(banner.bgGradient || 'from-[#016ba5] via-[#0284c7] to-[#0369a1]');
    setFormDuration(String(banner.duration || 5));
    setFormIsActive(banner.isActive);
    setModalError(null);
    setShowModal(true);
  };

  // Handle Media File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    setModalError(null);

    try {
      const publicUrl = await uploadBannerMedia(file, formType);
      setFormMediaUrl(publicUrl);
      setActionSuccess(`Successfully uploaded ${formType === 'video' ? 'video loop' : 'banner image'}!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      console.error('Banner upload error:', err);
      setModalError(err?.message || 'Failed to upload media file.');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Save Banner (Add or Update)
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setModalError('Please enter a headline / title for this slide.');
      return;
    }
    if (!formMediaUrl.trim()) {
      setModalError(`Please upload or provide a URL for the ${formType === 'video' ? 'video loop' : 'banner image'}.`);
      return;
    }

    setModalSubmitting(true);
    setModalError(null);

    try {
      if (editingBanner) {
        await updateBanner(editingBanner.id, {
          type: formType,
          mediaUrl: formMediaUrl.trim(),
          tag: formTag.trim(),
          title: formTitle.trim(),
          description: formDescription.trim(),
          ctaText: formCtaText.trim(),
          ctaLink: formCtaLink.trim(),
          planet: formPlanet,
          bgGradient: formBgGradient,
          duration: formType === 'image' ? Math.max(3, parseInt(formDuration, 10) || 5) : 8,
          isActive: formIsActive,
        });
        setActionSuccess(`Updated slide "${formTitle}" successfully!`);
      } else {
        await createBanner({
          type: formType,
          mediaUrl: formMediaUrl.trim(),
          tag: formTag.trim(),
          title: formTitle.trim(),
          description: formDescription.trim(),
          ctaText: formCtaText.trim(),
          ctaLink: formCtaLink.trim(),
          planet: formPlanet,
          bgGradient: formBgGradient,
          duration: formType === 'image' ? Math.max(3, parseInt(formDuration, 10) || 5) : 8,
          isActive: formIsActive,
        });
        setActionSuccess(`Added new ${formType === 'video' ? 'video' : 'image'} slide successfully!`);
      }

      setShowModal(false);
      await loadData();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to save banner slide.');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (banner: MarketplaceBanner) => {
    try {
      await toggleBannerActive(banner.id, !banner.isActive);
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: !banner.isActive } : b))
      );
      setActionSuccess(`Slide visibility ${!banner.isActive ? 'activated' : 'deactivated'}.`);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update slide status.');
    }
  };

  // Delete Banner
  const handleDeleteConfirm = async () => {
    if (!deletingBanner) return;
    setDeletingSubmitting(true);
    try {
      await deleteBanner(deletingBanner.id);
      setBanners((prev) => prev.filter((b) => b.id !== deletingBanner.id));
      setDeletingBanner(null);
      setActionSuccess('Slide deleted successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to delete slide.');
    } finally {
      setDeletingSubmitting(false);
    }
  };

  // Move slide up or down in sequence
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    const reordered = [...banners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    setBanners(reordered);
    const orderedIds = reordered.map((b) => b.id);
    await reorderBanners(orderedIds);
    setActionSuccess('Slide display order updated.');
    setTimeout(() => setActionSuccess(null), 2500);
  };

  // Gradient presets
  const gradientPresets = [
    { label: "Thinkers Blue", value: "from-[#016ba5] via-[#0284c7] to-[#0369a1]", color: "#016ba5" },
    { label: "Solvers Cyan", value: "from-[#0284c7] via-[#0369a1] to-[#0c4a6e]", color: "#0284c7" },
    { label: "Heart Violet", value: "from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]", color: "#7C3AED" },
    { label: "Brave Orange", value: "from-[#fa8221] via-[#e87313] to-[#c25e0a]", color: "#fa8221" },
    { label: "Deep Navy Space", value: "from-[#06152B] via-[#0B2545] to-[#134074]", color: "#06152B" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-headline font-black text-slate-900 dark:text-white">
              {t('admin.tabs.banners') || 'Marketplace Banner Slider'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-headline font-bold bg-[#fa8221]/15 text-[#fa8221] border border-[#fa8221]/20">
              {banners.length} {banners.length === 1 ? 'Slide' : 'Slides'}
            </span>

            {/* Supabase Status Pill */}
            {isSupabaseConfigured() && dbHealth?.tableExists && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-headline font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Sync Live
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage full-width promotional carousel banners, dual slide types (photos & looping videos), and custom planet filters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Slides"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-[#fa8221]")} />
          </button>

          <button
            type="button"
            onClick={() => setShowSqlModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 font-headline text-xs font-bold transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-sky-500" />
            <span>Database Schema</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white font-headline text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-headline font-semibold animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Error Notification Alert */}
      {actionError && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-headline font-semibold">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Guidance Callout Box: Best Size & Resolution Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Slide Guidelines */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50/40 dark:from-sky-950/30 dark:to-blue-950/20 border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-headline font-black uppercase tracking-wider text-sky-900 dark:text-sky-300 mb-1 flex items-center gap-1.5">
              <span>Photo Slide Guidelines</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300">
                Auto-rotates 4–5s
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              <strong>Recommended Size:</strong> 1920×600px (16:5 aspect ratio), max 5MB. Accepts JPG, PNG, and WebP. Keeps typography crisp across high-DPI retina displays and mobile viewports.
            </p>
          </div>
        </div>

        {/* Video Slide Guidelines */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/40 dark:from-purple-950/30 dark:to-indigo-950/20 border border-purple-100 dark:border-purple-900/50 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-headline font-black uppercase tracking-wider text-purple-900 dark:text-purple-300 mb-1 flex items-center gap-1.5">
              <span>Video Loop Guidelines</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300">
                Seamless Muted Loop
              </span>
            </h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-body">
              <strong>Recommended Video:</strong> MP4 or WebM, max 15MB, 1080p horizontal. Automatically plays in background without sound. Keep clips under 15s for instant loading and buttery smooth loops.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slides by title, tag, or planet..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
          />
        </div>

        {/* Slide Type Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setTypeFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              typeFilter === 'all'
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            All Slides ({banners.length})
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('image')}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              typeFilter === 'image'
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos ({banners.filter((b) => b.type === 'image').length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('video')}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap",
              typeFilter === 'video'
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
            )}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Loops ({banners.filter((b) => b.type === 'video').length})</span>
          </button>
        </div>
      </div>

      {/* Banners List Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {filteredBanners.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-headline font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">
              No banner slides found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {searchQuery ? 'Try clearing your search query or switching filters.' : 'Get started by creating your first photo or looping video slide.'}
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fa8221] hover:bg-[#e0731a] text-white font-headline text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Slide</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={cn(
                  "p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40",
                  !banner.isActive && "opacity-60 bg-slate-50/40 dark:bg-slate-900/40"
                )}
              >
                {/* Left: Reorder controls + Media Preview */}
                <div className="flex items-center gap-3">
                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      title="Move slide up"
                      className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      title="Move slide down"
                      className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="relative w-28 sm:w-36 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm group">
                    {banner.type === 'video' ? (
                      <>
                        <video
                          src={banner.mediaUrl}
                          muted
                          loop
                          playsInline
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <Film className="w-5 h-5 text-white/90 drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={banner.mediaUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Order Badge */}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-headline text-[10px] font-bold">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Slide Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {banner.type === 'video' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                          <Film className="w-3 h-3" />
                          <span>Video Loop</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-headline font-black uppercase tracking-wider bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/25">
                          <ImageIcon className="w-3 h-3" />
                          <span>Photo Feature ({banner.duration || 5}s)</span>
                        </span>
                      )}

                      {banner.tag && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-headline font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          {banner.tag}
                        </span>
                      )}

                      {banner.planet && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-headline font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                          {banner.planet} Planet
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-headline font-bold text-slate-900 dark:text-white truncate">
                      {banner.title}
                    </h4>

                    {banner.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-body">
                        {banner.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    title={banner.isActive ? "Deactivate Slide" : "Activate Slide"}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-headline text-xs font-bold transition-all cursor-pointer border",
                      banner.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-800"
                    )}
                  >
                    {banner.isActive ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(banner)}
                    title="Edit Slide"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeletingBanner(banner)}
                    title="Delete Slide"
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          ADD / EDIT BANNER SLIDE MODAL
      ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center">
                  {formType === 'video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-headline font-black text-base text-slate-900 dark:text-white">
                    {editingBanner ? 'Edit Banner Slide' : 'Add New Banner Slide'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure photo or short looping video background for the Marketplace carousel.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-headline flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveBanner} className="p-6 space-y-5">
              {/* 1. DUAL SLIDE TYPE SELECTION */}
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Slide Media Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Option 1: Image */}
                  <button
                    type="button"
                    onClick={() => setFormType('image')}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer",
                      formType === 'image'
                        ? "bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-600 text-sky-950 dark:text-white ring-2 ring-sky-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      formType === 'image' ? "bg-sky-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    )}>
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-xs">Image Slide</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-body">
                        Photo feature with 4–5s auto-transition.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Video */}
                  <button
                    type="button"
                    onClick={() => setFormType('video')}
                    className={cn(
                      "p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer",
                      formType === 'video'
                        ? "bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-600 text-purple-950 dark:text-white ring-2 ring-purple-500/20"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      formType === 'video' ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    )}>
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-headline font-bold text-xs">Video Slide</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 font-body">
                        Repeating, muted background loop.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. MEDIA UPLOAD & BEST SIZE GUIDELINES */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-800 dark:text-slate-200">
                      Upload {formType === 'video' ? 'Video File (MP4/WebM)' : 'Image File (JPG/PNG/WebP)'} *
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-body mt-0.5">
                      {formType === 'video'
                        ? BANNER_GUIDELINES.video.helperText
                        : BANNER_GUIDELINES.image.helperText}
                    </p>
                  </div>
                </div>

                {/* Upload or URL Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept={formType === 'video' ? BANNER_GUIDELINES.video.accept : BANNER_GUIDELINES.image.accept}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingMedia}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-headline text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {uploadingMedia ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#fa8221]" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    <span>{uploadingMedia ? 'Uploading...' : `Browse ${formType === 'video' ? 'Video' : 'Image'} File`}</span>
                  </button>

                  <span className="text-xs text-slate-400 text-center sm:text-left">or enter URL:</span>

                  <input
                    type="url"
                    value={formMediaUrl}
                    onChange={(e) => setFormMediaUrl(e.target.value)}
                    placeholder={formType === 'video' ? 'https://example.com/loop.mp4' : 'https://images.unsplash.com/...'}
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* Live Media Preview Box */}
                {formMediaUrl && (
                  <div className="mt-3 relative w-full h-36 rounded-xl overflow-hidden bg-black/90 border border-slate-300 dark:border-slate-700 shadow-inner">
                    {formType === 'video' ? (
                      <video
                        key={formMediaUrl}
                        src={formMediaUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        key={formMediaUrl}
                        src={formMediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-white font-headline text-[10px] font-bold">
                      {formType === 'video' ? '🎬 Looping Video Preview' : '🖼️ Photo Preview'}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. CONTENT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Headline / Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Slide Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Awaken Real Curiosity with Hands-On Engineering"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-headline font-bold border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* Tag / Badge */}
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tag / Pill Badge
                  </label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. Screen-Free Season"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* Planet Filter */}
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Planet / Collection
                  </label>
                  <select
                    value={formPlanet}
                    onChange={(e) => {
                      setFormPlanet(e.target.value);
                      setFormCtaLink(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  >
                    <option value="thinkers">Thinkers' Planet (STEM & Logic)</option>
                    <option value="solvers">Solvers' Planet (Mechanics & Puzzles)</option>
                    <option value="heart">Heart Planet (Kindness & Games)</option>
                    <option value="brave">Brave Planet (Outdoor & Exploration)</option>
                    <option value="">No Filter / Custom Link</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Brief engaging description of the featured kits or story chronicles..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* CTA Button Label */}
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="e.g. Shop Thinkers Kits"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* CTA Link / Action */}
                <div>
                  <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1">
                    CTA Link / Target
                  </label>
                  <input
                    type="text"
                    value={formCtaLink}
                    onChange={(e) => setFormCtaLink(e.target.value)}
                    placeholder="thinkers, #marketplace, etc."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                  />
                </div>

                {/* Auto-Advance Duration (Only for image slides) */}
                {formType === 'image' && (
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Rotation Speed (Seconds)</span>
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                    <span className="text-[10px] text-slate-400">Default: 5 seconds (Recommended 4–5s)</span>
                  </div>
                )}

                {/* Status Switch */}
                <div className="flex items-center gap-3 pt-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-xs font-headline font-bold text-slate-700 dark:text-slate-300">
                    {formIsActive ? 'Published Live on Carousel' : 'Saved as Draft (Hidden)'}
                  </span>
                </div>
              </div>

              {/* 4. GRADIENT / COLOR ACCENT PRESETS */}
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Ambient Gradient Palette
                </label>
                <div className="flex flex-wrap gap-2">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormBgGradient(preset.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-headline font-bold transition-all cursor-pointer",
                        formBgGradient === preset.value
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      )}
                    >
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-headline text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting || uploadingMedia}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white font-headline text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {modalSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Slide...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingBanner ? 'Update Slide' : 'Publish Slide'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}
      {deletingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-black text-base text-slate-900 dark:text-white mb-2">
              Delete Banner Slide?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body mb-6">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">"{deletingBanner.title}"</strong>? This will remove the slide from both Supabase and the active Marketplace carousel.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingBanner(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-headline text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingSubmitting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {deletingSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SQL SCHEMA / DATABASE SETUP MODAL
      ======================================================== */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-sky-500" />
                <h3 className="font-headline font-black text-base text-slate-900 dark:text-white">
                  Marketplace Banners SQL Schema
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
              Run this SQL script in your Supabase SQL Editor to provision the <code>marketplace_banners</code> table and the <code>banner-media</code> bucket with RLS policies:
            </p>

            <div className="relative rounded-2xl bg-slate-950 p-4 font-mono text-[11px] text-slate-200 max-h-64 overflow-y-auto mb-4 border border-slate-800">
              <pre>{BANNERS_SCHEMA_SQL}</pre>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Safe to run multiple times (idempotent <code>CREATE TABLE IF NOT EXISTS</code>).
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(BANNERS_SCHEMA_SQL);
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
    </div>
  );
};

export default MarketplaceBannersTab;
