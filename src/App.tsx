import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/home/Hero';
import InstitutionalCredibility from './components/home/InstitutionalCredibility';
import VisionMission from './components/home/VisionMission';
import PlanetWorlds from './components/home/PlanetWorlds';
import CoreFeatures from './components/home/CoreFeatures';
import ParentingResources from './components/home/ParentingResources';
import DownloadAppSection from './components/home/DownloadAppSection';
import WhyAbtalQuestSection from './components/home/WhyAbtalQuestSection';
import MarketplacePreviewSection from './components/home/MarketplacePreviewSection';
import Marketplace from './components/marketplace/Marketplace';
import AdminPortal from './components/admin/AdminPortal';
import AboutUsView from './components/about/AboutUsView';
import { MarketplaceTrendingCarousel } from './components/marketplace/MarketplaceTrendingCarousel';
import UserAuthModal from './components/auth/UserAuthModal';
import UserProfileModal from './components/auth/UserProfileModal';
import ContactModal from './components/common/ContactModal';
import WatchDemoModal from './components/common/WatchDemoModal';
import FloatingCartButton from './components/common/FloatingCartButton';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import Card from './components/common/Card';
import { SafetyStandardsView, type SafetyStandardTab } from './components/compliance/SafetyStandardsView';
import { subscribeToAuthChanges, signOutUser } from './services/authService';
import { 
  type Product, 
  DEFAULT_PRODUCTS, 
  fetchMarketplaceProducts, 
  getAllOrdersForAdmin, 
  getProductViewCounts, 
  rankProductsByPopularity 
} from './services/marketplaceService';
import { useLanguage } from './context/LanguageContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  EyeOff, 
  Lock, 
  Sparkles
} from 'lucide-react';

export function App() {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'home' | 'marketplace' | 'admin' | 'safety-standards' | 'about'>('home');
  const [selectedMarketplaceProduct, setSelectedMarketplaceProduct] = useState<string | null>(null);
  const [homeTrendingProducts, setHomeTrendingProducts] = useState<Product[]>(() => {
    const { rankedProducts } = rankProductsByPopularity(DEFAULT_PRODUCTS, [], {});
    return rankedProducts.slice(0, 8);
  });
  const [activeSafetyTab, setActiveSafetyTab] = useState<SafetyStandardTab>('privacy-kids');
  const [activeFilter, setActiveFilter] = useState<'all' | 'courage' | 'kindness' | 'wisdom'>('all');
  const [completedQuest, setCompletedQuest] = useState<number | null>(null);

  // User Authentication & Modals State
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [watchDemoOpen, setWatchDemoOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search.toLowerCase());

      // Secret Admin Portal Triggers (completely hidden from public navigation)
      // 1. Secret URL hashes: #admin-secret, #admin, #admin-portal-secure, #admin-portal
      // 2. Secret query parameters: ?mode=admin, ?portal=admin, ?admin=true, ?secret=admin
      // 3. Secret pathnames: /admin-secret, /admin-portal-secure
      const isSecretAdminTrigger = 
        hash === '#admin-secret' ||
        hash === '#admin' ||
        hash === '#admin-portal-secure' ||
        hash === '#admin-portal' ||
        searchParams.get('mode') === 'admin' ||
        searchParams.get('portal') === 'admin' ||
        searchParams.get('admin') === 'true' ||
        searchParams.get('secret') === 'admin' ||
        pathname === '/admin-secret' ||
        pathname === '/admin-portal-secure';

      if (isSecretAdminTrigger) {
        setCurrentView('admin');
      } else if (
        hash.startsWith('#marketplace') || 
        hash.startsWith('#/marketplace') || 
        pathname.startsWith('/marketplace')
      ) {
        setCurrentView('marketplace');
      } else if (hash === '#contact') {
        setContactModalOpen(true);
        setCurrentView('home');
      } else if (
        hash === '#privacy-for-kids' ||
        hash === '#privacy-kids' ||
        hash === '#privacy'
      ) {
        setActiveSafetyTab('privacy-kids');
        setCurrentView('safety-standards');
      } else if (
        hash === '#child-safety-pledge' ||
        hash === '#safety-pledge' ||
        hash === '#safety'
      ) {
        setActiveSafetyTab('safety-pledge');
        setCurrentView('safety-standards');
      } else if (
        hash === '#ad-free-standard' ||
        hash === '#ad-free'
      ) {
        setActiveSafetyTab('ad-free');
        setCurrentView('safety-standards');
      } else if (
        hash === '#coppa-compliance' ||
        hash === '#coppa'
      ) {
        setActiveSafetyTab('coppa');
        setCurrentView('safety-standards');
      } else if (
        hash === '#parental-oversight' ||
        hash === '#parent-controls' ||
        hash === '#parenting-controls'
      ) {
        setActiveSafetyTab('parent-oversight');
        setCurrentView('safety-standards');
      } else if (
        hash === '#about' ||
        hash === '#about-us' ||
        hash === '#/about' ||
        pathname === '/about'
      ) {
        setCurrentView('about');
      } else if (
        hash.startsWith('#safety-standards') ||
        hash.startsWith('#compliance')
      ) {
        setCurrentView('safety-standards');
      } else if (
        hash === '' || 
        hash === '#universe' || 
        hash === '#home' || 
        hash.startsWith('#article-') || 
        hash.startsWith('#blog-') || 
        hash.startsWith('#parenting')
      ) {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);

    // Fetch live products to power the Home Page Trending Carousel
    const loadHomeProducts = async () => {
      try {
        const [prodResult, orders] = await Promise.all([
          fetchMarketplaceProducts(),
          getAllOrdersForAdmin().catch(() => []),
        ]);
        const prods = Array.isArray(prodResult) ? prodResult : (prodResult?.products || DEFAULT_PRODUCTS);
        const viewCounts = getProductViewCounts();
        const { rankedProducts } = rankProductsByPopularity(prods.length > 0 ? prods : DEFAULT_PRODUCTS, orders, viewCounts);
        setHomeTrendingProducts(rankedProducts.slice(0, 8));
      } catch (e) {
        console.warn('Failed to load home trending products:', e);
      }
    };
    void loadHomeProducts();

    // Subscribe to auth state
    const authSub = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
      authSub.unsubscribe();
    };
  }, []);

  // Sample Quests showcasing values and gamified Baloo badges
  const quests = [
    {
      id: 1,
      category: 'kindness',
      title: 'The Whispering Tree of Gratitude',
      description: 'Help the village elder plant words of kindness that bloom into healing shade for weary travelers.',
      level: 'Level 1 • Seedling',
      xp: '+150 XP',
      value: 'Compassion & Gratitude',
      status: completedQuest === 1 ? 'Completed' : 'Available',
      badgeColor: 'gamification' as const,
    },
    {
      id: 2,
      category: 'courage',
      title: 'Defend the Bridge of Truth',
      description: 'Choose honest answers in the riddle valley to dispel illusions and unlock the path forward.',
      level: 'Level 3 • Truth Seeker',
      xp: '+320 XP',
      value: 'Integrity & Honesty',
      status: completedQuest === 2 ? 'Completed' : 'Available',
      badgeColor: 'secondary' as const,
    },
    {
      id: 3,
      category: 'wisdom',
      title: 'The Astrolabe of Ancient Scholars',
      description: 'Reconstruct the constellation map to discover how ancient astronomers navigated the great desert.',
      level: 'Level 5 • Scholar',
      xp: '+450 XP',
      value: 'Curiosity & Knowledge',
      status: completedQuest === 3 ? 'Completed' : 'Available',
      badgeColor: 'info' as const,
    },
  ];

  const filteredQuests = activeFilter === 'all' 
    ? quests 
    : quests.filter(q => q.category === activeFilter);

  const handleCompleteQuest = (id: number) => {
    if (completedQuest !== id) {
      setCompletedQuest(id);
    }
  };

  if (currentView === 'admin') {
    return (
      <AdminPortal 
        onClose={() => {
          // Safely strip secret query parameters and hash when exiting to public website
          const url = new URL(window.location.href);
          url.searchParams.delete('mode');
          url.searchParams.delete('portal');
          url.searchParams.delete('admin');
          url.searchParams.delete('secret');
          url.hash = '#universe';
          window.history.replaceState({}, '', url.pathname + (url.search ? '?' + url.searchParams.toString() : '') + '#universe');
          setCurrentView('home');
        }}
      />
    );
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={(view) => {
        setCurrentView(view);
        window.location.hash = view === 'marketplace' ? '#marketplace' : view === 'about' ? '#about' : '#universe';
      }}
      user={user}
      onOpenAuth={() => setAuthModalOpen(true)}
      onOpenProfile={() => setProfileModalOpen(true)}
      onOpenContact={() => setContactModalOpen(true)}
    >
      {currentView === 'marketplace' ? (
        <Marketplace 
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          initialProductId={selectedMarketplaceProduct}
        />
      ) : currentView === 'about' ? (
        <AboutUsView
          onBackToHome={() => {
            window.location.hash = '#universe';
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreMarketplace={() => {
            window.location.hash = '#marketplace';
            setCurrentView('marketplace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'safety-standards' ? (
        <SafetyStandardsView
          activeTab={activeSafetyTab}
          onTabChange={(tab) => setActiveSafetyTab(tab)}
          onBackToHome={() => {
            window.location.hash = '#universe';
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreMarketplace={() => {
            window.location.hash = '#marketplace';
            setCurrentView('marketplace');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenContact={() => setContactModalOpen(true)}
        />
      ) : (
        <>
          {/* 1. HERO SECTION */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('planet-worlds');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onWatchDemo={() => setWatchDemoOpen(true)}
          />

          {/* 2. EXPLORE THE PLANET WORLDS */}
          <PlanetWorlds />

          {/* 3. VISION & MISSION SECTION */}
          <VisionMission />

          {/* 4. CORE FEATURES (REVOLUTIONARY FEATURES) */}
          <CoreFeatures />

          {/* 5. APP DOWNLOAD SECTION */}
          <DownloadAppSection />

          {/* 6. PHILOSOPHY & WHY ABTALQUEST */}
          <WhyAbtalQuestSection
            onLearnMore={() => {
              setCurrentView('about');
              window.location.hash = '#about';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 7. MARKETPLACE PREVIEW SECTION */}
          <MarketplacePreviewSection
            onExploreMarketplace={() => {
              setCurrentView('marketplace');
              window.location.hash = '#marketplace';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddToCart={(productId) => {
              setSelectedMarketplaceProduct(productId);
            }}
          />

          {/* 🔥 TRENDING NOW PRODUCT CAROUSEL ON HOME */}
          {homeTrendingProducts.length > 0 && (
            <section className="py-10 sm:py-14 bg-gradient-to-b from-amber-500/[0.03] to-transparent dark:from-amber-500/[0.02] border-b border-slate-200/80 dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <MarketplaceTrendingCarousel
                  products={homeTrendingProducts}
                  onSelectProduct={(prod) => {
                    setSelectedMarketplaceProduct(prod.id);
                    setCurrentView('marketplace');
                    window.location.hash = '#marketplace';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={(prod) => {
                    setSelectedMarketplaceProduct(prod.id);
                    setCurrentView('marketplace');
                    window.location.hash = '#marketplace';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToggleWishlist={() => {}}
                  wishlistIds={[]}
                  cart={[]}
                />
              </div>
            </section>
          )}

          {/* 8. PARENTING RESOURCES (BLOG) */}
          <ParentingResources />

          {/* 9. INSTITUTIONAL BACKING, SUPPORTERS & RECOGNITION */}
          <InstitutionalCredibility />

          {/* 6. VALUES & SAFETY PILLARS: 0% Ads, 0% Violence */}
          <section id="safety-pledge" className="py-20 bg-white dark:bg-[#071727] border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="success" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
              {t('vision.badge')}
            </Badge>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mt-4 mb-4">
              {t('features.title')}
            </h2>
            <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <Card variant="interactive" borderHighlight="primary" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center mb-5">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                {t('nav.safety_ticker_bold_1')}
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {t('hero.stat_ad_free_desc')}
              </p>
            </Card>

            {/* Pillar 2 */}
            <Card variant="interactive" borderHighlight="secondary" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                {t('nav.safety_ticker_bold_2')}
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {t('features.feat_2_desc')}
              </p>
            </Card>

            {/* Pillar 3 */}
            <Card variant="interactive" borderHighlight="gamification" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                {t('hero.stat_values')}
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {t('hero.stat_values_desc')}
              </p>
            </Card>

            {/* Pillar 4 */}
            <Card variant="interactive" borderHighlight="success" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 text-[#16a34a] dark:text-[#22C55E] flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                {t('features.feat_1_title')}
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                {t('features.feat_1_desc')}
              </p>
            </Card>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE QUESTS DEMO */}
      <section id="quests-section" className="py-20 bg-slate-50/70 dark:bg-[#0A1D30] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="gamification" size="sm">{t('quests.badge')}</Badge>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
                {t('quests.title')}
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300 mt-1">
                {t('quests.subtitle')}
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-[#0F2F4E] p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm font-headline text-xs font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                {t('quests.filter_all')}
              </button>
              <button
                onClick={() => setActiveFilter('kindness')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'kindness'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                {t('quests.filter_kindness')}
              </button>
              <button
                onClick={() => setActiveFilter('courage')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'courage'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                {t('quests.filter_courage')}
              </button>
              <button
                onClick={() => setActiveFilter('wisdom')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'wisdom'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                {t('quests.filter_wisdom')}
              </button>
            </div>
          </div>

          {/* Quests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => {
              const isDone = completedQuest === quest.id;
              return (
                <Card
                  key={quest.id}
                  variant="interactive"
                  borderHighlight={quest.badgeColor === 'gamification' ? 'gamification' : quest.badgeColor === 'secondary' ? 'secondary' : 'primary'}
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Level & XP header using Baloo 2 font */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <Badge variant={quest.badgeColor} size="sm">
                        {quest.level}
                      </Badge>
                      <Badge variant={isDone ? 'success' : 'gamification'} size="sm">
                        {isDone ? t('quests.btn_completed') : quest.xp}
                      </Badge>
                    </div>

                    {/* Quest Title using Montserrat font */}
                    <h3 className="font-headline text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {quest.title}
                    </h3>

                    {/* Quest Body using Roboto Mono font */}
                    <p className="font-body text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-6">
                      {quest.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="font-body text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Value: <strong className="text-slate-700 dark:text-slate-200">{quest.value}</strong>
                    </span>

                    <Button
                      variant={isDone ? 'primary' : 'cta'}
                      size="sm"
                      onClick={() => handleCompleteQuest(quest.id)}
                    >
                      {isDone ? t('quests.btn_completed') : t('quests.btn_start_quest')}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section id="explore-demo" className="py-20 bg-gradient-to-r from-[#0A2540] via-[#016ba5] to-[#0A2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,130,33,0.25),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <Badge variant="secondary" size="lg" className="mb-6 shadow-cta">
            {t('hero.badge_safe')}
          </Badge>

          <h2 className="font-headline text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            {t('hero.title_prefix')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fa8221] via-amber-300 to-[#fa8221]">
              {t('hero.title_highlight')}
            </span>
          </h2>

          <p className="font-body text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="cta"
              size="xl"
              icon={<Sparkles className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => alert(t('parenting.newsletter_success'))}
            >
              {t('hero.cta_explore')}
            </Button>

            <Button
              variant="outline"
              size="xl"
              className="border-white text-white hover:bg-white/10"
              onClick={() => {
                const el = document.getElementById('parenting-resources');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('parenting.badge')}
            </Button>
          </div>

        </div>
      </section>
        </>
      )}

      {/* User Authentication Modal */}
      <UserAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setAuthModalOpen(false);
        }}
      />

      {/* User Family Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onSignOut={async () => {
          await signOutUser();
          setUser(null);
        }}
      />

      {/* Visitor Contact Us Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Floating Cart Button (Available across pages) */}
      <FloatingCartButton
        onClick={() => {
          setCurrentView('marketplace');
          window.location.hash = '#marketplace';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Interactive Watch Demo Walkthrough Modal */}
      <WatchDemoModal
        isOpen={watchDemoOpen}
        onClose={() => setWatchDemoOpen(false)}
        onExplorePlanets={() => {
          const el = document.getElementById('planet-worlds');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

    </Layout>
  );
}

export default App;
