import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Hero from './components/home/Hero';
import VisionMission from './components/home/VisionMission';
import PlanetWorlds from './components/home/PlanetWorlds';
import CoreFeatures from './components/home/CoreFeatures';
import ParentingResources from './components/home/ParentingResources';
import Marketplace from './components/marketplace/Marketplace';
import AdminPortal from './components/admin/AdminPortal';
import UserAuthModal from './components/auth/UserAuthModal';
import UserProfileModal from './components/auth/UserProfileModal';
import ContactModal from './components/common/ContactModal';
import AbtalQuestLogo from './components/common/AbtalQuestLogo';
import Button from './components/common/Button';
import Badge from './components/common/Badge';
import Card from './components/common/Card';
import { subscribeToAuthChanges, signOutUser } from './services/authService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Award, 
  EyeOff, 
  Lock, 
  Palette, 
  Type, 
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'marketplace' | 'admin'>('home');
  const [activeFilter, setActiveFilter] = useState<'all' | 'courage' | 'kindness' | 'wisdom'>('all');
  const [completedQuest, setCompletedQuest] = useState<number | null>(null);

  // User Authentication & Modals State
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      if (hash === '#admin-portal-secure' || pathname === '/admin-portal-secure') {
        setCurrentView('admin');
      } else if (hash === '#marketplace') {
        setCurrentView('marketplace');
      } else if (hash === '#contact') {
        setContactModalOpen(true);
        setCurrentView('home');
      } else if (hash === '' || hash === '#universe' || hash === '#home') {
        setCurrentView('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Subscribe to auth state
    const authSub = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('hashchange', handleHash);
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
    return <AdminPortal />;
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={(view) => {
        setCurrentView(view);
        window.location.hash = view === 'marketplace' ? '#marketplace' : '#universe';
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
      ) : (
        <>
          {/* 1. HERO SECTION: Headline, Sub-headline & Secondary Orange CTA Buttons */}
          <Hero
            onExploreClick={() => {
              const el = document.getElementById('quests-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onDownloadClick={() => {
              alert('AbtalQuest App: Available soon on App Store and Google Play! 100% Safe, Ad-Free & Violence-Free.');
            }}
          />

          {/* 2. VISION & MISSION SECTION: Clean card layouts with soft background surfaces */}
          <VisionMission />

          {/* 3. EXPLORE THE PLANET WORLDS: 4 Interactive Life-Skill Worlds with Gamification Accents */}
          <PlanetWorlds />

          {/* Marketplace Callout Banner on Home */}
          <section className="py-12 bg-gradient-to-r from-[#016ba5]/10 via-[#fa8221]/10 to-[#7C3AED]/10 dark:from-[#016ba5]/20 dark:via-[#fa8221]/20 dark:to-[#7C3AED]/20 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#fa8221] text-white flex items-center justify-center shadow-cta flex-shrink-0">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" size="sm">Safe Quest Shop</Badge>
                    <span className="font-body text-xs text-slate-500 dark:text-slate-400">Screen-Free Kits & Gear</span>
                  </div>
                  <h3 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Looking for Physical Learning Kits & Storybooks?
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Explore birchwood puzzle waterwheels, compass field journals, hydraulic robotic arms, and empathy games.
                  </p>
                </div>
              </div>
              <Button
                variant="cta"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => {
                  setCurrentView('marketplace');
                  window.location.hash = '#marketplace';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Browse Marketplace
              </Button>
            </div>
          </section>

          {/* 4. CORE FEATURES: Values-Based Cartoons, Real-Life Quests, Safe Social Adventures & Quote Banner */}
          <CoreFeatures />

          {/* 5. PARENTING RESOURCES: 3 Blog/Resource Cards with Read Times and Read-More links */}
          <ParentingResources />

      {/* 6. OFFICIAL BRAND DESIGN SYSTEM & TOKENS INSPECTOR */}
      <section className="py-16 bg-white dark:bg-[#071727] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <Badge variant="primary" size="md" icon={<Palette className="w-4 h-4" />}>
                Official Brand Guidelines
              </Badge>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-4">
              AbtalQuest Core Design System
            </h2>
            <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
              Engineered exactly to the official brand manual specifications, detailing precise color weights, role allocations, and strict typography rules.
            </p>
          </div>

          {/* Color Palette Cards Grid - Displaying all colors and % allocations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
            
            {/* Primary Brand (40%) */}
            <div className="p-4 rounded-2xl border-2 border-[#016ba5]/30 bg-[#016ba5]/5 dark:bg-[#016ba5]/20 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#016ba5] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #016ba5
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#016ba5] dark:text-[#38BDF8]">Primary Brand</span>
                  <span className="font-gamification text-xs bg-[#016ba5] text-white px-2 py-0.5 rounded-full font-bold">
                    40%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Brand / Structure</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Navbar, links, active states, key structure elements
                </p>
              </div>
            </div>

            {/* Secondary CTA (35%) */}
            <div className="p-4 rounded-2xl border-2 border-[#fa8221]/30 bg-[#fa8221]/5 dark:bg-[#fa8221]/20 hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#fa8221] shadow-cta mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #fa8221
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#fa8221]">Secondary CTA</span>
                  <span className="font-gamification text-xs bg-[#fa8221] text-white px-2 py-0.5 rounded-full font-bold">
                    35%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Action / CTA</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Buttons, call-to-action, energetic highlights
                </p>
              </div>
            </div>

            {/* Success Color (4%) */}
            <div className="p-4 rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/5 dark:bg-[#22C55E]/20 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#22C55E] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #22C55E
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#16a34a] dark:text-[#22C55E]">Success</span>
                  <span className="font-gamification text-xs bg-[#22C55E] text-white px-2 py-0.5 rounded-full font-bold">
                    4%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Achievement</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Completed tasks, achievements, progress
                </p>
              </div>
            </div>

            {/* Warning Color (3%) */}
            <div className="p-4 rounded-2xl border border-[#FACC15]/40 bg-[#FACC15]/10 dark:bg-[#FACC15]/20 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#FACC15] shadow-sm mb-3 flex items-center justify-center text-slate-900 font-headline font-bold text-sm">
                  #FACC15
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#ca8a04] dark:text-[#FACC15]">Attention</span>
                  <span className="font-gamification text-xs bg-[#ca8a04] text-white px-2 py-0.5 rounded-full font-bold">
                    3%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Warning / Notice</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Warnings, reminders, parent notifications
                </p>
              </div>
            </div>

            {/* Deep Contrast (4%) */}
            <div className="p-4 rounded-2xl border border-[#1C1C1C]/30 dark:border-slate-700 bg-[#1C1C1C]/5 dark:bg-[#1C1C1C]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#1C1C1C] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #1C1C1C
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#1C1C1C] dark:text-slate-200">Deep Contrast</span>
                  <span className="font-gamification text-xs bg-[#1C1C1C] text-white px-2 py-0.5 rounded-full font-bold">
                    4%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Depth</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Footer, overlays, strong contrast areas
                </p>
              </div>
            </div>

            {/* Gamification Color (4%) */}
            <div className="p-4 rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 dark:bg-[#7C3AED]/20 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#7C3AED] shadow-quest mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #7C3AED
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#7C3AED] dark:text-[#A78BFA]">Gamification</span>
                  <span className="font-gamification text-xs bg-[#7C3AED] text-white px-2 py-0.5 rounded-full font-bold">
                    4%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Adventure</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Levels, quests, badges, achievements
                </p>
              </div>
            </div>

            {/* Info / Clarity (4%) */}
            <div className="p-4 rounded-2xl border border-[#38BDF8]/30 bg-[#38BDF8]/5 dark:bg-[#38BDF8]/20 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#38BDF8] shadow-sm mb-3 flex items-center justify-center text-slate-900 font-headline font-bold text-sm">
                  #38BDF8
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#0284c7] dark:text-[#38BDF8]">Info / Clarity</span>
                  <span className="font-gamification text-xs bg-[#0284c7] text-white px-2 py-0.5 rounded-full font-bold">
                    4%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Accent / Info</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Highlights, tooltips, secondary UI accents
                </p>
              </div>
            </div>

            {/* Foundation Base (2%) */}
            <div className="p-4 rounded-2xl border border-[#0A2540]/30 dark:border-slate-700 bg-[#0A2540]/5 dark:bg-[#0A2540]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#0A2540] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #0A2540
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#0A2540] dark:text-sky-300">Foundation</span>
                  <span className="font-gamification text-xs bg-[#0A2540] text-white px-2 py-0.5 rounded-full font-bold">
                    2%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Base Surface</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Main backgrounds, sections, dark mode
                </p>
              </div>
            </div>

            {/* Primary Text (2%) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F2F4E] hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#1E293B] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #1E293B
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#1E293B] dark:text-white">Primary Text</span>
                  <span className="font-gamification text-xs bg-[#1E293B] text-white px-2 py-0.5 rounded-full font-bold">
                    2%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Readability</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Headings, important text, titles
                </p>
              </div>
            </div>

            {/* Secondary Text (2%) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F2F4E] hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-full h-16 rounded-xl bg-[#64748B] shadow-sm mb-3 flex items-center justify-center text-white font-headline font-bold text-sm">
                  #64748B
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-[#64748B] dark:text-slate-300">Secondary Text</span>
                  <span className="font-gamification text-xs bg-[#64748B] text-white px-2 py-0.5 rounded-full font-bold">
                    2%
                  </span>
                </div>
                <div className="font-body text-xs text-slate-500 dark:text-slate-400 mb-2">Role: Support</div>
                <p className="font-body text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  Descriptions, labels, inactive text
                </p>
              </div>
            </div>

          </div>

          {/* Typography Rules Inspection Panel */}
          <div className="bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="info" size="md" icon={<Type className="w-4 h-4" />}>
                Typography Rulebook
              </Badge>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400">Strictly Enforced (Brand Page 4-7)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Rule 1: Montserrat */}
              <div className="bg-white dark:bg-[#0F2F4E] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline font-black text-xl text-[#016ba5] dark:text-[#38BDF8]">Aa Montserrat</span>
                  <span className="text-[11px] font-body bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8] px-2 py-0.5 rounded-md font-bold">
                    Primary Font
                  </span>
                </div>
                <div className="font-headline font-bold text-base text-slate-800 dark:text-white mb-1">
                  Headlines, Titles & Buttons
                </div>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-3">
                  Clean, geometric, and modern. Conveys strength, clarity, and heroism for children and educators.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                  <Button variant="cta" size="sm">Sample CTA</Button>
                  <Button variant="primary" size="sm">Brand Action</Button>
                </div>
              </div>

              {/* Rule 2: Roboto Mono */}
              <div className="bg-white dark:bg-[#0F2F4E] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body font-bold text-xl text-[#1E293B] dark:text-white">Aa Roboto Mono</span>
                  <span className="text-[11px] font-body bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold">
                    Secondary Font
                  </span>
                </div>
                <div className="font-headline font-bold text-base text-slate-800 dark:text-white mb-1">
                  Paragraphs, UI Text & Content
                </div>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-3">
                  Extremely readable, structured, and modern. Prevents visual fatigue during prolonged reading.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 font-body text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0A2540] p-2 rounded-lg">
                  <code>"Every journey begins with a pure intention."</code>
                </div>
              </div>

              {/* Rule 3: Baloo 2 */}
              <div className="bg-white dark:bg-[#0F2F4E] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-gamification font-bold text-2xl text-[#7C3AED] dark:text-[#A78BFA]">Aa Baloo 2</span>
                  <span className="text-[11px] font-body bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#A78BFA] px-2 py-0.5 rounded-md font-bold">
                    Gamification Only
                  </span>
                </div>
                <div className="font-headline font-bold text-base text-slate-800 dark:text-white mb-1">
                  Badges, Rewards & Levels
                </div>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-3">
                  Playful, friendly, and rounded for kids. Exclusively reserved for gamified achievements and rewards.
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-1.5">
                  <Badge variant="gamification" size="sm">Level 10</Badge>
                  <Badge variant="success" size="sm">+500 XP</Badge>
                  <Badge variant="secondary" size="sm">Heroic Crown</Badge>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. LOGO VARIANTS AS DETAILED IN PAGE 3 GUIDELINES */}
      <section className="py-16 bg-slate-50 dark:bg-[#0A1D30] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-headline text-3xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mb-2">
              Official Logo Specifications
            </h2>
            <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300">
              Directly conforming to Page 3 guidelines: "The logo can only be used in brand identity colors or black."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. White Background Variant */}
            <div className="bg-white dark:bg-[#0F2F4E] border border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="p-4 mb-4">
                <AbtalQuestLogo variant="light" size="lg" direction="vertical" />
              </div>
              <span className="font-headline font-bold text-sm text-[#016ba5] dark:text-[#38BDF8] mb-1">White / Light Surface</span>
              <span className="font-body text-xs text-slate-500 dark:text-slate-400">
                Primary use on white or light backgrounds
              </span>
            </div>

            {/* 2. Brand Color Surface Variant */}
            <div className="bg-[#016ba5] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg">
              <div className="p-4 mb-4">
                <AbtalQuestLogo variant="brand" size="lg" direction="vertical" />
              </div>
              <span className="font-headline font-bold text-sm text-white mb-1">Brand Colored Surface</span>
              <span className="font-body text-xs text-blue-100">
                For use on brand colored background (#016ba5)
              </span>
            </div>

            {/* 3. Dark / Black Surface Variant */}
            <div className="bg-[#1C1C1C] rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg border border-slate-800">
              <div className="p-4 mb-4">
                <AbtalQuestLogo variant="dark" size="lg" direction="vertical" />
              </div>
              <span className="font-headline font-bold text-sm text-amber-400 mb-1">Deep Contrast Surface</span>
              <span className="font-body text-xs text-slate-400">
                For use on dark backgrounds (#1C1C1C / #0A2540)
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 4. VALUES & SAFETY PILLARS: 0% Ads, 0% Violence */}
      <section id="safety-pledge" className="py-20 bg-white dark:bg-[#071727] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="success" size="lg" icon={<ShieldCheck className="w-5 h-5" />}>
              The AbtalQuest Safety Covenant
            </Badge>
            <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight mt-4 mb-4">
              Designed For Children. Trusted By Parents.
            </h2>
            <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
              We eliminated the toxic formulas of modern mobile games. No sensory over-stimulation, no loot-boxes, no violent combat, and never any advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <Card variant="interactive" borderHighlight="primary" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center mb-5">
                <EyeOff className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                100% Ad-Free
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Children are never targeted with commercial marketing, hidden trackers, or sponsored influencers.
              </p>
            </Card>

            {/* Pillar 2 */}
            <Card variant="interactive" borderHighlight="secondary" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                Zero Violence
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Quests replace combat with cooperative problem solving, moral dilemmas, teamwork, and kindness.
              </p>
            </Card>

            {/* Pillar 3 */}
            <Card variant="interactive" borderHighlight="gamification" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] dark:text-[#A78BFA] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                Values-Driven XP
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Character traits like honesty, patience (Sabr), and respect are celebrated as the highest achievements.
              </p>
            </Card>

            {/* Pillar 4 */}
            <Card variant="interactive" borderHighlight="success" className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 text-[#16a34a] dark:text-[#22C55E] flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-800 dark:text-white mb-2">
                Parental Harmony
              </h3>
              <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Built-in daily limit timers and insightful weekly character journals sent directly to parent dashboards.
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
                <Badge variant="gamification" size="sm">Interactive Quest Log</Badge>
                <Badge variant="secondary" size="sm">Live Demo</Badge>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#1E293B] dark:text-white tracking-tight">
                Embark on Moral Quests
              </h2>
              <p className="font-body text-xs sm:text-sm text-[#64748B] dark:text-slate-300 mt-1">
                Explore how the design system balances Montserrat headlines, Roboto Mono body, and Baloo rewards.
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
                All Quests
              </button>
              <button
                onClick={() => setActiveFilter('kindness')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'kindness'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                Kindness
              </button>
              <button
                onClick={() => setActiveFilter('courage')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'courage'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                Courage
              </button>
              <button
                onClick={() => setActiveFilter('wisdom')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeFilter === 'wisdom'
                    ? 'bg-[#016ba5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#016ba5] dark:hover:text-[#38BDF8]'
                }`}
              >
                Wisdom
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
                        {isDone ? 'Earned ✨' : quest.xp}
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
                      {isDone ? 'Completed' : 'Accept Quest'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER: Secondary Energy #fa8221 & Foundation #0A2540 */}
      <section id="explore-demo" className="py-20 bg-gradient-to-r from-[#0A2540] via-[#016ba5] to-[#0A2540] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,130,33,0.25),transparent_50%)]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <Badge variant="secondary" size="lg" className="mb-6 shadow-cta">
            Ready to Begin?
          </Badge>

          <h2 className="font-headline text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Join the Next Generation of Values-Driven Heroes.
          </h2>

          <p className="font-body text-sm sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Create a family adventure profile today. Zero ads, zero violence, infinite imagination and noble values.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="cta"
              size="xl"
              icon={<Sparkles className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => alert('Welcome to AbtalQuest! Registration flow initialized.')}
            >
              Start Free Adventure
            </Button>

            <Button
              variant="outline"
              size="xl"
              className="border-white text-white hover:bg-white/10"
              onClick={() => alert('Parental guide loaded.')}
            >
              Download Parent Guide (PDF)
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

    </Layout>
  );
}

export default App;
