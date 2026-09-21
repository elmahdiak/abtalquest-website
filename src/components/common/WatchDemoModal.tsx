import React, { useEffect } from 'react';
import { X, Play, ShieldCheck, Sparkles, CheckCircle2, Compass, Smartphone } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { useLanguage } from '../../context/LanguageContext';

export interface WatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplorePlanets?: () => void;
}

export const WatchDemoModal: React.FC<WatchDemoModalProps> = ({
  isOpen,
  onClose,
  onExplorePlanets,
}) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#fa8221]/15 text-[#fa8221] flex items-center justify-center">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" size="sm">
                  {t('hero.badge_nextgen')}
                </Badge>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Ad-Free
                </span>
              </div>
              <h3 id="demo-modal-title" className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                AbtalQuest Interactive Demo
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close demo modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video / Interactive Visual Showcase */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="relative aspect-video rounded-2xl bg-[#071727] border-2 border-slate-800 overflow-hidden flex items-center justify-center shadow-inner group">
            {/* Animated Demo Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#016ba5]/40 via-[#7C3AED]/20 to-[#fa8221]/30 opacity-70" />
            
            <div className="relative z-10 text-center px-6 max-w-md">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#fa8221] to-[#f59e0b] text-white flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
              <h4 className="font-headline font-bold text-white text-xl mb-2">
                AbtalQuest Experience Walkthrough
              </h4>
              <p className="font-body text-xs sm:text-sm text-slate-300">
                See how children explore the 4 Planet Worlds, watch values-based cartoons, and complete real-life physical quests.
              </p>
            </div>

            {/* Floating feature pills in player */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> 4 Planetary Realms
            </div>
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-emerald-400 border border-white/10 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" /> COPPA Certified Safe
            </div>
          </div>

          {/* Key Walkthrough Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#016ba5]/10 text-[#016ba5] dark:text-[#38BDF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                  1. Explore 4 Planetary Realms
                </h5>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  Thinkers' (Logic), Brave (Resilience), Solvers' (STEM), and Heart (Empathy & Kindness).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                  2. Real-World Missions
                </h5>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  Children unlock challenges in the app and execute them in the physical world with their family.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                  3. Pure Ad-Free Standard
                </h5>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  No algorithms, no third-party trackers, no pop-up ads, no violence.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-headline font-bold text-xs sm:text-sm text-slate-900 dark:text-white mb-1">
                  4. Parental Dashboard
                </h5>
                <p className="font-body text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                  Supervise screen time, review earned character skills, and celebrate family achievements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            Close
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                if (onExplorePlanets) onExplorePlanets();
                else {
                  const el = document.getElementById('planet-worlds') || document.getElementById('planets');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Explore Planets
            </Button>
            <Button
              variant="cta"
              size="sm"
              onClick={() => {
                onClose();
                const el = document.getElementById('download-app') || document.getElementById('download');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#fa8221] hover:bg-[#e87313] text-white"
            >
              Get Free App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchDemoModal;
