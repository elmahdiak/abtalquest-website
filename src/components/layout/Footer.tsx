import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  Lock, 
  Award, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface FooterProps {
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();

  return (
    // Deep Contrast Color (4%): #1C1C1C (Footer, overlays, strong contrast areas)
    <footer className="bg-[#1C1C1C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Safety & Values Pledge Banner (Cosmic Foundation #0A2540) */}
        <div className="bg-[#0A2540] border border-[#016ba5]/40 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  {t('vision.badge')}
                </Badge>
                <span className="font-body text-xs text-emerald-400">{t('hero.badge_safe')}</span>
              </div>
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {t('footer.pledge_title')}
              </h3>
              <p className="font-body text-sm text-slate-300 leading-relaxed max-w-2xl">
                {t('footer.pledge_desc')}
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 font-body text-xs">
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200">{t('footer.pledge_1')}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200">{t('footer.pledge_2')}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200">{t('footer.pledge_3')}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-slate-200">{t('footer.pledge_4')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Mission (Cols 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <AbtalQuestLogo
              variant="dark"
              size="lg"
              showText={true}
              tagline={t('nav.logo_tagline')}
              clickable={true}
              href="#universe"
            />
            <p className="font-body text-xs text-slate-400 leading-relaxed max-w-sm mt-2">
              {t('footer.brand_desc')}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <Badge variant="gamification" size="sm" icon={<Award className="w-3.5 h-3.5" />}>
                {t('footer.badge_character')}
              </Badge>
              <Badge variant="info" size="sm" icon={<Lock className="w-3.5 h-3.5" />}>
                {t('footer.badge_coppa')}
              </Badge>
            </div>

            {/* Social Media Channels */}
            <div className="mt-4">
              <span className="font-headline text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                {t('footer.follow_title')}
              </span>
              <div className="flex items-center gap-3 text-slate-300">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/abtal.quest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@AbtalQUEST"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF0000] hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@abtal.quest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-black hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/abtalquest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0A66C2] hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>

          {/* Column 2: Requested Quick Links (Cols 6-8) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#016ba5]" /> {t('footer.col_universe')}
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-xs text-slate-400">
              <li>
                <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.home')}</span>
                </a>
              </li>
              <li>
                <a href="#vision-mission" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.about')}</span>
                </a>
              </li>
              <li>
                <a href="#planet-worlds" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.marketplace')}</span>
                  <span className="font-gamification text-[10px] bg-[#fa8221]/20 text-[#fa8221] px-1.5 py-0.2 rounded font-bold">
                    {t('hero.badge_safe')}
                  </span>
                </a>
              </li>
              <li>
                <a href="#parenting-resources" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.blog')}</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-amber-400 transition-colors flex items-center gap-2 text-left rtl:text-right"
                >
                  <span>{t('nav.contact_support')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Requested Legal Terms (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h4 className="font-headline text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#22C55E]" /> {t('footer.col_safety')}
            </h4>
            <ul className="flex flex-col gap-2.5 font-body text-xs text-slate-400">
              <li>
                <a href="#privacy-for-kids" className="hover:text-amber-400 transition-colors">
                  {t('footer.col_safety_privacy')}
                </a>
              </li>
              <li>
                <a href="#child-safety-pledge" className="hover:text-amber-400 transition-colors">
                  {t('footer.col_safety_pledge')}
                </a>
              </li>
              <li>
                <a href="#ad-free-standard" className="hover:text-amber-400 transition-colors">
                  {t('footer.col_safety_ad_free')}
                </a>
              </li>
              <li>
                <a href="#coppa-compliance" className="hover:text-amber-400 transition-colors">
                  {t('footer.col_safety_coppa')}
                </a>
              </li>
              <li>
                <a href="#parental-oversight" className="hover:text-amber-400 transition-colors">
                  {t('safety.tab_parent_oversight') || 'Parental Oversight Tools'}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright for AbtalQuest */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 AbtalQuest. {t('footer.rights')}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t('footer.pledge_1')}
            </span>
            <span>•</span>
            <span className="text-amber-400">{t('footer.pledge_2')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
