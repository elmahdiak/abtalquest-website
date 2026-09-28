import React from 'react';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export interface FooterProps {
  onOpenContact?: () => void;
  onNavigate?: (view: 'home' | 'marketplace' | 'about' | 'blog') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onNavigate }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const handleNav = (view: 'home' | 'marketplace' | 'about' | 'blog', hash?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    }
    if (hash) {
      window.location.hash = hash;
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#06152B] text-slate-700 dark:text-slate-300 pt-16 pb-12 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Directory Columns matching PDF reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-100 dark:border-slate-800">
          
          {/* Brand Info & Tagline (Cols 1-4) */}
          <div className="md:col-span-4 flex flex-col items-start gap-3">
            <AbtalQuestLogo
              variant={theme === 'dark' ? 'dark' : 'light'}
              size="md"
              showText={true}
              clickable={true}
              href="#universe"
            />
            <p className="font-headline font-bold text-sm sm:text-base text-[#0F2A4A] dark:text-slate-200 leading-snug mt-1">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 1: Explore (Cols 5-6) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-[#0F2A4A] dark:text-white uppercase tracking-wider">
              {t('footer.col_explore')}
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-[#475569] dark:text-slate-400">
              <li>
                <a
                  href="#how-it-works"
                  onClick={handleNav('home', '#how-it-works')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_how_it_works')}
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={handleNav('blog')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_parents')}
                </a>
              </li>
              <li>
                <a
                  href="#marketplace"
                  onClick={handleNav('marketplace')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_marketplace')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Company (Cols 7-9) */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-[#0F2A4A] dark:text-white uppercase tracking-wider">
              {t('footer.col_company')}
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-[#475569] dark:text-slate-400">
              <li>
                <a
                  href="#blog"
                  onClick={handleNav('blog')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_blog')}
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={handleNav('about')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_about')}
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  onClick={handleNav('about', '#team')}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_team')}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors text-left rtl:text-right cursor-pointer"
                >
                  {t('footer.link_contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal (Cols 10-12) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-[#0F2A4A] dark:text-white uppercase tracking-wider">
              {t('footer.col_legal')}
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-sm text-[#475569] dark:text-slate-400">
              <li>
                <a
                  href="#privacy-for-kids"
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_privacy_policy')}
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-[#016ba5] dark:hover:text-[#38bdf8] transition-colors"
                >
                  {t('footer.link_terms')}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright, App Store / Google Play, and Orange Back-to-Top Button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-slate-500 dark:text-slate-400">
          <div>
            {t('footer.copyright')}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {t('footer.stores')}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
