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
  Gamepad2,
  Tag,
  Shield,
  type LucideIcon
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import type { ProductCategory } from '../../services/marketplaceService';

export interface MarketplaceCategoryPillsProps {
  activePill: string;
  onSelectPill: (pillKey: string) => void;
  totalProductsCount: number;
  categories?: ProductCategory[];
  categoryCounts?: Record<string, number>;
}

const resolveIcon = (iconName?: string): LucideIcon => {
  switch (iconName?.toLowerCase()) {
    case 'brain':
      return Brain;
    case 'compass':
      return Compass;
    case 'wrench':
      return Wrench;
    case 'heart':
      return Heart;
    case 'bookopen':
    case 'book':
      return BookOpen;
    case 'gamepad2':
    case 'game':
      return Gamepad2;
    case 'sparkles':
      return Sparkles;
    case 'shield':
      return Shield;
    case 'layers':
      return Layers;
    case 'flame':
      return Flame;
    default:
      return Tag;
  }
};

export interface CategoryPillItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  customColor?: string;
  count?: number;
  badge?: string;
}

export const MarketplaceCategoryPills: React.FC<MarketplaceCategoryPillsProps> = ({
  activePill,
  onSelectPill,
  totalProductsCount,
  categories = [],
  categoryCounts = {},
}) => {
  const { t } = useLanguage();

  // Standard preset quick filters
  const standardPills: CategoryPillItem[] = [
    { id: 'all', label: t('marketplace.pill_all'), icon: Layers, count: totalProductsCount },
    { id: 'bestsellers', label: t('marketplace.pill_bestsellers'), icon: Star, badge: 'Popular' },
    { id: 'new', label: t('marketplace.pill_new'), icon: Sparkles, badge: 'New' },
    { id: 'deals', label: t('marketplace.pill_deals'), icon: Flame, badge: 'Deals' },
  ];

  // Dynamic pills mapped from database categories
  const dynamicPills: CategoryPillItem[] = categories.map((cat) => ({
    id: cat.slug || cat.id,
    label: cat.name,
    icon: resolveIcon(cat.icon),
    color: cat.accentColor ? undefined : 'text-[#016ba5]',
    customColor: cat.accentColor,
    count: categoryCounts[cat.id] ?? categoryCounts[cat.slug],
  }));

  const fallbackPills: CategoryPillItem[] = [
    ...standardPills,
    { id: 'thinkers', label: "Thinkers' Planet", icon: Brain, color: 'text-[#016ba5]', customColor: '#016ba5' },
    { id: 'brave', label: 'Brave Planet', icon: Compass, color: 'text-[#fa8221]', customColor: '#fa8221' },
    { id: 'solvers', label: "Solvers' Planet", icon: Wrench, color: 'text-[#0284c7]', customColor: '#0284c7' },
    { id: 'heart', label: 'Heart Planet', icon: Heart, color: 'text-[#7C3AED]', customColor: '#7C3AED' },
    { id: 'books', label: 'Storybooks', icon: BookOpen, customColor: '#059669' },
    { id: 'games', label: 'Family Games', icon: Gamepad2, customColor: '#DC2626' },
  ];

  const pills: CategoryPillItem[] = dynamicPills.length > 0 ? [...standardPills, ...dynamicPills] : fallbackPills;

  return (
    <div className="w-full overflow-hidden py-1">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth -mx-3 px-3 sm:mx-0 sm:px-0">
        {pills.map((pill) => {
          const isActive = activePill === pill.id;
          const IconComponent = pill.icon;

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onSelectPill(pill.id)}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border shrink-0 cursor-pointer select-none active:scale-95",
                isActive
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                  : "bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
              )}
            >
              <IconComponent 
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  isActive ? (activePill === 'all' ? 'text-white dark:text-slate-900' : 'text-amber-400 dark:text-amber-500') : (pill.color || 'text-slate-500 dark:text-slate-400')
                )} 
                style={{ color: !isActive && pill.customColor ? pill.customColor : undefined }}
              />
              
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
