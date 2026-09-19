import React, { useEffect } from 'react';
import { 
  X, 
  Layers, 
  Brain, 
  Compass, 
  Wrench, 
  Heart, 
  BookOpen, 
  Gamepad2, 
  Package, 
  Star, 
  Sparkles, 
  Flame, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceTaxonomyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (filter: { planet?: string; age?: string; type?: string; special?: string }) => void;
  activePlanet: string;
  activeAge: string;
  activeType: string;
}

export const MarketplaceTaxonomyDrawer: React.FC<MarketplaceTaxonomyDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  activePlanet,
  activeAge,
  activeType,
}) => {
  const { t, direction } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const planets = [
    { id: 'thinkers', name: "Thinkers' Planet", subtitle: 'Birchwood Mechanical & STEM Engineering', icon: Brain, color: 'text-[#016ba5] bg-[#016ba5]/10' },
    { id: 'brave', name: 'Brave Planet', subtitle: 'Solid Brass Trail Navigation & Calming Mindfulness', icon: Compass, color: 'text-[#fa8221] bg-[#fa8221]/10' },
    { id: 'solvers', name: "Solvers' Planet", subtitle: 'Hydraulic Robotics & Unplugged Algorithm Logic', icon: Wrench, color: 'text-[#0284c7] bg-[#0284c7]/10' },
    { id: 'heart', name: 'Heart Planet', subtitle: 'Cooperative Kindness Games & Gratitude Filigree', icon: Heart, color: 'text-[#7C3AED] bg-[#7C3AED]/10' },
  ];

  const formats = [
    { id: 'Physical Kit', name: 'Physical Assembly Kits', count: '4 kits', icon: Package },
    { id: 'Storybook', name: 'Illustrated Hardcover Chronicles', count: '1 book', icon: BookOpen },
    { id: 'Family Game', name: 'Cooperative Family Games', count: '2 games', icon: Gamepad2 },
    { id: 'Quest Gear', name: 'Screen-Free Exploration Gear', count: '1 gear', icon: Compass },
    { id: 'Learning Tool', name: 'Emotional Self-Regulation Tools', count: '1 tool', icon: Sparkles },
  ];

  const ageGroups = [
    { id: '6-8', name: 'Ages 6–8', desc: 'Empathy, tactile senses, and narrative courage' },
    { id: '9-11', name: 'Ages 9–11', desc: 'Mechanical gear ratios, trail bearings, and sequencing' },
    { id: '12+', name: 'Ages 12+', desc: '4-axis hydraulics and Pascal fluid dynamics' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className={cn(
        "fixed inset-y-0 max-w-full flex z-50",
        direction === 'rtl' ? 'right-0' : 'left-0'
      )}>
        <div 
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col h-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white">
                {t('marketplace.taxonomy_title')}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label={t('marketplace.taxonomy_close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Quick Special Curations */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Featured Highlights
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory({ special: 'bestsellers' });
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/40 text-center transition-all cursor-pointer group"
                >
                  <Star className="w-4 h-4 text-amber-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Bestsellers
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory({ special: 'new' });
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40 text-center transition-all cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-emerald-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    New In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory({ special: 'deals' });
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 bg-slate-50 dark:bg-slate-800/40 text-center transition-all cursor-pointer group"
                >
                  <Flame className="w-4 h-4 text-rose-500 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Offers
                  </span>
                </button>
              </div>
            </div>

            {/* Department 1: Educational Planets */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Planet Worlds (Character Virtues)
              </span>
              <div className="space-y-2">
                {planets.map((planet) => {
                  const Icon = planet.icon;
                  const isSelected = activePlanet === planet.id;

                  return (
                    <button
                      key={planet.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory({ planet: planet.id });
                        onClose();
                      }}
                      className={cn(
                        "w-full text-start p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 group cursor-pointer",
                        isSelected
                          ? "border-[#016ba5] bg-[#016ba5]/10 dark:border-[#0284c7] dark:bg-[#0284c7]/20 shadow-sm"
                          : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", planet.color)}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {planet.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {planet.subtitle}
                        </div>
                      </div>

                      <ArrowRight className={cn(
                        "w-4 h-4 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 transition-transform",
                        direction === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                      )} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department 2: Age Categories */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Age Groups
              </span>
              <div className="space-y-2">
                {ageGroups.map((group) => {
                  const isSelected = activeAge === group.id;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory({ age: group.id });
                        onClose();
                      }}
                      className={cn(
                        "w-full text-start p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer",
                        isSelected
                          ? "border-[#fa8221] bg-[#fa8221]/10 text-[#fa8221] font-bold"
                          : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      <div>
                        <div className="text-xs font-bold">{group.name}</div>
                        <div className="text-[11px] text-slate-400">{group.desc}</div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-400">→</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department 3: Product Formats */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Product Formats
              </span>
              <div className="space-y-2">
                {formats.map((fmt) => {
                  const Icon = fmt.icon;
                  const isSelected = activeType === fmt.id;

                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory({ type: fmt.id });
                        onClose();
                      }}
                      className={cn(
                        "w-full text-start p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold"
                          : "border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold">{fmt.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{fmt.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Safety Commitment Footer in Drawer */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">100% Screen-Free Creed</span>
                All kits are designed for hands-on, non-violent character building.
              </div>
            </div>

          </div>

          {/* All products reset button at bottom */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
            <button
              type="button"
              onClick={() => {
                onSelectCategory({ planet: 'all', age: 'all', type: 'all' });
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              {t('marketplace.reset_filters')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
