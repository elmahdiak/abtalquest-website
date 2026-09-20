import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Calendar, 
  BookmarkCheck,
  Compass,
  X,
  Share2,
  Check,
  Sparkles
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { 
  fetchBlogs, 
  incrementBlogViews, 
  type BlogPost 
} from '../../services/blogService';

export const ParentingResources: React.FC = () => {
  const { t } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await fetchBlogs({ onlyPublished: true });
        if (isMounted) {
          setBlogs(data);
          setLoading(false);
        }
      } catch (err) {
        console.warn('Failed to load published blogs:', err);
        if (isMounted) setLoading(false);
      }
    };

    void loadData();

    const handleBlogEvent = () => {
      void loadData();
    };

    window.addEventListener('abtalquest_blog_updated', handleBlogEvent);
    return () => {
      isMounted = false;
      window.removeEventListener('abtalquest_blog_updated', handleBlogEvent);
    };
  }, []);

  const handleOpenArticle = (blog: BlogPost) => {
    setSelectedBlog(blog);
    void incrementBlogViews(blog.id);
  };

  const handleShareArticle = async (blog: BlogPost) => {
    const url = `${window.location.origin}${window.location.pathname}#parenting-resources`;
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

  const getCategoryVariant = (category: string): 'primary' | 'warning' | 'success' | 'gamification' => {
    const cat = category.toLowerCase();
    if (cat.includes('emotional') || cat.includes('wellness') || cat.includes('heart')) return 'primary';
    if (cat.includes('safety') || cat.includes('digital') || cat.includes('courage')) return 'warning';
    if (cat.includes('family') || cat.includes('bonding') || cat.includes('play')) return 'success';
    return 'gamification';
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
                    {article.title}
                  </h3>

                  {/* Summary Description */}
                  <p className="font-body text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                    {article.excerpt}
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder={t('parenting.newsletter_placeholder')}
              className="font-body text-xs px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#016ba5] focus:ring-1 focus:ring-[#016ba5] w-full sm:w-64"
            />
            <button
              type="button"
              onClick={() => alert(t('parenting.newsletter_success'))}
              className="font-headline text-xs font-bold px-5 py-2.5 bg-[#fa8221] hover:bg-[#e87313] text-white rounded-xl shadow-sm whitespace-nowrap transition-colors"
            >
              {t('parenting.newsletter_submit')}
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          FULL ARTICLE READING MODAL OVERLAY
         ======================================================== */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white dark:bg-[#0c2238] rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[92vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Hero Banner (if image available) */}
            {selectedBlog.imageUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden max-h-72 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={getCategoryVariant(selectedBlog.category)} size="sm">
                {selectedBlog.category}
              </Badge>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#fa8221]" />
                {selectedBlog.readTime || '5 min read'}
              </span>
              <span className="font-body text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(selectedBlog.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Article Title */}
            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              {selectedBlog.title}
            </h2>

            {/* Author Box */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#071727] border border-slate-200/80 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#016ba5] to-[#fa8221] text-white flex items-center justify-center font-headline font-black text-base shadow-sm">
                  {selectedBlog.authorName.charAt(0)}
                </div>
                <div>
                  <span className="font-headline font-bold text-sm text-slate-900 dark:text-white block">
                    {selectedBlog.authorName}
                  </span>
                  <span className="font-body text-xs text-slate-500 dark:text-slate-400 block">
                    {selectedBlog.authorRole || 'Child Development Specialist'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleShareArticle(selectedBlog)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-headline font-bold text-slate-600 dark:text-slate-300 hover:text-[#016ba5] transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            {/* Excerpt Summary Box */}
            <div className="p-4 rounded-2xl bg-[#016ba5]/5 dark:bg-[#016ba5]/15 border-l-4 border-[#016ba5] mb-8">
              <p className="font-body text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                "{selectedBlog.excerpt}"
              </p>
            </div>

            {/* Formatted Article Body */}
            <div className="font-body text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed space-y-5 whitespace-pre-wrap">
              {selectedBlog.content}
            </div>

            {/* Tags Pills */}
            {selectedBlog.tags && selectedBlog.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-headline font-bold text-slate-400 uppercase tracking-wider">
                  Tags:
                </span>
                {selectedBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-body text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <span className="font-body text-xs text-slate-400">
                AbtalQuest Educational Publishing • Values-Driven Parenting
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedBlog(null)}
              >
                Done Reading
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ParentingResources;
