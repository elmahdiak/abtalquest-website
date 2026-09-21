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
        
        {/* Closing Quote Banner */}
        <div className="bg-gradient-to-r from-[#016ba5]/25 via-[#0A2540] to-[#fa8221]/20 border border-[#fa8221]/40 rounded-3xl p-6 sm:p-8 mb-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#fa8221]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <blockquote className="font-headline text-lg sm:text-2xl font-black text-white tracking-tight leading-snug mb-2">
              "{t('about.creed_quote') || "We didn't want to raise kids in fear. So we built a space for courage!"}"
            </blockquote>
            <span className="font-body text-xs sm:text-sm text-[#fa8221] font-bold uppercase tracking-wider block">
              — {t('about.creed_author') || 'The AbtalQuest Founding Team'}
            </span>
          </div>
        </div>

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

            {/* Social Media Channels: Facebook, Instagram, YouTube, LinkedIn, Discord */}
            <div className="mt-4">
              <span className="font-headline text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                {t('footer.follow_title')}
              </span>
              <div className="flex items-center gap-2.5 text-slate-300">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#1877F2] hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

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

                {/* Discord */}
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#5865F2] hover:text-white border border-white/10 flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="AbtalQuest on Discord"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
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
                <a href="#universe" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.home')}</span>
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>{t('nav.about')}</span>
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-amber-400 transition-colors flex items-center gap-2">
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
