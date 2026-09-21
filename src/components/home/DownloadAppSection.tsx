import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Compass, 
  Heart, 
  Mountain, 
  Brain, 
  Lightbulb
} from 'lucide-react';
import Badge from '../common/Badge';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { useLanguage } from '../../context/LanguageContext';

export const DownloadAppSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section 
      id="download-app" 
      className="py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 dark:from-[#071727] dark:via-[#0A2540] dark:to-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Mascot, Header, Store Buttons (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left rtl:text-right">
            
            {/* Mascot & Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fa8221] to-[#f59e0b] p-0.5 shadow-md flex items-center justify-center text-white">
                <div className="w-full h-full rounded-[14px] bg-[#0A2540] flex items-center justify-center">
                  <AbtalQuestLogo mode="emblem" variant="dark" size="sm" showText={false} />
                </div>
              </div>
              <div>
                <Badge variant="warning" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  {t('download.title') || 'Download Our App'}
                </Badge>
                <span className="block text-[11px] font-semibold text-emerald-500 mt-0.5">
                  100% Free • Ad-Free • Child Safe
                </span>
              </div>
            </div>

            {/* Main Header */}
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight leading-[1.2] mb-5">
              {t('download.header') || 'Download our app for free on your mobile device from the App Store or Google Play.'}
            </h2>

            {/* Subtext */}
            <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-xl">
              {t('download.subtext') || 'Join thousands of parents creating smarter, stronger heroes.'}
            </p>

            {/* Store Download Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {/* Apple App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-slate-800"
              >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-.99 1.74-.88 2.77 1.01.08 2.05-.52 2.6-1.27z"/>
                </svg>
                <div className="text-left rtl:text-right">
                  <span className="block text-[10px] uppercase font-body tracking-wider text-slate-400 leading-none">
                    Download on the
                  </span>
                  <span className="block text-base font-headline font-bold text-white leading-tight mt-0.5">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play Store */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-slate-800"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M3.6 1.4l10.9 10.9-3.2 3.2L3.6 1.4z"/>
                  <path fill="#FBBC04" d="M17.7 15.5l-3.2-3.2 3.2-3.2 3.7 2.1c1 .6 1 1.6 0 2.2l-3.7 2.1z"/>
                  <path fill="#4285F4" d="M3.6 22.6l7.7-7.7 3.2 3.2L3.6 22.6z"/>
                  <path fill="#34A853" d="M3.6 1.4c-.4.4-.6 1-.6 1.8v17.6c0 .8.2 1.4.6 1.8L14.5 12 3.6 1.4z"/>
                </svg>
                <div className="text-left rtl:text-right">
                  <span className="block text-[10px] uppercase font-body tracking-wider text-slate-400 leading-none">
                    Get it on
                  </span>
                  <span className="block text-base font-headline font-bold text-white leading-tight mt-0.5">
                    Google Play
                  </span>
                </div>
              </a>
            </div>

            {/* Instant Access Assurance Note */}
            <div className="flex items-center gap-3 text-xs font-body text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{t('download.instant_access') || 'Instant access • Trusted & Secure • 100% Free'}</span>
            </div>
          </div>

          {/* Right Column: Phone Mockup Previewing Planet Navigation (Cols 8-12) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[310px] sm:max-w-[340px]">
              
              {/* Outer Decorative Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#016ba5]/30 via-[#fa8221]/30 to-[#7C3AED]/30 rounded-[50px] blur-2xl opacity-60" />

              {/* Phone Device Frame */}
              <div className="relative rounded-[44px] bg-slate-950 p-3.5 shadow-2xl border-4 border-slate-800">
                {/* Dynamic Island / Speaker Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                  <div className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>

                {/* Inner Screen */}
                <div className="relative rounded-[36px] bg-[#071727] text-white overflow-hidden pt-9 pb-5 px-4 flex flex-col h-[580px] border border-slate-800">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-2 mb-3">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>5G</span>
                      <div className="w-4 h-2 bg-emerald-500 rounded-sm" />
                    </div>
                  </div>

                  {/* App Mini Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#016ba5] flex items-center justify-center text-white">
                        <Compass className="w-4 h-4" />
                      </div>
                      <span className="font-headline font-black text-xs text-white">
                        AbtalQuest
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>1,250 XP</span>
                    </div>
                  </div>

                  {/* Mini Planet Navigation Hub */}
                  <div className="text-left rtl:text-right mb-3 px-1">
                    <span className="text-[10px] uppercase font-bold text-[#38BDF8] tracking-wider block">
                      Active Universe
                    </span>
                    <h4 className="font-headline font-black text-sm text-white">
                      Explore Planet Worlds
                    </h4>
                  </div>

                  {/* Planet Cards in Mockup */}
                  <div className="space-y-2.5 overflow-hidden flex-1">
                    {/* Planet 1: Thinkers */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#016ba5]/30 to-white/5 border border-[#016ba5]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#016ba5] flex items-center justify-center text-white">
                          <Brain className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-headline font-bold text-xs block text-white">Thinkers' Planet</span>
                          <span className="text-[10px] text-slate-300 block">Logic & STEM • Lvl 1-5</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                        →
                      </div>
                    </div>

                    {/* Planet 2: Brave */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#fa8221]/30 to-white/5 border border-[#fa8221]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#fa8221] flex items-center justify-center text-white">
                          <Mountain className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-headline font-bold text-xs block text-white">Brave Planet</span>
                          <span className="text-[10px] text-slate-300 block">Resilience & Truth • Lvl 2-6</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                        →
                      </div>
                    </div>

                    {/* Planet 3: Solvers */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#22C55E]/30 to-white/5 border border-[#22C55E]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#22C55E] flex items-center justify-center text-white">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-headline font-bold text-xs block text-white">Solvers' Planet</span>
                          <span className="text-[10px] text-slate-300 block">Engineering & Hacks • Lvl 3-7</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                        →
                      </div>
                    </div>

                    {/* Planet 4: Heart */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED]/30 to-white/5 border border-[#7C3AED]/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-headline font-bold text-xs block text-white">Heart Planet</span>
                          <span className="text-[10px] text-slate-300 block">Empathy & Values • Lvl 1-8</span>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white text-[10px]">
                        →
                      </div>
                    </div>
                  </div>

                  {/* App Bottom Tab Bar */}
                  <div className="pt-3 border-t border-white/10 grid grid-cols-4 text-center text-[10px] text-slate-400">
                    <div className="text-[#38BDF8] flex flex-col items-center gap-0.5">
                      <Compass className="w-4 h-4" />
                      <span className="text-[9px]">Worlds</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Star className="w-4 h-4" />
                      <span className="text-[9px]">Quests</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[9px]">Badges</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Heart className="w-4 h-4" />
                      <span className="text-[9px]">Family</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
