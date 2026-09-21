import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  Calendar, 
  BookmarkCheck,
  Compass,
  X,
  Share2,
  Check, 
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { 
  fetchBlogs, 
  incrementBlogViews, 
  subscribeToBlogChanges,
  type BlogPost 
} from '../../services/blogService';
import { subscribeEmail, isValidEmail } from '../../services/subscriberService';

export const ParentingResources: React.FC = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState<boolean>(false);
  const [newsletterFeedback, setNewsletterFeedback] = useState<{ type: 'success' | 'duplicate' | 'error'; message: string } | null>(null);

  // References for full-page view container and landing page scroll restoration
  const scrollPosRef = useRef<number>(0);
  const fullPageContainerRef = useRef<HTMLDivElement>(null);

  // 1. Lock background body scrolling when full-page article view is active
  useEffect(() => {
    if (selectedBlog) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedBlog]);

  // 2. Browser history popstate handler for back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const hash = window.location.hash;
      if (!hash.startsWith('#article-') && !hash.startsWith('#blog-')) {
        // User navigated back away from article view
        if (selectedBlog) {
          setSelectedBlog(null);
          const targetScroll = event.state?.scrollY ?? scrollPosRef.current;
          requestAnimationFrame(() => {
            window.scrollTo({ top: targetScroll, behavior: 'instant' });
          });
        }
      } else {
        // User navigated forward to an article
        const rawSlug = hash.replace(/^#(article|blog)-/, '');
        const found = blogs.find((b) => b.slug === rawSlug || b.id === rawSlug);
        if (found) {
          scrollPosRef.current = window.pageYOffset || document.documentElement.scrollTop;
          setSelectedBlog(found);
          if (fullPageContainerRef.current) {
            fullPageContainerRef.current.scrollTop = 0;
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedBlog, blogs]);

  const handleOpenArticle = (blog: BlogPost) => {
    // Save current landing page scroll position
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    scrollPosRef.current = currentScroll;

    // Push history state with article hash and scroll position
    const slug = blog.slug || blog.id;
    const articleHash = `#article-${slug}`;
    if (window.location.hash !== articleHash) {
      window.history.pushState(
        { abtalquest_article_id: blog.id, scrollY: currentScroll },
        '',
        articleHash
      );
    }

    setSelectedBlog(blog);
    void incrementBlogViews(blog.id);

    // Scroll to top of full-page container
    if (fullPageContainerRef.current) {
      fullPageContainerRef.current.scrollTop = 0;
    }
  };

  const handleCloseArticle = () => {
    if (window.location.hash.startsWith('#article-') || window.location.hash.startsWith('#blog-')) {
      // Trigger history.back() which fires popstate and restores exact landing page scroll position
      window.history.back();
    } else {
      setSelectedBlog(null);
      const targetScroll = scrollPosRef.current;
      requestAnimationFrame(() => {
        window.scrollTo({ top: targetScroll, behavior: 'instant' });
      });
    }
  };

  const handleShareArticle = async (blog: BlogPost) => {
    const slug = blog.slug || blog.id;
    const url = `${window.location.origin}${window.location.pathname}#article-${slug}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${blog.title} - Read on AbtalQuest: ${url}`);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch {
        // Fallback silently
      }
    }
  };

  const handleParentingSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterSubmitting) return;

    if (!isValidEmail(newsletterEmail)) {
      setNewsletterFeedback({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      setTimeout(() => setNewsletterFeedback(null), 4000);
      return;
    }

    setNewsletterSubmitting(true);
    setNewsletterFeedback(null);

    try {
      const res = await subscribeEmail(newsletterEmail, 'parenting_digest');
      if (res.success) {
        if (res.isDuplicate) {
          setNewsletterFeedback({
            type: 'duplicate',
            message: "You're already subscribed to our newsletter!",
          });
        } else {
          setNewsletterFeedback({
            type: 'success',
            message: t('parenting.newsletter_success'),
          });
          setNewsletterEmail('');
        }
      } else {
        setNewsletterFeedback({
          type: 'error',
          message: res.message || 'Unable to subscribe. Please try again.',
        });
      }
    } catch (err: any) {
      setNewsletterFeedback({
        type: 'error',
        message: err?.message || 'A network error occurred.',
      });
    } finally {
      setNewsletterSubmitting(false);
      setTimeout(() => setNewsletterFeedback(null), 6000);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchBlogs({ onlyPublished: true });
        if (isMounted) {
          setBlogs(data);
          setLoading(false);

          // Synchronize active reading view if open, or resolve deep-link from URL hash
          setSelectedBlog((currentSelected) => {
            if (!currentSelected) {
              const hash = window.location.hash;
              if (hash.startsWith('#article-') || hash.startsWith('#blog-')) {
                const rawSlug = hash.replace(/^#(article|blog)-/, '');
                const found = data.find((b) => b.slug === rawSlug || b.id === rawSlug);
                return found || null;
              }
              return null;
            }
            // Keep the reader updated with newest content, or return null if unpublished/deleted
            const updated = data.find(
              (b) => b.id === currentSelected.id || b.slug === currentSelected.slug
            );
            return updated || null;
          });
        }
      } catch (err) {
        console.warn('Failed to load published blogs:', err);
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    // Subscribe to both Supabase Realtime (postgres_changes) and multi-channel dispatcher
    const unsubscribe = subscribeToBlogChanges(() => {
      if (isMounted) {
        void loadData();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const getCategoryVariant = (cat: string): 'gamification' | 'success' | 'secondary' | 'warning' => {
    switch (cat.toLowerCase()) {
      case 'emotional wellness':
        return 'gamification';
      case 'digital safety':
        return 'secondary';
      case 'family bonding':
        return 'success';
      default:
        return 'warning';
    }
  };

  const getLocalizedTitle = (article: BlogPost) => {
    if (article.id === 'blog-resilient-kids') return t('parenting.card_1_title') || article.title;
    if (article.id === 'blog-digital-safety') return t('parenting.card_2_title') || article.title;
    if (article.id === 'blog-family-bonding') return t('parenting.card_3_title') || article.title;
    return article.title;
  };

  const getLocalizedExcerpt = (article: BlogPost) => {
    if (article.id === 'blog-resilient-kids') return t('parenting.card_1_desc') || article.excerpt;
    if (article.id === 'blog-digital-safety') return t('parenting.card_2_desc') || article.excerpt;
    if (article.id === 'blog-family-bonding') return t('parenting.card_3_desc') || article.excerpt;
    return article.excerpt;
  };

  const categories = ['all', ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs = activeCategory === 'all'
    ? blogs
    : blogs.filter((b) => b.category === activeCategory);

  return (
    <section id="parenting-resources" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <Badge variant="primary" size="md" icon={<Compass className="w-4 h-4" />}>
              {t('parenting.badge')}
            </Badge>

            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mt-3 mb-3">
              {t('parenting.title')}
            </h2>

            <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
              {t('parenting.subtitle')}
            </p>
          </div>

          <div>
            <a
              href="#newsletter"
              className="inline-flex items-center gap-2 font-headline text-sm font-bold text-[#016ba5] dark:text-[#38BDF8] hover:text-[#015786] bg-white dark:bg-[#0F2F4E] border border-slate-200 dark:border-slate-700 shadow-sm px-5 py-2.5 rounded-xl transition-all hover:shadow-md"
            >
              <BookmarkCheck className="w-4 h-4 text-[#fa8221]" />
              <span>{t('parenting.badge')}</span>
            </a>
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#016ba5]'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Blog / Resource Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0F2F4E] rounded-3xl p-7 border-2 border-slate-200/80 dark:border-slate-700 animate-pulse space-y-4"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
                <div className="h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                <div className="h-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#0F2F4E] rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="font-headline font-bold text-lg text-slate-800 dark:text-white mb-1">
              No Published Articles Found
            </h3>
            <p className="font-body text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Our child development experts are preparing new educational guides. Please check back shortly!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBlogs.map((article) => (
              <article
                key={article.id}
                onClick={() => handleOpenArticle(article)}
                className="group bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 border-2 border-slate-200/80 dark:border-slate-700 hover:border-[#016ba5]/40 dark:hover:border-[#38BDF8]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Article Cover Image (if available) */}
                  {article.imageUrl ? (
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {article.featured && (
                        <div className="absolute top-3 left-3 bg-[#fa8221] text-white text-[10px] font-headline font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>FEATURED</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}

                  {/* Header: Category and Read-Time Label */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={getCategoryVariant(article.category)} size="sm">
                      {article.category}
                    </Badge>

                    <span className="font-body text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#fa8221]" />
                      <span>{article.readTime || '5 min read'}</span>
                    </span>
                  </div>

                  {/* Article Title */}
                  <h3 className="font-headline text-xl font-extrabold text-[#1E293B] dark:text-white group-hover:text-[#016ba5] dark:group-hover:text-[#38BDF8] transition-colors tracking-tight leading-snug mb-3">
                    {getLocalizedTitle(article)}
                  </h3>

                  {/* Summary Description */}
                  <p className="font-body text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                    {getLocalizedExcerpt(article)}
                  </p>
                </div>

                {/* Card Footer: Metadata & Read-More Link */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-body text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(article.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Read-More Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenArticle(article);
                    }}
                    className="font-headline text-xs font-bold text-[#fa8221] hover:text-[#e87313] inline-flex items-center gap-1 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Community Newsletter Box */}
        <div id="newsletter" className="mt-12 bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                {t('parenting.newsletter_title')}
              </h4>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300">
                {t('parenting.newsletter_desc')}
              </p>
            </div>
          </div>

          <form onSubmit={handleParentingSubscribe} className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                required
                disabled={newsletterSubmitting}
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterFeedback) setNewsletterFeedback(null);
                }}
                placeholder={t('parenting.newsletter_placeholder')}
                className="font-body text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#016ba5] focus:ring-1 focus:ring-[#016ba5] w-full sm:w-64 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="font-headline text-xs font-bold px-5 py-2.5 bg-[#fa8221] hover:bg-[#e87313] text-white rounded-xl shadow-sm whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 disabled:opacity-75 cursor-pointer"
              >
                {newsletterSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : newsletterFeedback?.type === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <span>{t('parenting.newsletter_submit')}</span>
                )}
              </button>
            </div>
            {newsletterFeedback && (
              <div className="text-[11px] font-semibold flex items-center gap-1 animate-fadeIn">
                {newsletterFeedback.type === 'success' && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="text-emerald-600 dark:text-emerald-400">{newsletterFeedback.message}</span>
                  </>
                )}
                {newsletterFeedback.type === 'duplicate' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-amber-600 dark:text-amber-400">{newsletterFeedback.message}</span>
                  </>
                )}
                {newsletterFeedback.type === 'error' && (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-rose-600 dark:text-rose-400">{newsletterFeedback.message}</span>
                  </>
                )}
              </div>
            )}
          </form>
        </div>

      </div>

      {/* ========================================================
          DEDICATED FULL-PAGE ARTICLE READING VIEW
         ======================================================== */}
      {selectedBlog && (
        <div 
          ref={fullPageContainerRef}
          role="dialog"
          aria-modal="true"
          aria-label={selectedBlog.title}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 dark:bg-[#071727] text-slate-800 dark:text-slate-100 flex flex-col animate-fadeIn"
        >
          {/* Sticky Editorial Top Bar */}
          <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c2238]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
              {/* Back to Resources Button */}
              <button
                type="button"
                onClick={handleCloseArticle}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-[#016ba5] hover:text-white dark:hover:bg-[#016ba5] font-headline font-bold text-xs text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to Articles</span>
              </button>

              {/* Breadcrumb / Category indicator */}
              <div className="hidden md:flex items-center gap-2 text-xs font-headline">
                <span className="text-slate-400">Parenting Resources</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <Badge variant={getCategoryVariant(selectedBlog.category)} size="sm">
                  {selectedBlog.category}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareArticle(selectedBlog)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-headline font-bold text-xs text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Share article link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCloseArticle}
                  aria-label="Close article"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Full Page Editorial Container */}
          <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <Badge variant={getCategoryVariant(selectedBlog.category)} size="md">
                {selectedBlog.category}
              </Badge>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#fa8221]" />
                {selectedBlog.readTime || '5 min read'}
              </span>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(selectedBlog.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {selectedBlog.viewsCount !== undefined && selectedBlog.viewsCount > 0 && (
                <span className="font-body text-xs text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 px-3 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  {selectedBlog.viewsCount.toLocaleString()} reads
                </span>
              )}
            </div>

            {/* Article Headline */}
            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-8">
              {selectedBlog.title}
            </h1>

            {/* Author Profile Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0c2238] border border-slate-200/80 dark:border-slate-800 shadow-sm mb-8">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#016ba5] to-[#fa8221] text-white flex items-center justify-center font-headline font-black text-lg shadow-sm shrink-0">
                  {selectedBlog.authorName ? selectedBlog.authorName.charAt(0) : 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {selectedBlog.authorName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-headline font-bold bg-blue-50 dark:bg-blue-900/40 text-[#016ba5] dark:text-blue-300">
                      Author
                    </span>
                  </div>
                  <span className="font-body text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {selectedBlog.authorRole || 'Child Development & Digital Safety Specialist'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShareArticle(selectedBlog)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-headline font-bold text-slate-600 dark:text-slate-300 hover:text-[#016ba5] transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Share Article'}</span>
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {selectedBlog.imageUrl && (
              <div className="mb-10 rounded-3xl overflow-hidden max-h-[480px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Styled Pull-Quote / Key Insight */}
            {selectedBlog.excerpt && (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#016ba5]/10 via-[#016ba5]/5 to-transparent dark:from-[#016ba5]/20 border-l-4 border-[#016ba5] mb-10 shadow-xs">
                <span className="font-headline font-bold text-xs uppercase tracking-wider text-[#016ba5] block mb-2">
                  Executive Summary & Practical Guidance
                </span>
                <p className="font-body text-base sm:text-lg text-slate-800 dark:text-slate-100 italic leading-relaxed">
                  &ldquo;{selectedBlog.excerpt}&rdquo;
                </p>
              </div>
            )}

            {/* Full Formatted Article Content Body */}
            <article className="prose prose-slate dark:prose-invert max-w-none font-body text-base sm:text-lg leading-[1.8] text-slate-700 dark:text-slate-200 space-y-6 whitespace-pre-wrap">
              {selectedBlog.content}
            </article>

            {/* Tags Pills */}
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-headline font-bold text-slate-400 uppercase tracking-wider mr-2">
                  Topic Tags:
                </span>
                {selectedBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-body text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Editorial Footer & Return Button */}
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
                  AbtalQuest Educational Publishing
                </h4>
                <p className="font-body text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Values-driven resources designed to help Arab families raise confident, emotionally grounded digital explorers.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleCloseArticle}
                icon={<ArrowLeft className="w-4 h-4" />}
                iconPosition="left"
              >
                Return to All Resources
              </Button>
            </div>
          </main>
        </div>
      )}
    </section>
  );
};

export default ParentingResources;
