import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Smartphone, 
  Star, 
  Heart, 
  CheckCircle2,
  Lock,
  Play
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export interface HeroProps {
  onExploreClick?: () => void;
  onDownloadClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDownloadClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#016ba5]/10 via-white to-slate-50/60 pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-slate-100">
      {/* Ambient background aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-[#016ba5]/15 via-[#fa8221]/12 to-[#7C3AED]/12 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Text & Actions (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Security & Values Badges (Baloo 2 font) */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <Badge variant="success" size="md" icon={<ShieldCheck className="w-4 h-4" />}>
                100% Safe Universe
              </Badge>
              <Badge variant="warning" size="md" icon={<Lock className="w-3.5 h-3.5" />}>
                No Ads • No Violence
              </Badge>
              <Badge variant="gamification" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
                Ages 6–13
              </Badge>
            </div>

            {/* Main Headline (Montserrat Font, bold & strong) */}
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E293B] tracking-tight leading-[1.12] mb-6">
              Protecting Childhood.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#016ba5] via-[#0284c7] to-[#fa8221]">
                Empowering Growth.
              </span>
            </h1>

            {/* Sub-headline (Roboto Mono Font, readable & modern) */}
            <p className="font-body text-base sm:text-lg text-[#64748B] leading-relaxed mb-8 max-w-2xl">
              AbtalQuest is a safe universe where kids play, learn, and grow with joy.{' '}
              <strong className="text-[#016ba5] font-semibold">No ads. No violence!</strong>
            </p>

            {/* Primary Call-to-Action Buttons styled in secondary orange (#fa8221) */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              {/* CTA Button 1: Explore the Quest */}
              <Button
                variant="cta"
                size="xl"
                icon={<Compass className="w-5 h-5" />}
                iconPosition="left"
                onClick={onExploreClick}
                className="shadow-cta hover:shadow-cta-hover transform hover:-translate-y-0.5"
              >
                Explore the Quest
              </Button>

              {/* CTA Button 2: Download App (also in secondary orange #fa8221) */}
              <Button
                variant="cta"
                size="xl"
                icon={<Smartphone className="w-5 h-5" />}
                iconPosition="left"
                onClick={onDownloadClick}
                className="bg-[#fa8221] hover:bg-[#e87313] shadow-cta hover:shadow-cta-hover transform hover:-translate-y-0.5"
              >
                Download App
              </Button>
            </div>

            {/* Safe Childhood Assurance Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-6 border-t border-slate-200/80 w-full text-xs font-body text-[#64748B]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>Zero Commercial Trackers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>Values & Empathy Centered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>Parental Screen-Time Balance</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Universe Card (Cols 8-12) */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            
            {/* Ambient decorative glow ring */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#016ba5]/40 via-[#fa8221]/30 to-[#7C3AED]/30 rounded-[32px] blur-2xl opacity-60" />

            {/* Interactive Universe Showcase Card */}
            <div className="relative w-full max-w-md bg-gradient-to-b from-white to-slate-50 border-2 border-white/80 shadow-2xl rounded-3xl p-6 sm:p-7 overflow-hidden">
              
              {/* Top Card Navigation / Status */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#016ba5] text-white flex items-center justify-center shadow-brand">
                    <Compass className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-headline text-xs font-bold text-[#016ba5] uppercase tracking-wider block">
                      Universe Gateway
                    </span>
                    <span className="font-headline text-base font-extrabold text-[#1E293B]">
                      Realm of Courage & Care
                    </span>
                  </div>
                </div>

                <Badge variant="gamification" size="sm" icon={<Star className="w-3.5 h-3.5 fill-current" />}>
                  XP +450
                </Badge>
              </div>

              {/* Dynamic Child Hero Illustration Container */}
              <div className="relative rounded-2xl bg-[#0A2540] p-6 text-white overflow-hidden shadow-inner mb-5 border border-[#016ba5]/30">
                {/* Background Stars / Sparks */}
                <div className="absolute top-2 right-4 text-amber-300 opacity-60">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="absolute bottom-3 left-4 text-sky-400 opacity-50">
                  <Heart className="w-4 h-4" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center py-2">
                  {/* Guardian Character Emblem */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#016ba5] to-[#38BDF8] p-1 shadow-lg mb-3 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-[#0A2540] flex items-center justify-center text-white">
                      {/* Stylized Hero Silhouette Icon */}
                      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="20" r="10" fill="#38bdf8" />
                        <path d="M23 78 C23 48, 35 34, 50 34 C65 34, 77 48, 77 78" stroke="#016ba5" strokeWidth="10" strokeLinecap="round" />
                        <path d="M45 68 C44 59, 49 50, 56 50 C63.5 50, 67.5 55.5, 67.5 62 C67.5 70, 58 75.5, 52 75.5 C46.5 75.5, 43 71.5, 43 66.5" stroke="#fa8221" strokeWidth="8" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <span className="font-headline text-lg font-bold text-white mb-1">
                    Young Hero: Amina
                  </span>
                  <span className="font-body text-xs text-slate-300">
                    Active Quest: "The Bridge of Honest Words"
                  </span>

                  {/* Gamified progress bar */}
                  <div className="w-full mt-4 space-y-1">
                    <div className="flex justify-between font-body text-[11px] text-slate-300">
                      <span>Kindness Level 4</span>
                      <span className="text-[#38BDF8] font-semibold">80% to Guardian Badge</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#016ba5] via-[#38BDF8] to-[#22C55E] rounded-full w-[80%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Feature Badges below card */}
              <div className="grid grid-cols-2 gap-3 font-body text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#22C55E]/15 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">Safe Content</span>
                    <span className="text-slate-500 text-[10px]">Zero Ads & Popups</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">Joyful Play</span>
                    <span className="text-slate-500 text-[10px]">Values-Based XP</span>
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

export default Hero;
