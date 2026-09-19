import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Star, 
  Brain, 
  Compass, 
  Wrench, 
  Heart, 
  Layers,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export interface MarketplaceCategoryPillsProps {
  activePill: string;
  onSelectPill: (pillKey: string) => void;
  totalProductsCount: number;
}

export const MarketplaceCategoryPills: React.FC<MarketplaceCategoryPillsProps> = ({
  activePill,
  onSelectPill,
  totalProductsCount,
}) => {
  const { t } = useLanguage();

  const pills = [
    { id: 'all', label: t('marketplace.pill_all'), icon: Layers, count: totalProductsCount },
    { id: 'bestsellers', label: t('marketplace.pill_bestsellers'), icon: Star, badge: 'Popular' },
    { id: 'new', label: t('marketplace.pill_new'), icon: Sparkles, badge: 'New' },
    { id: 'deals', label: t('marketplace.pill_deals'), icon: Flame, badge: 'Deals' },
    { id: 'thinkers', label: "Thinkers' Planet", icon: Brain, color: 'text-[#016ba5]' },
    { id: 'brave', label: 'Brave Planet', icon: Compass, color: 'text-[#fa8221]' },
    { id: 'solvers', label: "Solvers' Planet", icon: Wrench, color: 'text-[#0284c7]' },
    { id: 'heart', label: 'Heart Planet', icon: Heart, color: 'text-[#7C3AED]' },
    { id: 'format-book', label: 'Storybooks', icon: BookOpen },
    { id: 'format-game', label: 'Family Games', icon: Gamepad2 },
  ];

  return (
    <div className="w-full overflow-hidden py-1">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {pills.map((pill) => {
          const isActive = activePill === pill.id;
          const IconComponent = pill.icon;

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onSelectPill(pill.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border shrink-0 cursor-pointer select-none active:scale-95",
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                  : "bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
              )}
            >
              <IconComponent className={cn(
                "w-3.5 h-3.5",
                isActive ? (activePill === 'all' ? 'text-white dark:text-slate-900' : 'text-amber-400 dark:text-amber-500') : (pill.color || 'text-slate-500 dark:text-slate-400')
              )} />
              
              <span>{pill.label}</span>

              {pill.count !== undefined && (
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white dark:bg-slate-800 dark:text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                )}>
                  {pill.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
