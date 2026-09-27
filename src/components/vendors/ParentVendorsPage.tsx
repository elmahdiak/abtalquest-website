import React, { useState, useRef } from 'react';
import {
  Store,
  ShieldCheck,
  Users,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
  ArrowRight,
  Coins,
  Compass,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import {
  submitVendorApplication,
  uploadVendorSampleImage,
  VENDOR_CATEGORIES,
  type CreateVendorApplicationInput
} from '../../services/vendorService';

export interface ParentVendorsPageProps {
  onNavigate?: (view: 'home' | 'marketplace' | 'about' | 'blog' | 'parent-sellers') => void;
}

export const ParentVendorsPage: React.FC<ParentVendorsPageProps> = ({ onNavigate }) => {
  const { language, direction } = useLanguage();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('stem');
  const [targetAgeGroup, setTargetAgeGroup] = useState('4-7');
  const [productDescription, setProductDescription] = useState('');
  const [websiteOrSocial, setWebsiteOrSocial] = useState('');
  const [sampleImages, setSampleImages] = useState<string[]>([]);
  const [safetyPledge, setSafetyPledge] = useState(false);

  // Status & Validation
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Localized text dictionary for Parent Vendors
  const t = {
    badge: {
      en: 'Parent Vendor Partner Program',
      fr: 'Programme Partenaire Parents Vendeurs',
      ar: 'برنامج شراكة أولياء الأمور البائعين',
    }[language] || 'Parent Vendor Partner Program',
    heroTitle: {
      en: 'Turn Your Passion for Family & Kids Crafts into a Flourishing Business',
      fr: 'Transformez Votre Passion pour l\'Éveil Familial en une Activité Prospère',
      ar: 'حوّل شغفك بالألعاب والكتب العائلية إلى مشروع مزدهر ومؤثر',
    }[language] || 'Turn Your Passion for Family & Kids Crafts into a Flourishing Business',
    heroSubtitle: {
      en: 'AbtalQuest is the premier safe universe connecting passionate parents, artisans, and family creators directly with thousands of families seeking screen-free, certified safe educational toys, STEM kits, and moral chronicles.',
      fr: 'AbtalQuest est l\'univers de confiance qui connecte les parents artisans et créateurs familiaux à des milliers de familles en quête de jouets éducatifs sans écrans, de kits STEM et de contes moraux certifiés sûrs.',
      ar: 'أبطال كويست هو العالم الآمن الذي يربط أولياء الأمور المبتكرين والحرفيين بآلاف العائلات التي تبحث عن ألعاب تعليمية خالية من الشاشات، وحقائب هندسية، وقصص تربوية أصيلة.',
    }[language] || 'AbtalQuest is the premier safe universe connecting passionate parents and creators.',
    stat1Title: {
      en: 'Zero Upfront Fees',
      fr: 'Zéro Frais d\'Inscription',
      ar: 'صفر رسوم اشتراك مسبقة',
    }[language] || 'Zero Upfront Fees',
    stat1Desc: {
      en: 'No hidden setup or monthly listing fees. We only grow when your creations sell.',
      fr: 'Aucun frais de mise en ligne mensuel. Nous grandissons uniquement si vous vendez.',
      ar: 'لا توجد أي رسوم تسجيل أو اشتراكات شهرية. ننمو فقط بنجاح مبيعاتك.',
    }[language] || 'No hidden setup or monthly listing fees.',
    stat2Title: {
      en: '100% Child-Safe Standard',
      fr: 'Standard 100% Sûr & Conforme',
      ar: 'معيار أمان وسلامة معتمد ١٠٠٪',
    }[language] || '100% Child-Safe Standard',
    stat2Desc: {
      en: 'Every physical kit and story is vetted by educational curators for toxic-free materials.',
      fr: 'Chaque kit et conte est audité par notre équipe pédagogique pour garantir des matériaux non toxiques.',
      ar: 'تخضع جميع المنتجات لمراجعة تربوية وصحية دقيقة لضمان مواد طبيعية آمنة.',
    }[language] || 'Every kit is vetted for toxic-free materials.',
    stat3Title: {
      en: 'Direct Family Reach',
      fr: 'Accès Direct aux Familles',
      ar: 'وصول مباشر للعائلات المهتمة',
    }[language] || 'Direct Family Reach',
    stat3Desc: {
      en: 'Showcase your boutique to an engaged community of parents prioritizing growth over screens.',
      fr: 'Présentez vos créations à une communauté de parents engagés pour un temps d\'éveil sans écrans.',
      ar: 'اعرض متجرك أمام مجتمع واسع من أولياء الأمور الباحثين عن تنمية حقيقية لأطفالهم.',
    }[language] || 'Showcase to an engaged community of parents.',
    formCardTitle: {
      en: 'Apply as a Parent Seller',
      fr: 'Postuler comme Parent Vendeur',
      ar: 'طلب الانضمام كبائع من أولياء الأمور',
    }[language] || 'Apply as a Parent Seller',
    formCardDesc: {
      en: 'Fill in your creator details and attach sample photos of your items. Our curatorial committee reviews each submission in 24–48 hours.',
      fr: 'Remplissez vos coordonnées et joignez des photos de vos créations. Notre comité d\'examen traite les demandes sous 24 à 48h.',
      ar: 'يرجى ملء البيانات وإرفاق صور ونماذج من منتجاتك. تراجع لجنتنا التربوية كل طلب خلال ٢٤ إلى ٤٨ ساعة.',
    }[language] || 'Fill in your details and sample photos.',
    fullNameLabel: {
      en: 'Full Name *',
      fr: 'Nom et Prénom *',
      ar: 'الاسم الكامل *',
    }[language] || 'Full Name *',
    emailLabel: {
      en: 'Contact Email *',
      fr: 'Adresse E-mail *',
      ar: 'البريد الإلكتروني *',
    }[language] || 'Contact Email *',
    phoneLabel: {
      en: 'WhatsApp / Phone Number *',
      fr: 'Numéro WhatsApp / Téléphone *',
      ar: 'رقم الواتساب / الهاتف *',
    }[language] || 'WhatsApp / Phone Number *',
    shopNameLabel: {
      en: 'Boutique or Brand Name *',
      fr: 'Nom de la Boutique ou Marque *',
      ar: 'اسم المتجر أو العلامة التجارية *',
    }[language] || 'Boutique or Brand Name *',
    categoryLabel: {
      en: 'Primary Product Category *',
      fr: 'Catégorie Principale de Produits *',
      ar: 'التصنيف الرئيسي للمنتجات *',
    }[language] || 'Primary Product Category *',
    targetAgeLabel: {
      en: 'Target Age Group',
      fr: 'Tranche d\'Âge Ciblée',
      ar: 'الفئة العمرية المستهدفة',
    }[language] || 'Target Age Group',
    websiteLabel: {
      en: 'Portfolio, Instagram or Website Link',
      fr: 'Lien Instagram, Portfolio ou Site Web',
      ar: 'رابط إنستغرام أو معرض الأعمال أو الموقع',
    }[language] || 'Portfolio or Website Link',
    descriptionLabel: {
      en: 'Description of Your Creations & Crafting Method *',
      fr: 'Description de Vos Produits & Matériaux *',
      ar: 'وصف المنتجات وطريقة التصنيع والمواد المستخدمة *',
    }[language] || 'Description of Your Creations *',
    descriptionPlaceholder: {
      en: 'Tell us about your toys, books, puzzles or games. What materials do you use? What values or skills does it inspire in children?',
      fr: 'Présentez vos créations (bois, papier recyclé, kits STEM...). Quels bienfaits ou apprentissages apportent-ils aux enfants ?',
      ar: 'أخبرنا عن ألعابك أو كتبك أو حقائبك. ما هي المواد المستخدمة؟ وما هي المهارات والقيم التي تنميها لدى الطفل؟',
    }[language] || 'Tell us about your creations.',
    sampleImagesLabel: {
      en: 'Sample Product Photos (Up to 4 images)',
      fr: 'Photos d\'Échantillons (Jusqu\'à 4 images)',
      ar: 'صور ونماذج من المنتجات (حتى ٤ صور)',
    }[language] || 'Sample Product Photos (Up to 4 images)',
    sampleImagesHelp: {
      en: 'Upload clear photos showing the build quality, packaging, or your workshop process. Max 5MB per image (JPG, PNG, WebP).',
      fr: 'Téléversez des photos nettes montrant la qualité, l\'emballage ou votre atelier. Max 5 Mo par image.',
      ar: 'ارفع صوراً واضحة تُظهر جودة الصنع أو التغليف أو كواليس العمل. بحد أقصى ٥ ميغابايت لكل صورة.',
    }[language] || 'Upload clear photos of your items.',
    safetyPledgeText: {
      en: 'Safety & Ethics Pledge: I confirm that all my proposed products use non-toxic, safe materials suitable for children and comply with AbtalQuest\'s educational and safety standards.',
      fr: 'Engagement de Sécurité & d\'Éthique : Je certifie que tous mes produits utilisent des matériaux sains, non toxiques et conformes aux critères de sécurité infantile d\'AbtalQuest.',
      ar: 'ميثاق الأمان والأخلاق: أقر بأن جميع المنتجات المعروضة مصنوعة من مواد آمنة وغير سامة ومناسبة للأطفال، وتلتزم بمعايير أبطال كويست.',
    }[language] || 'Safety & Ethics Pledge',
    submitBtn: {
      en: 'Submit Vendor Application',
      fr: 'Envoyer ma Candidature Vendeur',
      ar: 'إرسال طلب الانضمام للبائعين',
    }[language] || 'Submit Vendor Application',
    submittingBtn: {
      en: 'Reviewing and submitting...',
      fr: 'Envoi en cours...',
      ar: 'جاري الإرسال...',
    }[language] || 'Submitting...',
    successTitle: {
      en: 'Application Received Successfully!',
      fr: 'Candidature Reçue avec Succès !',
      ar: 'تم استلام طلبك بنجاح!',
    }[language] || 'Application Received Successfully!',
    successDesc: {
      en: 'Thank you for stepping forward to enrich our children\'s world. Our curatorial team will inspect your product samples and reach out via WhatsApp and email within 24–48 hours.',
      fr: 'Merci de participer à l\'éveil d\'une enfance épanouie. Notre comité va examiner vos échantillons et vous contactera par WhatsApp et e-mail sous 24 à 48 heures.',
      ar: 'شكراً لانضمامك لرسالتنا في إثراء طفولة واعية. سيقوم فريقنا بمراجعة نماذجك والتواصل معك عبر الواتساب والبريد خلال ٢٤ إلى ٤٨ ساعة.',
    }[language] || 'Thank you for your application.',
    exploreMarketplaceBtn: {
      en: 'Explore Marketplace Collections',
      fr: 'Découvrir la Boutique',
      ar: 'تصفح المتجر والمنتجات',
    }[language] || 'Explore Marketplace',
    backHomeBtn: {
      en: 'Back to Home',
      fr: 'Retour à l\'Accueil',
      ar: 'العودة للرئيسية',
    }[language] || 'Back to Home',
  };

  // Handle Image Upload
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (sampleImages.length >= 4) {
      setFormError('You can upload up to 4 sample photos.');
      return;
    }

    setUploadingImage(true);
    setFormError(null);

    try {
      const publicUrl = await uploadVendorSampleImage(file);
      setSampleImages(prev => [...prev, publicUrl]);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to upload sample photo.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSampleImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle Form Submission
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(language === 'ar' ? 'يرجى إدخال الاسم الكامل.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setFormError(language === 'ar' ? 'يرجى إدخال رقم الهاتف أو الواتساب.' : 'Please enter your WhatsApp/phone number.');
      return;
    }
    if (!shopName.trim()) {
      setFormError(language === 'ar' ? 'يرجى إدخال اسم المتجر أو العلامة.' : 'Please enter your brand or shop name.');
      return;
    }
    if (!productDescription.trim() || productDescription.trim().length < 20) {
      setFormError(language === 'ar' ? 'يرجى تقديم وصف وافٍ لمنتجاتك (٢٠ حرفاً على الأقل).' : 'Please provide a detailed product description (at least 20 characters).');
      return;
    }
    if (!safetyPledge) {
      setFormError(language === 'ar' ? 'يرجى الموافقة على ميثاق الأمان وسلامة الأطفال للمتابعة.' : 'Please check the Child-Safety & Ethics Pledge to continue.');
      return;
    }

    setSubmitting(true);

    try {
      const input: CreateVendorApplicationInput = {
        fullName,
        email,
        phone,
        shopName,
        category,
        productDescription,
        targetAgeGroup,
        websiteOrSocial,
        sampleImages,
      };

      const result = await submitVendorApplication(input);
      if (result.success && result.application) {
        setSubmittedAppId(result.application.id);
        window.scrollTo({ top: 100, behavior: 'smooth' });
      } else {
        setFormError(result.error || 'Failed to submit application. Please try again.');
      }
    } catch (err: any) {
      setFormError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // FAQ Items
  const faqItems = [
    {
      q: {
        en: 'Who can apply to become an AbtalQuest Parent Vendor?',
        fr: 'Qui peut postuler comme Parent Vendeur sur AbtalQuest ?',
        ar: 'من يحق له التقديم كبائع في أبطال كويست؟',
      }[language] || 'Who can apply?',
      a: {
        en: 'Any parent, artisan, educator, or independent creator crafting child-friendly, screen-free educational materials, wooden toys, storybooks, or STEM kits can apply. We welcome local Moroccan craftspeople and international creators who share our values.',
        fr: 'Tout parent, artisan, éducateur ou créateur indépendant concevant des jouets éducatifs sains, en bois, des livres ou des kits STEM sans écran. Nous soutenons particulièrement les artisans locaux et éco-responsables.',
        ar: 'نرحب بجميع أولياء الأمور، والحرفيين، والمربين، والمصممين المستقلين الذين يصنعون ألعاباً تعليمية خشبية، أو قصصاً ورقية، أو حقائب هندسية بدون شاشات ومصنوعة من مواد آمنة.',
      }[language] || 'Any parent or independent creator crafting screen-free educational products.',
    },
    {
      q: {
        en: 'What are the fees and commission rates?',
        fr: 'Quels sont les frais et les taux de commission ?',
        ar: 'ما هي الرسوم والنسب المقتطعة؟',
      }[language] || 'What are the fees?',
      a: {
        en: 'Applying and listing products on AbtalQuest is 100% free with zero monthly subscription fees. We only take a modest 10–12% commission upon successful sales to cover payment processing, hosting, and curator verification.',
        fr: 'L\'inscription et la mise en ligne sont 100% gratuites, sans abonnement mensuel. Nous prélevons uniquement une commission raisonnable de 10 à 12% sur les ventes effectives pour couvrir les passerelles de paiement et le support.',
        ar: 'التسجيل وإدراج المنتجات مجاني ١٠٠٪ وبدون أي اشتراكات شهرية. نقتطع عمولة رمزية (١٠-١٢٪) فقط عند إتمام البيع بنجاح لتغطية بوابات الدفع والدعم الفني.',
      }[language] || 'Free listing with a modest 10-12% commission on completed sales.',
    },
    {
      q: {
        en: 'How does shipping and delivery work?',
        fr: 'Comment fonctionnent l\'expédition et la livraison ?',
        ar: 'كيف تتم عملية الشحن والتوصيل؟',
      }[language] || 'How does shipping work?',
      a: {
        en: 'You can either ship your creations directly to customers using our discounted carrier partners (with automated tracking numbers provided), or deliver batches to our regional fulfillment hub in Casablanca.',
        fr: 'Vous pouvez soit expédier directement vos colis via nos transporteurs partenaires avec suivi automatisé, soit confier un stock à notre centre logistique à Casablanca.',
        ar: 'يمكنك شحن الطرود مباشرة للمشتري عبر شركاء الشحن المعتمدين لدينا مع رقم تتبع فوري، أو تسليم شحناتك لمركز التوزيع الخاص بنا في الدار البيضاء.',
      }[language] || 'Ship directly or use our regional hub.',
    },
    {
      q: {
        en: 'What safety certifications do I need to provide?',
        fr: 'Quelles garanties de sécurité dois-je fournir ?',
        ar: 'ما هي معايير السلامة التي يجب توفيرها؟',
      }[language] || 'What safety certifications are needed?',
      a: {
        en: 'Products must be free of sharp hazards, choking risks for toddlers, toxic paints, and screen components. Our team will request material specs or inspection samples before your boutique goes live.',
        fr: 'Les produits doivent être exempts d\'angles coupants, de risques d\'ingestion pour les petits et de peintures toxiques. Notre équipe vérifie vos matériaux avant la mise en ligne.',
        ar: 'يجب أن تكون المنتجات خالية من الحواف الحادة، ومخاطر الاختناق للأطفال الصغار، والدهانات الكيميائية السامة. يقوم فريقنا بفحص المواد قبل تفعيل المتجر.',
      }[language] || 'Must use non-toxic, child-safe materials without sharp hazards.',
    },
  ];

  return (
    <div className="w-full bg-slate-50/50 dark:bg-[#071727] py-8 sm:py-14 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* ========================================================
            1. HERO SECTION & VALUE PROPOSITION
           ======================================================== */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#06152B] via-[#0A2540] to-[#016ba5] text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-white/10">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#fa8221]/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#38BDF8]/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-amber-300 font-headline font-bold text-xs uppercase tracking-wider mb-4 shadow-sm">
              <Store className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.badge}</span>
            </div>

            <h1 className="font-headline text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 drop-shadow-sm">
              {t.heroTitle}
            </h1>

            <p className="font-body text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl font-normal drop-shadow-xs">
              {t.heroSubtitle}
            </p>

            {/* Quick Action Anchor Button */}
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="#application-form"
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('application-form');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white font-headline text-sm font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>{language === 'ar' ? 'ابدأ طلب الانضمام الآن' : 'Start Your Vendor Application'}</span>
                <ArrowRight className={cn('w-4 h-4', direction === 'rtl' ? 'rotate-180' : '')} />
              </a>

              <button
                type="button"
                onClick={() => onNavigate?.('marketplace')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-headline text-sm font-bold transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-sky-300" />
                <span>{language === 'ar' ? 'تصفح المتجر الحالي' : 'View Current Marketplace'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. THREE PILLARS OF PARTNERSHIP
           ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-2">
              {t.stat1Title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.stat1Desc}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38bdf8] flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-2">
              {t.stat2Title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.stat2Desc}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white mb-2">
              {t.stat3Title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.stat3Desc}
            </p>
          </div>
        </section>

        {/* ========================================================
            3. HOW IT WORKS: 4-STEP ONBOARDING
           ======================================================== */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-headline font-black text-[#fa8221] uppercase tracking-wider">
              {language === 'ar' ? 'خطوات الانضمام البسيطة' : 'Simple 4-Step Process'}
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 mb-3">
              {language === 'ar' ? 'كيف تبدأ البيع على أبطال كويست؟' : 'How Selling on AbtalQuest Works'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body">
              {language === 'ar' ? 'نهتم بكل تفاصيل الجودة والأمان لنوفر لك بيئة تجارية مريحة ومحترمة.' : 'From initial application to your first order dispatch, we support you all the way.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-[#fa8221] text-white font-headline font-black text-xs flex items-center justify-center mb-3">
                01
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {language === 'ar' ? 'قدم طلبك ونماذجك' : 'Apply with Samples'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                {language === 'ar' ? 'شاركنا قصة متجرك وصوراً واضحة لمنتجاتك وحقائبك التعليمية.' : 'Submit your brand details, workshop story, and photo samples of your creations.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-[#016ba5] text-white font-headline font-black text-xs flex items-center justify-center mb-3">
                02
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {language === 'ar' ? 'مراجعة الأمان والجودة' : 'Curator Safety Review'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                {language === 'ar' ? 'تفحص لجنتنا معايير الأمان والتوافق مع قيمنا الخالية من الشاشات خلال ٢٤-٤٨ ساعة.' : 'Our team audits non-toxic materials, pedagogical value, and build resilience in 24–48h.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-headline font-black text-xs flex items-center justify-center mb-3">
                03
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {language === 'ar' ? 'تفعيل متجرك وقوائمك' : 'Boutique Onboarding'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                {language === 'ar' ? 'تحصل على صفحة متجر مخصصة مع دعم كامل لصور المنتجات ومقاطع الفيديو التوضيحية.' : 'Receive your merchant listing profile, showcase your kits, and set pricing.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-headline font-black text-xs flex items-center justify-center mb-3">
                04
              </div>
              <h4 className="font-headline font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                {language === 'ar' ? 'شحن سريع وأرباح مباشرة' : 'Orders & Fast Payouts'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-body">
                {language === 'ar' ? 'استلم طلبات العائلات فورياً واشحن عبر شركائنا مع دفعات مصرفية شفافة وسريعة.' : 'Receive customer orders, print discounted shipping slips, and get paid directly.'}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. VENDOR APPLICATION FORM (OR SUCCESS STATE)
           ======================================================== */}
        <section id="application-form" className="relative scroll-mt-24">
          {submittedAppId ? (
            /* Successful Submission Confirmation Screen */
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 p-8 sm:p-14 text-center shadow-xl animate-in zoom-in-95 duration-300 max-w-3xl mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6 border-2 border-emerald-200 dark:border-emerald-700">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <span className="px-3.5 py-1 rounded-full text-xs font-headline font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 mb-3 inline-block">
                Application ID: {submittedAppId}
              </span>

              <h2 className="font-headline text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3">
                {t.successTitle}
              </h2>

              <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">
                {t.successDesc}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left rtl:text-right max-w-md mx-auto mb-8 text-xs font-body space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === 'ar' ? 'مقدم الطلب:' : 'Applicant:'}</span>
                  <strong className="text-slate-800 dark:text-slate-200">{fullName}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === 'ar' ? 'المتجر:' : 'Boutique:'}</span>
                  <strong className="text-slate-800 dark:text-slate-200">{shopName}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{language === 'ar' ? 'حالة الطلب:' : 'Status:'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {language === 'ar' ? 'قيد المراجعة التربوية' : 'Under Review'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => onNavigate?.('marketplace')}
                  className="px-6 py-3 rounded-2xl bg-[#016ba5] hover:bg-[#015888] text-white font-headline text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {t.exploreMarketplaceBtn}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.('home')}
                  className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-headline text-xs font-bold transition-all cursor-pointer"
                >
                  {t.backHomeBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Application Form Card */
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-w-4xl mx-auto">
              <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fa8221]/15 text-[#fa8221] text-xs font-headline font-bold uppercase tracking-wider mb-2">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'استمارة التسجيل' : 'Application Form'}</span>
                </div>
                <h2 className="font-headline text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t.formCardTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-body mt-1">
                  {t.formCardDesc}
                </p>
              </div>

              {formError && (
                <div className="mx-6 sm:mx-10 mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-headline flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="p-6 sm:p-10 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: فاطمة الزهراء بنجلون' : 'e.g. Amina Benjelloun'}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Shop Name */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.shopNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: ألعاب الأطلس الخشبية' : 'e.g. Atlas Wooden Curiosities'}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.categoryLabel}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    >
                      {VENDOR_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {language === 'ar' ? cat.labelAr : language === 'fr' ? cat.labelFr : cat.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Age Group */}
                  <div>
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.targetAgeLabel}
                    </label>
                    <select
                      value={targetAgeGroup}
                      onChange={(e) => setTargetAgeGroup(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    >
                      <option value="0-3">{language === 'ar' ? 'الرضع والصغار (٠-٣ سنوات)' : 'Toddlers (0–3 yrs)'}</option>
                      <option value="4-7">{language === 'ar' ? 'الطفولة المبكرة (٤-٧ سنوات)' : 'Early Childhood (4–7 yrs)'}</option>
                      <option value="8-12">{language === 'ar' ? 'الناشئة والأبطال (٨-١٢ سنة)' : 'Adventures (8–12 yrs)'}</option>
                      <option value="all">{language === 'ar' ? 'لجميع أفراد العائلة' : 'Family Play & All Ages'}</option>
                    </select>
                  </div>

                  {/* Portfolio or Social Link */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.websiteLabel}
                    </label>
                    <input
                      type="url"
                      value={websiteOrSocial}
                      onChange={(e) => setWebsiteOrSocial(e.target.value)}
                      placeholder="https://instagram.com/myworkshop or https://mybrand.com"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Product Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.descriptionLabel}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder={t.descriptionPlaceholder}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-body border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#fa8221]/30 focus:border-[#fa8221]"
                    />
                  </div>

                  {/* Sample Images Upload */}
                  <div className="sm:col-span-2 space-y-3">
                    <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-300">
                      {t.sampleImagesLabel}
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-body">
                      {t.sampleImagesHelp}
                    </p>

                    {/* Image Previews */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {sampleImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group shadow-xs">
                          <img src={imgUrl} alt="Sample product" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Button */}
                      {sampleImages.length < 4 && (
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            onChange={handleUploadImage}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#fa8221] bg-slate-50 dark:bg-slate-800/60 flex flex-col items-center justify-center text-slate-400 hover:text-[#fa8221] transition-all cursor-pointer disabled:opacity-50"
                          >
                            {uploadingImage ? (
                              <Loader2 className="w-5 h-5 animate-spin text-[#fa8221]" />
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 mb-0.5" />
                                <span className="text-[10px] font-bold">
                                  {language === 'ar' ? 'إضافة صورة' : 'Add Photo'}
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Safety & Ethics Pledge Checkbox */}
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={safetyPledge}
                        onChange={(e) => setSafetyPledge(e.target.checked)}
                        className="mt-0.5 rounded text-[#fa8221] focus:ring-[#fa8221] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-body text-slate-700 dark:text-slate-300 leading-relaxed">
                        {t.safetyPledgeText}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#fa8221] to-[#f59e0b] hover:from-[#e87313] hover:to-[#d97706] text-white font-headline text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.submittingBtn}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.submitBtn}</span>
                        <ArrowRight className={cn('w-4 h-4', direction === 'rtl' ? 'rotate-180' : '')} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* ========================================================
            5. FREQUENTLY ASKED QUESTIONS (FAQ)
           ======================================================== */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-headline font-black text-[#016ba5] uppercase tracking-wider">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'Questions & Answers'}
            </span>
            <h2 className="font-headline text-2xl font-black text-slate-900 dark:text-white mt-1">
              {language === 'ar' ? 'كل ما تحتاج معرفته عن البيع معنا' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left rtl:text-right flex items-center justify-between gap-4 font-headline text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                        isOpen && 'rotate-180 text-[#fa8221]'
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 font-body text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ParentVendorsPage;
