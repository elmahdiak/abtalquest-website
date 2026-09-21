import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/home/Hero';
import VisionMission from './components/home/VisionMission';
import CoreFeatures from './components/home/CoreFeatures';
import ParentingResources from './components/home/ParentingResources';
import DownloadAppSection from './components/home/DownloadAppSection';
import WhyAbtalQuestSection from './components/home/WhyAbtalQuestSection';
import Marketplace from './components/marketplace/Marketplace';
import AdminPortal from './components/admin/AdminPortal';
import AboutUsView from './components/about/AboutUsView';
import UserAuthModal from './components/auth/UserAuthModal';
import UserProfileModal from './components/auth/UserProfileModal';
import ContactModal from './components/common/ContactModal';
import WatchDemoModal from './components/common/WatchDemoModal';
import FloatingCartButton from './components/common/FloatingCartButton';
import { SafetyStandardsView, type SafetyStandardTab } from './components/compliance/SafetyStandardsView';
import { subscribeToAuthChanges, signOutUser } from './services/authService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'marketplace' | 'admin' | 'safety-standards' | 'about' | 'blog'>('home');
  const [activeSafetyTab, setActiveSafetyTab] = useState<SafetyStandardTab>('privacy-kids');

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
        hash === '#blog' || 
        hash === '#parenting' || 
        hash === '#parenting-resources' || 
        hash.startsWith('#article-') || 
        hash.startsWith('#blog-')
      ) {
        setCurrentView('blog');
      } else if (
        hash === '' || 
        hash === '#universe' || 
        hash === '#home'
      ) {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);

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
        window.location.hash = 
          view === 'marketplace' ? '#marketplace' : 
          view === 'about' ? '#about' : 
          view === 'blog' ? '#blog' : 
          '#universe';
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
      ) : currentView === 'blog' ? (
        <ParentingResources />
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
              const el = document.getElementById('vision-mission');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onWatchDemo={() => setWatchDemoOpen(true)}
          />

          {/* 2. VISION & MISSION SECTION */}
          <VisionMission />

          {/* 3. CORE FEATURES */}
          <CoreFeatures />

          {/* 4. FOUNDING STORY / WHY ABTALQUEST */}
          <WhyAbtalQuestSection
            onLearnMore={() => {
              setCurrentView('about');
              window.location.hash = '#about';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 5. APP DOWNLOAD SECTION */}
          <DownloadAppSection />
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
          const el = document.getElementById('vision-mission');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

    </Layout>
  );
}

export default App;
