import React from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Smile, 
  Heart, 
  Calendar, 
  BookmarkCheck,
  Compass
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface ResourceArticle {
  id: string;
  titleKey: 'card_1_title' | 'card_2_title' | 'card_3_title';
  descKey: 'card_1_desc' | 'card_2_desc' | 'card_3_desc';
  category: string;
  categoryVariant: 'primary' | 'warning' | 'success';
  readTime: string;
  date: string;
  author: string;
  icon: React.ReactNode;
  iconBg: string;
  slug: string;
}

const ARTICLES: ResourceArticle[] = [
  {
    id: 'resilient-kids',
    titleKey: 'card_1_title',
    descKey: 'card_1_desc',
    category: 'Emotional Wellness',
    categoryVariant: 'primary',
    readTime: '5 min',
    date: 'March 14, 2026',
    author: 'Dr. Amina Mansour, Child Psychologist',
    icon: <Heart className="w-6 h-6" />,
    iconBg: 'bg-[#016ba5]/10 text-[#016ba5]',
    slug: '#article-resilience',
  },
  {
    id: 'digital-dangers',
    titleKey: 'card_2_title',
    descKey: 'card_2_desc',
    category: 'Digital Safety',
    categoryVariant: 'warning',
    readTime: '7 min',
    date: 'March 10, 2026',
    author: 'Tariq Al-Farooq, Cybersecurity Researcher',
    icon: <ShieldAlert className="w-6 h-6" />,
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    slug: '#article-safety',
  },
  {
    id: 'fun-habits',
    titleKey: 'card_3_title',
    descKey: 'card_3_desc',
    category: 'Family Bonding',
    categoryVariant: 'success',
    readTime: '4 min',
    date: 'March 04, 2026',
    author: 'Fatima Zohra, Family Life Coach',
    icon: <Smile className="w-6 h-6" />,
    iconBg: 'bg-[#22C55E]/10 text-[#16a34a]',
    slug: '#article-habits',
  },
];

export const ParentingResources: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="parenting-resources" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
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

        {/* 3 Blog / Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-white dark:bg-[#0F2F4E] rounded-3xl p-7 border-2 border-slate-200/80 dark:border-slate-700 hover:border-[#016ba5]/30 dark:hover:border-[#38BDF8]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Header: Category and Read-Time Label */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <Badge variant={article.categoryVariant} size="sm">
                    {article.category}
                  </Badge>

                  <span className="font-body text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#fa8221]" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                {/* Article Icon Header */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl ${article.iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    {article.icon}
                  </div>
                </div>

                {/* Article Title (Montserrat) */}
                <h3 className="font-headline text-xl font-extrabold text-[#1E293B] dark:text-white group-hover:text-[#016ba5] dark:group-hover:text-[#fa8221] transition-colors tracking-tight leading-snug mb-3">
                  {t(`parenting.${article.titleKey}`)}
                </h3>

                {/* Summary Description (Roboto Mono) */}
                <p className="font-body text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-6">
                  {t(`parenting.${article.descKey}`)}
                </p>
              </div>

              {/* Card Footer: Metadata & Read-More Link */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-body text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{article.date}</span>
                </div>

                {/* Read-More Link */}
                <a
                  href={article.slug}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(t(`parenting.${article.titleKey}`));
                  }}
                  className="font-headline text-xs font-bold text-[#fa8221] hover:text-[#e87313] inline-flex items-center gap-1 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
                >
                  <span>{t('planets.explore_planet')}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-flip" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Community Newsletter Box */}
        <div className="mt-12 bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
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
    </section>
  );
};

export default ParentingResources;
