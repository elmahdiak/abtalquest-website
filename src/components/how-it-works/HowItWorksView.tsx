import React from 'react';
import { 
  Compass, 
  Map, 
  Footprints, 
  Network, 
  Sprout, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Heart, 
  Wrench, 
  Brain, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag,
  PackageCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import CtaBannerSection from '../home/CtaBannerSection';
import PartnersEcosystemSection from '../common/PartnersEcosystemSection';

export interface HowItWorksViewProps {
  onBackToHome: () => void;
  onExploreMarketplace?: () => void;
  onOpenContact?: () => void;
  onOpenWaitlist?: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onBackToHome,
  onExploreMarketplace,
  onOpenWaitlist,
}) => {
  const { t, language } = useLanguage();

  const steps = [
    {
      id: 'step-01',
      number: '01',
      stepIndex: 1,
      title: t('how_it_works.step1_title'),
      desc: t('how_it_works.step1_desc'),
      icon: <Compass className="w-6 h-6" />,
      accentColor: '#016ba5',
      accentBg: 'bg-sky-500/10 text-[#016ba5] dark:text-[#38bdf8] border-sky-300/60 dark:border-sky-800/60',
      tag: language === 'ar' ? 'البداية والاستكشاف' : language === 'fr' ? 'Éveil & Curiosité' : 'Spark & Curiosity',
    },
    {
      id: 'step-02',
      number: '02',
      stepIndex: 2,
      title: t('how_it_works.step2_title'),
      desc: t('how_it_works.step2_desc'),
      icon: <Map className="w-6 h-6" />,
      accentColor: '#fa8221',
      accentBg: 'bg-orange-500/10 text-[#fa8221] dark:text-[#ff983d] border-orange-300/60 dark:border-orange-800/60',
      tag: language === 'ar' ? 'مهام موجهة' : language === 'fr' ? 'Défis Adaptés' : 'Guided Quests',
    },
    {
      id: 'step-03',
      number: '03',
      stepIndex: 3,
      title: t('how_it_works.step3_title'),
      desc: t('how_it_works.step3_desc'),
      icon: <Footprints className="w-6 h-6" />,
      accentColor: '#10B981',
      accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300/60 dark:border-emerald-800/60',
      tag: language === 'ar' ? 'تطبيق في الواقع' : language === 'fr' ? 'Action Réelle' : 'Offline Action',
    },
    {
      id: 'step-04',
      number: '04',
      stepIndex: 4,
      title: t('how_it_works.step4_title'),
      desc: t('how_it_works.step4_desc'),
      icon: <Network className="w-6 h-6" />,
      accentColor: '#7C3AED',
      accentBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-300/60 dark:border-purple-800/60',
      tag: language === 'ar' ? 'روابط أسرية' : language === 'fr' ? 'Partage en Famille' : 'Family Connection',
    },
    {
      id: 'step-05',
      number: '05',
      stepIndex: 5,
      title: t('how_it_works.step5_title'),
      desc: t('how_it_works.step5_desc'),
      icon: <Sprout className="w-6 h-6" />,
      accentColor: '#0284c7',
      accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-300/60 dark:border-cyan-800/60',
      tag: language === 'ar' ? 'بناء الشخصية' : language === 'fr' ? 'Épanouissement' : 'Character Mastery',
    },
    {
      id: 'step-06',
      number: '06',
      stepIndex: 6,
      title: t('how_it_works.step6_title'),
      desc: t('how_it_works.step6_desc'),
      icon: <RefreshCw className="w-6 h-6" />,
      accentColor: '#EC4899',
      accentBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-300/60 dark:border-pink-800/60',
      tag: language === 'ar' ? 'آفاق متجددة' : language === 'fr' ? 'Monde Évolutif' : 'Endless Expansion',
    },
  ];

  const loopPillars = [
    {
      icon: <PackageCheck className="w-6 h-6 text-[#fa8221]" />,
      badge: language === 'ar' ? 'أدوات ملموسة' : language === 'fr' ? 'Kits Physiques' : 'Physical Assembly',
      title: language === 'ar' ? '1. التجربة اليدوية والحقائب الواقعية' : language === 'fr' ? '1. Assemblage & Kits Réels' : '1. Tangible Hands-On Assembly',
      desc: language === 'ar'
        ? 'نماذج ميكانيكية من الخشب الطبيعي، وبوصلات معدنية صلبة، ودفاتر ورقية فاخرة. يلمس الطفل المكونات ويبني آليات حقيقية بيديه بعيداً عن الشاشة.'
        : language === 'fr'
        ? 'Engrenages mécaniques en bois de bouleau, boussoles en laiton et chroniques reliées. Les enfants manipulent, construisent et créent de vrais objets de leurs mains.'
        : 'Laser-cut birchwood gearboxes, solid brass trail compasses, and hardbound chronicles. Children touch, assemble, and build real mechanisms with their hands.',
      borderColor: 'border-[#fa8221]',
      bgAccent: 'bg-[#fa8221]/10',
    },
    {
      icon: <Footprints className="w-6 h-6 text-[#016ba5]" />,
      badge: language === 'ar' ? 'تحديات حقيقية' : language === 'fr' ? 'Missions Concrètes' : 'Real-World Quests',
      title: language === 'ar' ? '2. مهمات عملية في العالم الواقعي' : language === 'fr' ? '2. Missions Hors-Écran' : '2. Real-World Offline Challenges',
      desc: language === 'ar'
        ? 'تتحول فصول القصة إلى مهمات عملية حقيقية في البيت والحديقة والطبيعة: تدريب على الصبر، وتدوين الملاحظات، ومساعدة الأسرة، وحل المشكلات.'
        : language === 'fr'
        ? 'Les récits s\'incarnent en défis concrets à la maison et dans la nature : navigation, actes de bienveillance, observation active et résolution d\'énigmes en famille.'
        : 'Stories translate into tangible offline adventures: backyard navigation, acts of kindness, mindful reflection, and family problem-solving.',
      borderColor: 'border-[#016ba5]',
      bgAccent: 'bg-[#016ba5]/10',
    },
    {
      icon: <Heart className="w-6 h-6 text-[#7C3AED]" />,
      badge: language === 'ar' ? 'نمو أسري مشترك' : language === 'fr' ? 'Connexion Parentale' : 'Parental Co-Growth',
      title: language === 'ar' ? '3. رفيق الوالدين والنمو المشترك' : language === 'fr' ? '3. Compagnon Parental Bienveillant' : '3. Mindful Parental Companion',
      desc: language === 'ar'
        ? 'تطبيق الوالدين يقدم إرشادات نمائية دقيقة ومحاور للحوار الأسري وإشارات لمكامن الإبداع، بدون إعلانات ولا ميكانيزمات استنزاف للوقت.'
        : language === 'fr'
        ? 'L\'application parentale offre des repères de développement clairs, des pistes de discussion et célèbre les étapes clés. Zéro publicité, zéro algorithme addictif.'
        : 'Parents receive gentle developmental insights, conversational prompts, and shared milestone badges. Zero addictive algorithmic traps, 100% mutual trust.',
      borderColor: 'border-[#7C3AED]',
      bgAccent: 'bg-[#7C3AED]/10',
    },
  ];

  const comparisonRows = [
    {
      topic: language === 'ar' ? 'الهدف الأساسي' : language === 'fr' ? 'Objectif Principal' : 'Primary Objective',
      traditional: language === 'ar' ? 'استبقاء الطفل أطول فترة على الشاشة لزيادة الأرباح' : language === 'fr' ? 'Maximiser le temps d\'écran pour le profit publicitaire' : 'Maximize screen-time and in-app retention',
      abtal: language === 'ar' ? 'توجيه الطفل نحو الفعل الإيجابي والبناء في العالم الحقيقي' : language === 'fr' ? 'Inspirer l\'action réelle et le développement du caractère' : 'Bridge screen engagement into real-world action and character',
    },
    {
      topic: language === 'ar' ? 'طبيعة التفاعل' : language === 'fr' ? 'Nature de l\'Expérience' : 'Nature of Play',
      traditional: language === 'ar' ? 'تمرير لا نهائي ونقرات سريعة مستهلكة للتركيز' : language === 'fr' ? 'Défilement passif et boucles dopaminergiques' : 'Passive scrolling and endless algorithmic dopamine loops',
      abtal: language === 'ar' ? 'حقائب مادية تجمع بين اللمس، والبناء، والتفكير، والتواصل' : language === 'fr' ? 'Objets physiques, construction manuelle et réflexion guidée' : 'Physical craft kits, manual assembly, storybooks and real quests',
    },
    {
      topic: language === 'ar' ? 'الأمان والإعلانات' : language === 'fr' ? 'Sécurité & Écrans' : 'Safety & Ads',
      traditional: language === 'ar' ? 'إعلانات مضللة، ومشتريات مصغرة، وتتبع للبيانات' : language === 'fr' ? 'Publicités intrusives, micro-achats et traçage' : 'Intrusive ads, microtransactions, and dark patterns',
      abtal: language === 'ar' ? 'خالٍ من الإعلانات 100%، بدون مشتريات خفية، معتمد لمعايير COPPA' : language === 'fr' ? '100% sans publicité, certifié COPPA/RGPD-K et zéro achat caché' : '100% Ad-Free, zero in-app purchases, certified COPPA/GDPR-K safe',
    },
    {
      topic: language === 'ar' ? 'دور الأسرة' : language === 'fr' ? 'Rôle des Parents' : 'Parental Role',
      traditional: language === 'ar' ? 'عزلة للطفل وصعوبة في متابعة ما يشاهده' : language === 'fr' ? 'Isolement de l\'enfant et surveillance difficile' : 'Isolated play with little visibility into learning outcomes',
      abtal: language === 'ar' ? 'شراكة واعية، وأنشطة عائلية مشتركة، ومتابعة هادفة' : language === 'fr' ? 'Co-croissance, temps d\'échange et soutien éducatif clair' : 'Co-growth with mindful parent companion tools and shared memories',
    },
  ];

  const planets = [
    {
      name: language === 'ar' ? 'كوكب المفكرين' : language === 'fr' ? 'La Planète des Penseurs' : "Thinkers' Planet",
      icon: <Brain className="w-5 h-5 text-[#016ba5]" />,
      domain: language === 'ar' ? 'الهندسة والتفكير الميكانيكي' : language === 'fr' ? 'Ingénierie & STEM' : 'Mechanical & STEM Engineering',
      desc: language === 'ar' ? 'تروس خشبية، ونسب الحركة، والتفكير المنطقي العملي.' : language === 'fr' ? 'Engrenages en bois, rapports de transmission et logique spatiale.' : 'Birchwood mechanical gear ratios, unplugged logic, and spatial problem solving.',
      accent: 'border-[#016ba5] bg-sky-50 dark:bg-sky-950/40 text-[#016ba5]',
    },
    {
      name: language === 'ar' ? 'كوكب الشجعان' : language === 'fr' ? 'La Planète des Courageux' : 'Brave Planet',
      icon: <Compass className="w-5 h-5 text-[#fa8221]" />,
      domain: language === 'ar' ? 'الشجاعة واليقظة والاستكشاف' : language === 'fr' ? 'Orientation & Courage' : 'Navigation & Mindfulness',
      desc: language === 'ar' ? 'بوصلة معدنية حقيقية، وتوجيه المسار، والمرونة النفسية.' : language === 'fr' ? 'Boussole en laiton, orientation de terrain et résilience émotionnelle.' : 'Solid brass trail navigation, outdoor resilience, and calming mindfulness.',
      accent: 'border-[#fa8221] bg-orange-50 dark:bg-orange-950/40 text-[#fa8221]',
    },
    {
      name: language === 'ar' ? 'كوكب الحلّالين' : language === 'fr' ? 'La Planète des Solutions' : "Solvers' Planet",
      icon: <Wrench className="w-5 h-5 text-[#0284c7]" />,
      domain: language === 'ar' ? 'الخوارزميات وحل المشكلات' : language === 'fr' ? 'Robotique & Algorithmes' : 'Hydraulics & Algorithmic Logic',
      desc: language === 'ar' ? 'آليات هيدروليكية، والتحكم بالحركة، والتفكير الإبداعي.' : language === 'fr' ? 'Mécanismes hydrauliques, raisonnement algorithmique et défis pratiques.' : 'Hydraulic arms, unplugged logic patterns, and creative invention.',
      accent: 'border-[#0284c7] bg-cyan-50 dark:bg-cyan-950/40 text-[#0284c7]',
    },
    {
      name: language === 'ar' ? 'كوكب القلوب' : language === 'fr' ? 'La Planète des Cœurs' : 'Heart Planet',
      icon: <Heart className="w-5 h-5 text-[#7C3AED]" />,
      domain: language === 'ar' ? 'الذكاء العاطفي والتعاون' : language === 'fr' ? 'Empathie & Bienveillance' : 'Empathy & Social-Emotional Learning',
      desc: language === 'ar' ? 'ألعاب تعاونية عائلية، وبطاقات الامتنان، والذكاء الوجداني.' : language === 'fr' ? 'Jeux coopératifs, carnets de gratitude et bienveillance partagée.' : 'Cooperative family games, gratitude filigree, and active kindness quests.',
      accent: 'border-[#7C3AED] bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED]',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#071727] text-slate-800 dark:text-slate-100 font-body selection:bg-[#fa8221]/20 selection:text-[#fa8221]">
      
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF5FB] via-[#F4F9FD] to-white dark:from-[#06152B] dark:via-[#091E3A] dark:to-[#071727] pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-100 dark:border-slate-800">
        {/* Ambient lighting */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#016ba5]/15 dark:bg-[#016ba5]/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-12 right-1/4 w-96 h-96 bg-[#fa8221]/15 dark:bg-[#fa8221]/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          
          {/* Breadcrumb Back Button */}
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-headline font-bold text-[#016ba5] dark:text-[#38bdf8] hover:underline mb-6 cursor-pointer bg-white/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t('about_page.breadcrumb_home') || 'Back to Home'}</span>
          </button>

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/70 border border-sky-200/80 dark:border-sky-800/80 shadow-2xs text-[11px] sm:text-xs font-headline font-black text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#016ba5] dark:text-[#38bdf8] shrink-0" />
            <span>{t('how_it_works.eyebrow')}</span>
          </div>

          {/* Headline */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-5">
            {t('how_it_works.title')}
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg md:text-xl text-[#475569] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal mb-8">
            {t('how_it_works.subtitle')}
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {onOpenWaitlist && (
              <button
                type="button"
                onClick={onOpenWaitlist}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] active:bg-[#cf630b] text-white font-headline font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>{language === 'ar' ? 'انضم لقائمة الوصول المبكر' : language === 'fr' ? 'Rejoindre l\'Accès Anticipé' : 'Join Early Access Waitlist'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}

            {onExploreMarketplace && (
              <button
                type="button"
                onClick={onExploreMarketplace}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 font-headline font-bold text-sm tracking-wide shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#fa8221]" />
                <span>{language === 'ar' ? 'استكشف الحقائب التعليمية' : language === 'fr' ? 'Explorer les Kits Physiques' : 'Explore Physical Kits'}</span>
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 2. THE TANGIBLE LEARNING LOOP (3 PILLARS) */}
      <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-[#071727]/60 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="font-headline text-xs sm:text-sm font-bold text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-wider block mb-2">
              {language === 'ar' ? 'منهجية العمل' : language === 'fr' ? 'La Méthodologie' : 'The Closed Loop System'}
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4">
              {language === 'ar' ? 'حلقة التعلم الواقعية المغلقة' : language === 'fr' ? 'La Boucle d\'Apprentissage Tangible' : 'The Tangible Learning Loop'}
            </h2>
            <p className="font-body text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'ar'
                ? 'على عكس التطبيقات الرقمية التقليدية التي تعزل الطفل، يعيد أبطال كويست توجيه كل خطوة رقمية نحو ابتكار يدوي وتواصل أسري حقيقي.'
                : language === 'fr'
                ? 'Contrairement aux applications passives qui isolent, AbtalQuest est conçu autour d\'une boucle vertueuse qui ramène constamment l\'enfant vers le monde réel.'
                : 'Unlike passive apps that keep children trapped in endless screen feeds, AbtalQuest is engineered around a 3-stage loop that continuously guides children back to the physical world.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {loopPillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0c2238] rounded-3xl p-7 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left rtl:text-right group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", pillar.bgAccent)}>
                      {pillar.icon}
                    </div>
                    <span className="text-[11px] font-headline font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl font-black text-[#0F2A4A] dark:text-white mb-3 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. THE 6-STEP CONTINUOUS JOURNEY DETAIL */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-headline text-xs sm:text-sm font-bold text-[#fa8221] uppercase tracking-wider block mb-2">
              {language === 'ar' ? 'الرحلة خطوة بخطوة' : language === 'fr' ? 'Le Parcours en 6 Étapes' : 'Step-By-Step Framework'}
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4">
              {language === 'ar' ? 'مراحل رحلة البطل الصغير' : language === 'fr' ? 'De la Curiosité à l\'Épanouissement' : 'From First Curiosity to Lifelong Mastery'}
            </h2>
            <p className="font-body text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'ar'
                ? 'كل مرحلة تصنع توازناً مدروساً بين الشغف، والبناء الحركي، وتنمية العادات الحميدة والقيم الإنسانية.'
                : language === 'fr'
                ? 'Chaque étape tisse un équilibre sain entre découverte ludique, création physique et ancrage de valeurs durables.'
                : 'Every phase creates a thoughtful bridge between imaginative play, hands-on physical building, and meaningful habit formation.'}
            </p>
          </div>
        </div>

        {/* 6-Step Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="group/card relative flex flex-col justify-between bg-white dark:bg-[#0c2238] p-7 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left rtl:text-right"
              >
                {/* Colored top border accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                  style={{ backgroundColor: step.accentColor }}
                />

                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-headline font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/70 border border-orange-200/80 dark:border-orange-800/80 text-[#fa8221] dark:text-[#ff983d]">
                      <span>{t('how_it_works.step_label') || 'Step'}</span>
                      <span>{step.number}</span>
                    </span>

                    <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover/card:scale-110", step.accentBg)}>
                      {step.icon}
                    </div>
                  </div>

                  <span className="text-xs font-headline font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    {step.tag}
                  </span>

                  <h3 className="font-headline text-xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2 group-hover/card:text-[#016ba5] dark:group-hover/card:text-[#38bdf8] transition-colors">
                    {step.title}
                  </h3>

                  <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="font-mono">{step.number} {t('how_it_works.step_of') || 'of 6'}</span>
                  <span className="text-[#016ba5] dark:text-[#38bdf8] font-headline font-bold text-xs uppercase tracking-wider">
                    AbtalQuest
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* 4. THE 4 PLANETARY REALMS */}
      <section className="py-16 sm:py-24 bg-slate-50/60 dark:bg-[#071727]/60 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="font-headline text-xs sm:text-sm font-bold text-[#016ba5] dark:text-[#38bdf8] uppercase tracking-wider block mb-2">
              {language === 'ar' ? 'العوالم الأربعة' : language === 'fr' ? 'Les 4 Mondes Planétaires' : 'Planetary Realms'}
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4">
              {language === 'ar' ? 'عوالم تعليمية متكاملة' : language === 'fr' ? '4 Domaines de Développement' : '4 Domains of Whole-Child Growth'}
            </h2>
            <p className="font-body text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'ar'
                ? 'يركز كل كوكب على بعد نمائي أساسي من خلال حكايات وقصص مشوقة، وحقائب فيزيائية، ومهمات واقعية هادفة.'
                : language === 'fr'
                ? 'Chaque planète explore une dimension clé de l\'épanouissement de l\'enfant avec des kits dédiés et des défis adaptés.'
                : 'Each planetary world targets an essential developmental domain, blending storytelling, certified craft kits, and real-world quests.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {planets.map((planet, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0c2238] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between text-left rtl:text-right hover:-translate-y-1 transition-all duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-100 dark:bg-slate-800">
                    {planet.icon}
                  </div>
                  <h3 className="font-headline text-lg font-bold text-[#0F2A4A] dark:text-white mb-1">
                    {planet.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#016ba5] dark:text-[#38bdf8] block mb-2">
                    {planet.domain}
                  </span>
                  <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {planet.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SIDE-BY-SIDE COMPARISON: TYPICAL SCREEN TIME VS. ABTALQUEST */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#071727] border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="font-headline text-xs sm:text-sm font-bold text-[#fa8221] uppercase tracking-wider block mb-2">
              {language === 'ar' ? 'المقارنة والفارق' : language === 'fr' ? 'La Différence AbtalQuest' : 'The Difference'}
            </span>
            <h2 className="font-headline text-2xl sm:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4">
              {language === 'ar' ? 'لماذا يختلف أبطال كويست جذرياً؟' : language === 'fr' ? 'Pourquoi AbtalQuest est Différent' : 'Why AbtalQuest Is Truly Different'}
            </h2>
            <p className="font-body text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {language === 'ar'
                ? 'مقارنة شفافة توضح كيف يعيد أبطال كويست المعنى للوقت الرقمي دون استهلاك لانتباه الطفل أو عزله عن واقعه.'
                : language === 'fr'
                ? 'Une approche qui refuse la rentabilisation de l\'attention et place le bien-être de l\'enfant au cœur de chaque interaction.'
                : 'A transparent comparison showing how we transform passive consumption into purposeful offline action and joyful growth.'}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-[#0c2238]">
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-headline font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 p-4 sm:p-5">
              <div className="md:col-span-3 text-left rtl:text-right">{language === 'ar' ? 'المعيار' : language === 'fr' ? 'Critère' : 'Dimension'}</div>
              <div className="md:col-span-4 text-left rtl:text-right text-rose-500 font-bold">{language === 'ar' ? 'التطبيقات الرقمية المعتادة' : language === 'fr' ? 'Applications Classiques' : 'Standard Digital Apps'}</div>
              <div className="md:col-span-5 text-left rtl:text-right text-[#016ba5] dark:text-[#38bdf8] font-bold">{language === 'ar' ? 'منظومة أبطال كويست' : language === 'fr' ? 'L\'Écosystème AbtalQuest' : 'The AbtalQuest Ecosystem'}</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 items-start gap-3 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                  <div className="md:col-span-3 font-headline font-bold text-sm text-[#0F2A4A] dark:text-white text-left rtl:text-right">
                    {row.topic}
                  </div>
                  <div className="md:col-span-4 flex items-start gap-2.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-left rtl:text-right">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{row.traditional}</span>
                  </div>
                  <div className="md:col-span-5 flex items-start gap-2.5 text-xs sm:text-sm text-[#0F2A4A] dark:text-slate-100 font-semibold text-left rtl:text-right bg-sky-50/40 dark:bg-sky-950/20 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{row.abtal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. PARTNERS, BACKERS & ECOSYSTEM */}
      <PartnersEcosystemSection id="partners-ecosystem" />

      {/* 7. BOTTOM STARFIELD CTA BANNER */}
      <CtaBannerSection onDownloadClick={onOpenWaitlist} />

    </div>
  );
};

export default HowItWorksView;
