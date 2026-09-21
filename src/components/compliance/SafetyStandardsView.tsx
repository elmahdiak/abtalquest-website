import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  HeartHandshake, 
  SlidersHorizontal, 
  ArrowLeft, 
  ShoppingBag, 
  CheckCircle2, 
  Mail, 
  Award, 
  Sparkles, 
  Smile, 
  FileText, 
  Users, 
  KeyRound, 
  Clock
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import Badge from '../common/Badge';

export type SafetyStandardTab = 
  | 'privacy-kids' 
  | 'safety-pledge' 
  | 'ad-free' 
  | 'coppa' 
  | 'parent-oversight';

export interface SafetyStandardsViewProps {
  activeTab?: SafetyStandardTab;
  onTabChange?: (tab: SafetyStandardTab) => void;
  onBackToHome?: () => void;
  onExploreMarketplace?: () => void;
  onOpenContact?: () => void;
}

export const SafetyStandardsView: React.FC<SafetyStandardsViewProps> = ({
  activeTab = 'privacy-kids',
  onTabChange,
  onBackToHome,
  onExploreMarketplace,
  onOpenContact,
}) => {
  const { t, language, direction } = useLanguage();
  const isRtl = direction === 'rtl' || language === 'ar';

  // Synchronize URL hash when tab changes
  const handleSelectTab = (tab: SafetyStandardTab) => {
    onTabChange?.(tab);
    const hashMapping: Record<SafetyStandardTab, string> = {
      'privacy-kids': '#privacy-for-kids',
      'safety-pledge': '#child-safety-pledge',
      'ad-free': '#ad-free-standard',
      'coppa': '#coppa-compliance',
      'parent-oversight': '#parental-oversight',
    };
    if (window.location.hash !== hashMapping[tab]) {
      window.history.pushState(null, '', hashMapping[tab]);
    }
  };

  // Scroll to top when view mounts or tab switches
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabs: { id: SafetyStandardTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'privacy-kids',
      label: t('safety.tab_privacy_kids') || 'Privacy for Kids',
      icon: <Smile className="w-4 h-4" />,
    },
    {
      id: 'safety-pledge',
      label: t('safety.tab_safety_pledge') || 'Child Safety Pledge',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      id: 'ad-free',
      label: t('safety.tab_ad_free') || '100% Ad-Free Standard',
      icon: <EyeOff className="w-4 h-4" />,
    },
    {
      id: 'coppa',
      label: t('safety.tab_coppa') || 'COPPA & CNDP Compliance',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'parent-oversight',
      label: t('safety.tab_parent_oversight') || 'Parental Oversight Tools',
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-[#071727] min-h-screen text-slate-800 dark:text-slate-100 font-body transition-colors duration-200">
      
      {/* 1. Hero Header Banner */}
      <section className="relative bg-gradient-to-b from-[#0A2540] via-[#0D3156] to-[#0A2540] text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#016ba5]/40 shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#016ba5]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumb & Navigation Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-blue-200/80 font-medium">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBackToHome}
                className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{t('safety.breadcrumb_home') || 'Home'}</span>
              </button>
              <span>/</span>
              <span className="text-white font-semibold">
                {t('safety.breadcrumb_safety') || 'Safety & Family Standards'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToHome}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
              >
                <ArrowLeft className={cn("w-3.5 h-3.5", isRtl && "rotate-180")} />
                <span>{t('safety.back_to_home') || 'Back to Home'}</span>
              </button>

              <button
                type="button"
                onClick={onExploreMarketplace}
                className="px-3.5 py-1.5 rounded-xl bg-[#fa8221] hover:bg-[#e07116] text-white font-semibold transition-all flex items-center gap-1.5 text-xs shadow-sm cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('safety.back_to_marketplace') || 'Explore Marketplace'}</span>
              </button>
            </div>
          </div>

          {/* Title Area */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('safety.trust_seal_title') || 'Verified Family Protection'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-white mb-4">
              {t('safety.page_title') || 'Platform Safety, Compliance & Family Standards'}
            </h1>

            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              {t('safety.page_subtitle') ||
                'Our uncompromising commitments to children\'s online privacy, non-toxic physical safety, and wholesome educational discovery.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-white/10 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{t('safety.last_updated') || 'Policy verified: March 2026'}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('safety.trust_seal_subtitle') || 'COPPA, Moroccan CNDP Law 09-08 & EN71 compliant'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Standards Sticky Sub-Navigation */}
      <nav 
        aria-label="Safety Standards Tabs"
        className="sticky top-0 z-30 bg-white/95 dark:bg-[#0A1D30]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0',
                    isActive
                      ? 'bg-[#016ba5] text-white shadow-md shadow-[#016ba5]/20 ring-2 ring-[#016ba5]/40 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-slate-400 dark:text-slate-400'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 3. Main Standards Content Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* ======================================================== */}
        {/* STANDARD 1: PRIVACY FOR KIDS                             */}
        {/* ======================================================== */}
        {activeTab === 'privacy-kids' && (
          <article className="space-y-8 animate-fadeIn">
            {/* Standard Header */}
            <div className="bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent dark:from-sky-500/15 p-6 sm:p-8 rounded-3xl border border-sky-200 dark:border-sky-900/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="info" size="sm">
                  {t('safety.kids_badge') || 'Kid-Friendly Privacy'}
                </Badge>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-bold">★ AbtalQuest Hero Shield</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
                {t('safety.kids_title') || 'Privacy for Kids: Your Secret Treasure'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {t('safety.kids_intro') ||
                  'Just like every legendary explorer has a shield to guard their treasures, AbtalQuest gives you a Cosmic Shield. You own your story, your ideas, and your achievements.'}
              </p>
            </div>

            {/* 4 Illustrated Kid Privacy Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1 */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Smile className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t('safety.kids_card1_title') || 'No Real Names on Quests'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('safety.kids_card1_desc') ||
                    'You choose a cool hero codename and avatar. We never ask for your real last name, home address, or school when you do quests.'}
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <EyeOff className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t('safety.kids_card2_title') || 'No Secret Cameras or Microphones'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('safety.kids_card2_desc') ||
                    'We never turn on your microphone or camera without permission. Your room, your voice, and your family conversations stay completely private.'}
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t('safety.kids_card3_title') || 'No Creepy Trackers'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('safety.kids_card3_desc') ||
                    'Nobody is allowed to follow you around or spy on what you do. Your quest notes and badges belong only to you and your family.'}
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {t('safety.kids_card4_title') || 'Grown-Ups Hold the Master Key'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('safety.kids_card4_desc') ||
                    'Only parents or guardians can unlock accounts or order kits. If anything ever looks strange, you can always ask a grown-up for help.'}
                </p>
              </div>
            </div>

            {/* 4 Golden Rules Box */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#016ba5] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg sm:text-xl font-heading font-black mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t('safety.kids_rules_title') || 'The 4 Golden Rules of Digital Heroes'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('safety.kids_rule_1')}</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('safety.kids_rule_2')}</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('safety.kids_rule_3')}</span>
                </div>
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t('safety.kids_rule_4')}</span>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ======================================================== */}
        {/* STANDARD 2: CHILD SAFETY PLEDGE                          */}
        {/* ======================================================== */}
        {activeTab === 'safety-pledge' && (
          <article className="space-y-8 animate-fadeIn">
            {/* Pledge Header */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/15 p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success" size="sm">
                  {t('safety.pledge_badge') || 'Institutional Pledge'}
                </Badge>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">★ 7 Core Commitments</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
                {t('safety.pledge_title') || 'Our Child Safety Pledge'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {t('safety.pledge_intro') ||
                  'AbtalQuest was founded by educators and parents who believe digital technology should enrich human childhood, not exploit it. We hold ourselves to the highest global benchmarks for physical and digital child safety.'}
              </p>
            </div>

            {/* 7 Core Commitments List */}
            <div className="space-y-4">
              {[
                { title: t('safety.pledge_item1_title'), desc: t('safety.pledge_item1_desc'), icon: <Lock className="w-5 h-5 text-blue-500" /> },
                { title: t('safety.pledge_item2_title'), desc: t('safety.pledge_item2_desc'), icon: <Award className="w-5 h-5 text-emerald-500" /> },
                { title: t('safety.pledge_item3_title'), desc: t('safety.pledge_item3_desc'), icon: <Users className="w-5 h-5 text-purple-500" /> },
                { title: t('safety.pledge_item4_title'), desc: t('safety.pledge_item4_desc'), icon: <HeartHandshake className="w-5 h-5 text-rose-500" /> },
                { title: t('safety.pledge_item5_title'), desc: t('safety.pledge_item5_desc'), icon: <Sparkles className="w-5 h-5 text-amber-500" /> },
                { title: t('safety.pledge_item6_title'), desc: t('safety.pledge_item6_desc'), icon: <EyeOff className="w-5 h-5 text-sky-500" /> },
                { title: t('safety.pledge_item7_title'), desc: t('safety.pledge_item7_desc'), icon: <ShieldCheck className="w-5 h-5 text-teal-500" /> },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}

        {/* ======================================================== */}
        {/* STANDARD 3: AD-FREE STANDARD                             */}
        {/* ======================================================== */}
        {activeTab === 'ad-free' && (
          <article className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/15 p-6 sm:p-8 rounded-3xl border border-amber-200 dark:border-amber-900/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="warning" size="sm">
                  {t('safety.adfree_badge') || 'Distraction-Free Sanctuary'}
                </Badge>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">★ 100% Commercial-Free</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
                {t('safety.adfree_title') || 'The 100% Ad-Free Standard'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {t('safety.adfree_intro') ||
                  'Commercial advertising in children\'s digital spaces leads to commercialized identity, fragmented attention spans, and invasive behavioral surveillance. We operate with a total ban on all third-party advertising.'}
              </p>
            </div>

            {/* 4 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: t('safety.adfree_point1_title'), desc: t('safety.adfree_point1_desc'), icon: <EyeOff className="w-6 h-6 text-rose-500" /> },
                { title: t('safety.adfree_point2_title'), desc: t('safety.adfree_point2_desc'), icon: <Lock className="w-6 h-6 text-blue-500" /> },
                { title: t('safety.adfree_point3_title'), desc: t('safety.adfree_point3_desc'), icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> },
                { title: t('safety.adfree_point4_title'), desc: t('safety.adfree_point4_desc'), icon: <ShoppingBag className="w-6 h-6 text-amber-500" /> },
              ].map((p, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mb-4">
                    {p.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* What you will NEVER see box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Our Uncompromising Guarantee: Zero Commercial Exploitation</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> No banner ads or popup promotions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> No video commercial interruptions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> No loot boxes or chance-based mechanics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-rose-400 font-bold">✕</span> No selling of behavioral browsing data
                </li>
              </ul>
            </div>
          </article>
        )}

        {/* ======================================================== */}
        {/* STANDARD 4: COPPA COMPLIANCE                             */}
        {/* ======================================================== */}
        {activeTab === 'coppa' && (
          <article className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-500/15 p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-blue-900/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="primary" size="sm">
                  {t('safety.coppa_badge') || 'Legal & Regulatory Standards'}
                </Badge>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">★ 16 C.F.R. Part 312 & CNDP Law 09-08</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
                {t('safety.coppa_title') || 'COPPA & Regulatory Compliance'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {t('safety.coppa_intro') ||
                  'AbtalQuest operates in full compliance with United States Federal Trade Commission (FTC) COPPA regulations (15 U.S.C. §§ 6501–6506; 16 C.F.R. Part 312), the Kingdom of Morocco Law No. 09-08 (Dahir 1-09-15), and the European Union General Data Protection Regulation for Children (GDPR-K, Art. 8).'}
              </p>
            </div>

            {/* Legal Sections */}
            <div className="space-y-5">
              {[
                { title: t('safety.coppa_sec1_title'), desc: t('safety.coppa_sec1_desc') },
                { title: t('safety.coppa_sec2_title'), desc: t('safety.coppa_sec2_desc') },
                { title: t('safety.coppa_sec3_title'), desc: t('safety.coppa_sec3_desc') },
                { title: t('safety.coppa_sec4_title'), desc: t('safety.coppa_sec4_desc') },
                { title: t('safety.coppa_sec5_title'), desc: t('safety.coppa_sec5_desc') },
              ].map((sec, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                >
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {sec.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* DPO Contact Card */}
            <div className="bg-[#0A2540] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold mb-1">
                  Have a Data Subject Request or Regulatory Question?
                </h3>
                <p className="text-xs sm:text-sm text-blue-200">
                  Our Data Protection Officer handles inquiries, consent updates, and complete data purge requests.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenContact}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Mail className="w-4 h-4 text-[#016ba5]" />
                <span>{t('safety.dpo_contact_btn') || 'Contact Privacy Team'}</span>
              </button>
            </div>
          </article>
        )}

        {/* ======================================================== */}
        {/* STANDARD 5: PARENTAL OVERSIGHT TOOLS                     */}
        {/* ======================================================== */}
        {activeTab === 'parent-oversight' && (
          <article className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent dark:from-purple-500/15 p-6 sm:p-8 rounded-3xl border border-purple-200 dark:border-purple-900/60 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" size="sm">
                  {t('safety.parent_badge') || 'Parent Control Suite'}
                </Badge>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">★ Family Transparency</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
                {t('safety.parent_title') || 'Parental Oversight & Safety Tools'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {t('safety.parent_intro') ||
                  'You are the captain of your child\'s educational voyage. AbtalQuest provides easy-to-use supervisory controls to ensure screen time stays balanced and real-world growth remains paramount.'}
              </p>
            </div>

            {/* 5 Tools Cards */}
            <div className="space-y-4">
              {[
                { title: t('safety.parent_tool1_title'), desc: t('safety.parent_tool1_desc'), icon: <KeyRound className="w-5 h-5 text-amber-500" /> },
                { title: t('safety.parent_tool2_title'), desc: t('safety.parent_tool2_desc'), icon: <ShieldCheck className="w-5 h-5 text-emerald-500" /> },
                { title: t('safety.parent_tool3_title'), desc: t('safety.parent_tool3_desc'), icon: <Award className="w-5 h-5 text-purple-500" /> },
                { title: t('safety.parent_tool4_title'), desc: t('safety.parent_tool4_desc'), icon: <Lock className="w-5 h-5 text-rose-500" /> },
                { title: t('safety.parent_tool5_title'), desc: t('safety.parent_tool5_desc'), icon: <Clock className="w-5 h-5 text-blue-500" /> },
              ].map((tool, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
                >
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 shrink-0">
                    {tool.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                      {tool.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}

      </main>

    </div>
  );
};

export default SafetyStandardsView;
