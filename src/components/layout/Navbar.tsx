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
  Smartphone,
  Download,
  Star
} from 'lucide-react';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { cn } from '../../lib/utils';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#universe' },
  { id: 'blog', label: 'Blog', href: '#parenting-resources' },
  { id: 'marketplace', label: 'Marketplace', href: '#marketplace', badge: 'Safe Shop' },
  { id: 'about', label: 'About', href: '#vision-mission' },
];

export interface NavbarProps {
  currentView?: 'home' | 'marketplace';
  onViewChange?: (view: 'home' | 'marketplace') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView = 'home', onViewChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNavTab, setSelectedNavTab] = useState<string>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Sync active navigation tab with current view
  const activeTab = currentView === 'marketplace' ? 'marketplace' : selectedNavTab;

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

  // Toggle dark/light theme
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle navigation clicks
  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    setSelectedNavTab(item.id);
    setMobileMenuOpen(false);

    if (item.id === 'marketplace') {
      e.preventDefault();
      onViewChange?.('marketplace');
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
      <div className="bg-[#016ba5] text-white text-xs py-1.5 px-4 font-body border-b border-[#015786] transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-0.5 bg-emerald-500/20 rounded-full text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium tracking-wide">
              AbtalQuest Safe Zone: <strong className="text-amber-300">100% Ad-Free</strong> • <strong className="text-emerald-300">Zero Violence</strong> • Screen-Time Balanced
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
            <span className="text-white/80">
              Curated for Ages 6–13 • COPPA & GDPR-K Compliant
            </span>
            <span className="text-white/40">|</span>
            <span className="text-amber-200 font-medium">
              Verified by Child Psychologists
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header with Semi-Transparent Frosted Glass Effect */}
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          'bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/75 border-b',
          isScrolled
            ? 'border-slate-200/90 shadow-sm py-3'
            : 'border-slate-200/60 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left & Center-Left: Logo and Horizontally Arranged Navigation Links */}
            <div className="flex items-center gap-8 lg:gap-12">
              {/* AbtalQuest Official Logo */}
              <a
                href="#universe"
                onClick={(e) => {
                  e.preventDefault();
                  onViewChange?.('home');
                  setSelectedNavTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5] rounded-xl transition-transform hover:scale-[1.01]"
                aria-label="AbtalQuest Homepage"
              >
                <AbtalQuestLogo
                  variant="light"
                  size="md"
                  showText={true}
                  tagline="Values-Based Digital Universe"
                />
              </a>

              {/* Desktop Navigation Links: "Home", "Blog", "Marketplace", "About" (Center-Left) */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleNavClick(item, e)}
                      className={cn(
                        'font-headline text-sm font-semibold transition-all duration-200 relative py-1 group select-none flex items-center gap-1.5',
                        isActive
                          ? 'text-[#016ba5] font-bold'
                          : 'text-slate-600 hover:text-[#016ba5]'
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
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#016ba5] rounded-full transition-all duration-300" />
                      ) : (
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#016ba5]/40 rounded-full transition-all duration-200 group-hover:w-full" />
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right-Side Actions: Globe Selector, Theme Toggle, and Pill CTA "Download App" */}
            <div className="flex items-center gap-3 sm:gap-3.5">
              
              {/* 1. Round Language / Globe Selector Button */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  type="button"
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className={cn(
                    'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200',
                    'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 hover:text-[#016ba5] hover:border-[#016ba5]/40',
                    'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5]',
                    languageMenuOpen && 'border-[#016ba5] ring-2 ring-[#016ba5]/20 bg-white text-[#016ba5]'
                  )}
                  aria-label="Select Language"
                  title="Language Selector"
                  aria-expanded={languageMenuOpen}
                >
                  <Globe className="w-4 h-4" />
                </button>

                {/* Language Dropdown Menu */}
                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/80 py-2 z-50 animate-fadeIn">
                    <div className="px-3 py-1.5 text-[11px] font-body text-slate-400 font-semibold border-b border-slate-100">
                      Select Language
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setLanguageMenuOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2 text-xs font-headline font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors',
                        language === 'en' ? 'text-[#016ba5] bg-[#016ba5]/5' : 'text-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇺🇸</span>
                        <span>English (US)</span>
                      </div>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-[#016ba5]" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('ar');
                        setLanguageMenuOpen(false);
                      }}
                      className={cn(
                        'w-full px-3.5 py-2 text-xs font-headline font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors',
                        language === 'ar' ? 'text-[#016ba5] bg-[#016ba5]/5' : 'text-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🇦🇪</span>
                        <span>العربية (Arabic)</span>
                      </div>
                      {language === 'ar' && <Check className="w-3.5 h-3.5 text-[#016ba5]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Round Theme-Toggle Button (Sun / Moon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={cn(
                  'w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200',
                  'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 hover:text-[#fa8221] hover:border-[#fa8221]/40',
                  'shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fa8221]'
                )}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                title={`Theme: ${theme === 'light' ? 'Light mode (click for Dark)' : 'Dark mode (click for Light)'}`}
              >
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* 3. Prominent Pill-Shaped CTA Button (#fa8221 Secondary Orange, Montserrat, Right Arrow) */}
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
                <span>Download App</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:text-[#016ba5] hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#016ba5]"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xl px-4 pt-3 pb-6 animate-fadeIn">
            <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    className={cn(
                      'font-headline text-base font-semibold px-4 py-3 rounded-2xl flex items-center justify-between transition-colors',
                      isActive
                        ? 'text-[#016ba5] bg-[#016ba5]/10 font-bold'
                        : 'text-slate-700 hover:text-[#016ba5] hover:bg-slate-50'
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

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
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
                <span>Download App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Download App Modal Dialog */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDownloadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="w-16 h-16 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Smartphone className="w-8 h-8" />
            </div>

            <h3 className="font-headline text-2xl font-black text-[#1E293B] mb-2">
              Download AbtalQuest
            </h3>
            
            <p className="font-body text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
              Join thousands of families in a safe, values-based digital universe. 100% ad-free, no violence, and certified child safe.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href="#app-store"
                onClick={(e) => {
                  e.preventDefault();
                  alert('AbtalQuest on Apple App Store: Releasing with Version 1.0! Early access invites active.');
                  setDownloadModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-headline font-semibold text-sm transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download for iOS (App Store)</span>
              </a>

              <a
                href="#google-play"
                onClick={(e) => {
                  e.preventDefault();
                  alert('AbtalQuest on Google Play Store: Android pre-registration live! 100% safe verified.');
                  setDownloadModalOpen(false);
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-[#016ba5] hover:bg-[#015786] text-white font-headline font-semibold text-sm transition-all shadow-md"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Get on Google Play (Android)</span>
              </a>
            </div>

            {/* Reassurance Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-body text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> Child Safe Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9 Parent Rating
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
