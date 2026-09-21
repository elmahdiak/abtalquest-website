import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Heart, 
  Telescope, 
  Target, 
  Award, 
  Trophy, 
  Crown, 
  GraduationCap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShoppingBag, 
  Building2, 
  Rocket,
  Brain,
  Smile,
  Hammer
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import {
  ExplorerLogo,
  Ibda3LabLogo,
  InjazLogo,
  CriFesMeknesLogo,
  NexayaLogo,
  EnvestorsLogo,
  MyGenerousPlanetLogo,
  StartupUniverseLogo,
  AlAkhawaynLogo,
  UemfLogo,
  Morocco300Logo
} from '../home/CredibilityLogos';

export interface AboutUsViewProps {
  onBackToHome: () => void;
  onExploreMarketplace: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({
  onBackToHome,
  onExploreMarketplace,
}) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#071727] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* ========================================================
            1. HERO & CORE CREED SECTION
           ======================================================== */}
        <section className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#016ba5]/10 via-white to-amber-50/60 dark:from-[#0A2540] dark:via-[#0c2238] dark:to-[#17233E] border border-[#016ba5]/20 dark:border-[#016ba5]/30 shadow-xl overflow-hidden text-center">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#016ba5]/15 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Top navigation breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-[#016ba5] dark:text-[#38BDF8] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl-flip" />
              <span>{t('about.cta_back_home')}</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
              {t('about.badge')}
            </Badge>
          </div>

          {/* Main Title */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            {t('about.title')}
          </h1>

          {/* Core Creed Badge Highlight */}
          <div className="inline-block px-5 py-3 rounded-2xl bg-[#fa8221]/15 dark:bg-[#fa8221]/20 border border-[#fa8221]/30 max-w-3xl mx-auto mb-6 shadow-xs">
            <p className="font-headline text-lg sm:text-2xl font-black text-[#e87313] dark:text-[#fb923c] leading-snug">
              “{t('about.creed_quote')}”
            </p>
            <span className="font-body text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
              — {t('about.creed_author')}
            </span>
          </div>

          {/* Subtitle Statement */}
          <p className="font-body text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
            {t('about.hero_statement')}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="cta"
              size="lg"
              icon={<Compass className="w-5 h-5" />}
              iconPosition="left"
              onClick={onBackToHome}
              className="shadow-cta hover:shadow-cta-hover bg-[#016ba5] hover:bg-[#015684] text-white"
            >
              {t('about.cta_adventure')}
            </Button>
            <Button
              variant="outline"
              size="lg"
              icon={<ShoppingBag className="w-5 h-5 text-[#fa8221]" />}
              iconPosition="left"
              onClick={onExploreMarketplace}
            >
              {t('about.cta_marketplace')}
            </Button>
          </div>
        </section>

        {/* ========================================================
            2. FOUNDING NARRATIVE
           ======================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="warning" size="md" icon={<Heart className="w-4 h-4 text-[#fa8221]" />}>
              {t('about.founding_badge')}
            </Badge>

            <h2 className="font-headline text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('about.founding_title')}
            </h2>

            <div className="space-y-4 font-body text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white bg-[#016ba5]/10 dark:bg-[#016ba5]/20 p-4 rounded-2xl border-l-4 border-[#016ba5]">
                {t('about.founding_p1')}
              </p>
              <p>
                {t('about.founding_p2')}
              </p>
              <p>
                {t('about.founding_p3')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-[#0F2F4E] dark:to-[#0A2540] p-8 border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#016ba5] to-[#fa8221] text-white flex items-center justify-center shadow-md mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-headline text-xl font-black text-slate-900 dark:text-white mb-2">
                A Haven for Growing Minds
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Every quest, story, and wooden physical kit is meticulously crafted to nurture character virtues without manipulative addiction loops.
              </p>

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-700 pt-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">Zero Commercial Advertising</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">No Violence or Exploitative Friction</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">Physical-Digital Mindful Balance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. VISION & MISSION DUAL CARDS
           ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#016ba5]/10 via-white to-slate-50 dark:from-[#016ba5]/20 dark:via-[#0c2238] dark:to-[#0A2540] border-2 border-[#016ba5]/25 dark:border-[#016ba5]/40 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 dark:bg-[#016ba5]/30 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center">
                  <Telescope className="w-6 h-6" />
                </div>
                <Badge variant="primary" size="sm">
                  {t('about.vision_badge')}
                </Badge>
              </div>

              <h3 className="font-headline text-2xl font-black text-slate-900 dark:text-white mb-4">
                {t('about.vision_title')}
              </h3>

              <blockquote className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-[#016ba5]/20 dark:border-[#016ba5]/40 shadow-xs mb-6">
                <p className="font-headline text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  “{t('about.vision_desc')}”
                </p>
              </blockquote>
            </div>

            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Transforming passive screen consumption into an inspiring sanctuary of wisdom, empathy, and moral growth.
            </p>
          </div>

          {/* Mission Card */}
          <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#fa8221]/10 via-white to-slate-50 dark:from-[#fa8221]/20 dark:via-[#0c2238] dark:to-[#0A2540] border-2 border-[#fa8221]/25 dark:border-[#fa8221]/40 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#fa8221]/10 dark:bg-[#fa8221]/30 text-[#fa8221] dark:text-[#fb923c] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <Badge variant="secondary" size="sm">
                  {t('about.mission_badge')}
                </Badge>
              </div>

              <h3 className="font-headline text-2xl font-black text-slate-900 dark:text-white mb-4">
                {t('about.mission_title')}
              </h3>

              <blockquote className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-[#fa8221]/20 dark:border-[#fa8221]/40 shadow-xs mb-6">
                <p className="font-headline text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  “{t('about.mission_desc')}”
                </p>
              </blockquote>
            </div>

            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Equipping families and educators with meaningful story quests and physical kits that turn moral virtues into everyday superpowers.
            </p>
          </div>
        </section>

        {/* ========================================================
            4. 100% AD-FREE STANDARD BANNER
           ======================================================== */}
        <section className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-[#016ba5]/10 dark:from-emerald-950/40 dark:via-[#0c2238] dark:to-[#0A2540] border border-emerald-500/30 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <Badge variant="success" size="sm" className="mb-1">
                  {t('about.adfree_banner_title')}
                </Badge>
                <h3 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t('about.adfree_banner_desc')}
                </h3>
                <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  We strictly reject surveillance advertising, third-party cookies, tracking pixels, and behavioral algorithms targeting minors.
                </p>
              </div>
            </div>

            <a
              href="#ad-free-standard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs sm:text-sm font-bold shadow-sm transition-all whitespace-nowrap"
            >
              <span>View Ad-Free Charter</span>
              <ArrowRight className="w-4 h-4 rtl-flip" />
            </a>
          </div>
        </section>

        {/* ========================================================
            5. THE 4 PLANETARY CHARACTER REALMS
           ======================================================== */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="gamification" size="md" icon={<Sparkles className="w-4 h-4" />}>
              {t('about.pillars_badge')}
            </Badge>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              {t('about.pillars_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Thinkers */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0c2238] border border-blue-200 dark:border-blue-900/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t('about.pillar_thinkers')}
              </h3>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-3">
                {t('about.pillar_thinkers_sub')}
              </span>
              <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.pillar_thinkers_desc')}
              </p>
            </div>

            {/* Brave */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0c2238] border border-amber-200 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t('about.pillar_brave')}
              </h3>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 block mb-3">
                {t('about.pillar_brave_sub')}
              </span>
              <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.pillar_brave_desc')}
              </p>
            </div>

            {/* Solvers */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0c2238] border border-emerald-200 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t('about.pillar_solvers')}
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-3">
                {t('about.pillar_solvers_sub')}
              </span>
              <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.pillar_solvers_desc')}
              </p>
            </div>

            {/* Heart */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#0c2238] border border-rose-200 dark:border-rose-900/50 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-lg font-bold text-slate-900 dark:text-white mb-1">
                {t('about.pillar_heart')}
              </h3>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block mb-3">
                {t('about.pillar_heart_sub')}
              </span>
              <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('about.pillar_heart_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            6. INSTITUTIONAL HIERARCHY & RECOGNITION
           ======================================================== */}
        <section className="space-y-12 rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700/80 shadow-lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="primary" size="md" icon={<Building2 className="w-4 h-4" />}>
              {t('about.hierarchy_badge')}
            </Badge>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3 mb-3">
              {t('about.hierarchy_title')}
            </h2>
            <p className="font-body text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('about.hierarchy_subtitle')}
            </p>
          </div>

          {/* Tier 1: Supported by Programs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Rocket className="w-5 h-5 text-[#016ba5]" />
              <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t('about.category_programs')}
              </h3>
              <span className="text-xs font-body text-slate-500 dark:text-slate-400 hidden sm:inline">
                — {t('about.category_programs_desc')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <ExplorerLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">EXPLORER</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Pedagogical Incubation</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <InjazLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">Injaz Al-Maghrib</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Youth Education & Skills</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <CriFesMeknesLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">CRI Fès-Meknès</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Regional Development</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Ibda3LabLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">Ibda3 Lab</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Innovation & EdTech R&D</span>
              </div>
            </div>
          </div>

          {/* Tier 2: Backed by */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Building2 className="w-5 h-5 text-[#fa8221]" />
              <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t('about.category_backers')}
              </h3>
              <span className="text-xs font-body text-slate-500 dark:text-slate-400 hidden sm:inline">
                — {t('about.category_backers_desc')}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <NexayaLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">Nexaya</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Digital Infrastructure</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <MyGenerousPlanetLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">My Generous Planet</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Social Impact & Growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <StartupUniverseLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">Startup Universe Morocco</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Ecosystem Network</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center">
                  <EnvestorsLogo className="w-10 h-10 object-contain" />
                </div>
                <span className="font-headline font-bold text-xs text-slate-900 dark:text-white">ENVESTORS</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Capital & Advisory</span>
              </div>
            </div>
          </div>

          {/* Tier 3: Recognized by */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t('about.category_recognition')}
              </h3>
              <span className="text-xs font-body text-slate-500 dark:text-slate-400 hidden sm:inline">
                — {t('about.category_recognition_desc')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Award 1 */}
              <div className="p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <AlAkhawaynLogo className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-headline text-2xl font-black text-amber-600 dark:text-amber-400 block mb-1">
                    {t('about.award_1_metric')}
                  </span>
                  <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t('about.award_1_title')}
                  </h4>
                </div>
                <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('about.award_1_desc')}
                </p>
              </div>

              {/* Award 2 */}
              <div className="p-6 rounded-3xl bg-[#016ba5]/10 dark:bg-sky-950/20 border border-[#016ba5]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#016ba5]/20 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <UemfLogo className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-headline text-2xl font-black text-[#016ba5] dark:text-[#38BDF8] block mb-1">
                    {t('about.award_2_metric')}
                  </span>
                  <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t('about.award_2_title')}
                  </h4>
                </div>
                <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('about.award_2_desc')}
                </p>
              </div>

              {/* Award 3 */}
              <div className="p-6 rounded-3xl bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Crown className="w-5 h-5" />
                    </div>
                    <Morocco300Logo className="w-8 h-8 object-contain" />
                  </div>
                  <span className="font-headline text-2xl font-black text-purple-600 dark:text-purple-400 block mb-1">
                    {t('about.award_3_metric')}
                  </span>
                  <h4 className="font-headline text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {t('about.award_3_title')}
                  </h4>
                </div>
                <p className="font-body text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('about.award_3_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            7. BOTTOM CALL TO ACTION
           ======================================================== */}
        <section className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221] text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="font-headline text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Spark Courage in Your Child?
            </h2>
            <p className="font-body text-sm sm:text-base text-white/90 leading-relaxed">
              Join thousands of conscious families across the Arab world who chose character, wisdom, and joy over passive screen addiction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button
                variant="cta"
                size="lg"
                onClick={onBackToHome}
                className="bg-white text-[#016ba5] hover:bg-slate-100 shadow-xl"
              >
                {t('about.cta_adventure')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onExploreMarketplace}
                className="border-white/40 text-white hover:bg-white/10"
              >
                {t('about.cta_marketplace')}
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUsView;
