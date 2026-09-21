import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight, 
  Globe, 
  Sun, 
  Moon, 
  Check, 
  Download,
  User as UserIcon,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface NavbarProps {
  currentView?: 'home' | 'marketplace' | 'admin' | 'safety-standards' | 'about';
  onViewChange?: (view: 'home' | 'marketplace' | 'about') => void;
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenContact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView = 'home', 
  onViewChange,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenContact,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNavTab, setSelectedNavTab] = useState<string>('home');
  const { theme, toggleTheme } = useTheme();
  const { language, direction, setLanguage, t } = useLanguage();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { id: 'home', label: t('nav.home'), href: '#universe' },
    { id: 'blog', label: t('nav.blog'), href: '#parenting-resources' },
    { id: 'marketplace', label: t('nav.marketplace'), href: '#marketplace', badge: t('nav.badge_kits') },
    { id: 'about', label: t('nav.about'), href: '#about' },
  ];

  // Sync active navigation tab with current view
  const activeTab = currentView === 'marketplace' ? 'marketplace' : currentView === 'about' ? 'about' : selectedNavTab;

  // Handle scroll detection for frosted glass transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle navigation clicks
  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    setSelectedNavTab(item.id);
    setMobileMenuOpen(false);

    if (item.id === 'marketplace') {
      e.preventDefault();
      onViewChange?.('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.id === 'about') {
      e.preventDefault();
      onViewChange?.('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onViewChange?.('home');
      if (item.id === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Let anchor scroll to section on home page
        const targetId = item.href.replace('#', '');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  };

  return (
    <>
      {/* Top Universal Safety Reassurance Ticker */}
      <div className="bg-[#016ba5] text-white text-xs py-1.5 px-3 sm:px-4 font-body border-b border-[#015786] transition-all overflow-hidden w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center justify-center p-0.5 bg-emerald-500/20 rounded-full text-emerald-300 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium tracking-wide text-[11px] sm:text-xs truncate sm:whitespace-normal">
              <strong className="text-amber-300">{t('nav.safety_ticker_bold_1')}</strong> • <strong className="text-emerald-300">{t('nav.safety_ticker_bold_2')}</strong> • {t('nav.safety_ticker_tail')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenContact?.()}
              className="hover:underline hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{t('nav.contact_support')}</span>
            </button>
            <span className="text-white/40">|</span>
            <a
              href="#coppa-compliance"
              className="text-white/80 hover:text-amber-300 hover:underline transition-colors"
            >
              {t('nav.compliance_notice')}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Semi-Transparent Frosted Glass Effect */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          'bg-white/80 dark:bg-[#0A2540]/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-[#0A2540]/85 border-b',
          isScrolled
            ? 'border-slate-200/90 dark:border-slate-700/80 shadow-sm py-2.5 sm:py-3'
            : 'border-slate-200/60 dark:border-slate-800/80 py-3 sm:py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left & Center-Left: Logo and Horizontally Arranged Navigation Links */}
            <div className="flex items-center gap-4 lg:gap-12 min-w-0 flex-shrink">
              {/* AbtalQuest Official Logo */}
              <a
                href="#universe"
                onClick={(e) => {
                  e.preventDefault();
                  onViewChange?.('home');
                  setSelectedNavTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5] rounded-xl transition-transform hover:scale-[1.01] min-w-0"
                aria-label="AbtalQuest Homepage"
              >
                <AbtalQuestLogo
                  variant={theme === 'dark' ? 'dark' : 'light'}
                  size="md"
                  showText={true}
                  tagline={t('nav.logo_tagline')}
                />
              </a>

              {/* Desktop Navigation Links: "Home", "Blog", "Marketplace", "About" (Center-Left) */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={cn(
                        'font-headline text-sm font-semibold transition-all duration-200 relative py-1 group select-none flex items-center gap-1.5',
                        isActive
                          ? 'text-[#016ba5] dark:text-[#38BDF8] font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#fa8221]'
                      )}
                    >
                      <span>{item.label}</span>

                      {/* Optional badge for featured destinations */}
                      {item.badge && (
                        <span className="text-[10px] font-gamification font-bold px-1.5 py-0.5 rounded-full bg-[#fa8221]/10 text-[#fa8221] border border-[#fa8221]/20">
                          {item.badge}
                        </span>
                      )}

                      {/* Active indicator underline */}
                      {isActive ? (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#016ba5] dark:bg-[#38BDF8] rounded-full transition-all duration-300" />
                      ) : (
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#016ba5]/40 dark:bg-[#38BDF8]/40 rounded-full transition-all duration-200 group-hover:w-full" />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right-Side Actions: Globe Selector, Theme Toggle, Profile, and Pill CTA "Download App" */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              
              {/* 1. Round Language / Globe Selector Button */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={cn(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200',
                    'border-slate-200/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#016ba5] dark:hover:text-[#fa8221] hover:border-[#016ba5]/40',
                    'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5]',
                    languageMenuOpen && 'border-[#016ba5] ring-2 ring-[#016ba5]/20 bg-white dark:bg-slate-800 text-[#016ba5] dark:text-[#38BDF8]'
                  )}
                  aria-label={t('nav.select_language')}
                  title={t('nav.select_language')}
                  aria-expanded={languageMenuOpen}
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {/* Language Dropdown Menu (EN, AR, FR) */}
                {languageMenuOpen && (
                  <div className={cn(
                    'absolute mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#0A2540]/95 backdrop-blur-md shadow-xl border border-slate-200/80 dark:border-slate-700 py-2 z-50 animate-fadeIn',
                    direction === 'rtl' ? 'left-0' : 'right-0'
                  )}>
                    <div className="px-3 py-1.5 text-[11px] font-body text-slate-400 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700/80">
                      {t('nav.select_language')}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setLanguageMenuOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2 text-xs font-headline font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors',
                        language === 'en' ? 'text-[#016ba5] dark:text-[#38BDF8] bg-[#016ba5]/5 dark:bg-[#016ba5]/20' : 'text-slate-700 dark:text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇺🇸</span>
                        <span>{t('nav.lang_en')}</span>
                      </div>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('ar');
                        setLanguageMenuOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2 text-xs font-headline font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors',
                        language === 'ar' ? 'text-[#016ba5] dark:text-[#38BDF8] bg-[#016ba5]/5 dark:bg-[#016ba5]/20' : 'text-slate-700 dark:text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇦🇪</span>
                        <span>{t('nav.lang_ar')}</span>
                      </div>
                      {language === 'ar' && <Check className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('fr');
                        setLanguageMenuOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2 text-xs font-headline font-semibold flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors',
                        language === 'fr' ? 'text-[#016ba5] dark:text-[#38BDF8] bg-[#016ba5]/5 dark:bg-[#016ba5]/20' : 'text-slate-700 dark:text-slate-200'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇫🇷</span>
                        <span>{t('nav.lang_fr')}</span>
                      </div>
                      {language === 'fr' && <Check className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38BDF8]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Round Theme-Toggle Button (Sun / Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200',
                  'border-slate-200/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#fa8221] hover:border-[#fa8221]/40',
                  'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fa8221]'
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                title={`Theme: ${theme === 'light' ? 'Light mode (click for Dark)' : 'Dark mode (click for Light)'}`}
              >
                {theme === 'light' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* 3. Round User Account / Family Portal Button */}
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    onOpenProfile?.();
                  } else {
                    onOpenAuth?.();
                  }
                }}
                className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 relative',
                  user
                    ? 'border-[#016ba5] dark:border-[#38BDF8] bg-[#016ba5]/10 dark:bg-[#016ba5]/30 text-[#016ba5] dark:text-[#38BDF8] hover:bg-[#016ba5] hover:text-white'
                    : 'border-slate-200/80 dark:border-slate-700 bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#016ba5] dark:hover:text-[#fa8221] hover:border-[#016ba5]/40',
                  'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5]'
                )}
                aria-label={user ? 'Open Family Profile' : 'Sign In to Family Hub'}
                title={user ? `Family Profile (${user.email})` : 'Sign In / Create Account'}
              >
                {user ? (
                  <>
                    <span className="font-headline font-black text-xs">
                      {(user.user_metadata?.full_name || user.email || 'H').charAt(0).toUpperCase()}
                    </span>
                    <span className="absolute bottom-0.5 right-0.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </>
                ) : (
                  <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>

              {/* 4. Prominent Pill-Shaped CTA Button (#fa8221 Secondary Orange, Montserrat, Right Arrow) */}
              <button
                type="button"
                onClick={() => setDownloadModalOpen(true)}
                className={cn(
                  'hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-full',
                  'bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white',
                  'font-headline font-bold text-sm tracking-wide',
                  'shadow-[0_4px_14px_rgba(250,130,33,0.38)] hover:shadow-[0_6px_22px_rgba(250,130,33,0.48)]',
                  'transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group'
                )}
              >
                <span>{t('nav.download_app')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#016ba5] dark:hover:text-[#fa8221] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 dark:border-slate-700 bg-white/95 dark:bg-[#0A2540]/95 backdrop-blur-md shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
            <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className={cn(
                      'font-headline text-base font-semibold px-4 py-3 rounded-2xl flex items-center justify-between transition-colors',
                      isActive
                        ? 'text-[#016ba5] dark:text-[#38BDF8] bg-[#016ba5]/10 dark:bg-[#016ba5]/30 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:text-[#016ba5] dark:hover:text-[#fa8221] hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    )}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-xs font-gamification font-bold px-2 py-0.5 rounded-full bg-[#fa8221]/10 text-[#fa8221]">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex flex-col gap-2.5">
              {/* Mobile Account Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    onOpenProfile?.();
                  } else {
                    onOpenAuth?.();
                  }
                }}
                className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-headline font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8]" />
                  <span>{user ? `${t('nav.family_account')} (${user.user_metadata?.full_name || user.email?.split('@')[0]})` : t('nav.sign_in')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 rtl-flip" />
              </button>

              {/* Mobile Contact Button */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenContact?.();
                }}
                className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-headline font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#016ba5] dark:text-[#38BDF8]" />
                  <span>{t('nav.contact_support')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 rtl-flip" />
              </button>

              {/* Mobile CTA Button: Pill-Shaped #fa8221 with right arrow */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDownloadModalOpen(true);
                }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full',
                  'bg-[#fa8221] hover:bg-[#e87313] text-white',
                  'font-headline font-bold text-base tracking-wide',
                  'shadow-[0_4px_14px_rgba(250,130,33,0.38)] transition-all'
                )}
              >
                <span>{t('nav.download_app')}</span>
                <ArrowRight className="w-4 h-4 rtl-flip" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Download App Modal Dialog */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative w-full max-w-md bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-700 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDownloadModalOpen(false)}
              className={cn(
                'absolute top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
                direction === 'rtl' ? 'left-4' : 'right-4'
              )}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Branded Emblem Header */}
            <div className="flex justify-center mb-4">
              <AbtalQuestLogo mode="emblem" variant={theme === 'dark' ? 'dark' : 'light'} size="lg" showText={false} />
            </div>

            <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-2">
              {t('nav.download_title')}
            </h3>
            
            <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300 leading-relaxed mb-6">
              {t('nav.download_desc')}
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="#app-store"
                onClick={(e) => {
                  e.preventDefault();
                  alert(t('nav.download_app_store'));
                  setDownloadModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-headline font-semibold text-sm transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.download_app_store')}</span>
              </a>

              <a
                href="#google-play"
                onClick={(e) => {
                  e.preventDefault();
                  alert(t('nav.download_google_play'));
                  setDownloadModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-[#016ba5] hover:bg-[#015786] text-white font-headline font-semibold text-sm transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>{t('nav.download_google_play')}</span>
              </a>
            </div>

            {/* Reassurance Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-center gap-4 text-xs font-body text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> {t('nav.download_security')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
