import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface ParentStory {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarInitials: string;
  avatarBg: string;
  quote: string;
  rating: number;
  badge: string;
  planetHighlight?: string;
  isReservedPlaceholder?: boolean;
}

export const DEFAULT_PARENT_STORIES: ParentStory[] = [
  {
    id: 'story-1',
    name: 'Sarah Mansouri',
    role: 'Mother of 8yo Youssef',
    location: 'Casablanca',
    avatarInitials: 'SM',
    avatarBg: 'from-[#016ba5] to-[#38BDF8]',
    quote: 'My son used to spend hours on passive video streams. With AbtalQuest, screen time shifted into daily active missions. He now builds offline science projects and proudly records his quest streak!',
    rating: 5,
    badge: 'Verified Family',
    planetHighlight: 'Planet Courage',
  },
  {
    id: 'story-2',
    name: 'Karim Benali',
    role: 'Father of 7 & 10yo sisters',
    location: 'Rabat',
    avatarInitials: 'KB',
    avatarBg: 'from-[#fa8221] to-[#f97316]',
    quote: 'The offline mission cards are pure brilliance. Instead of arguing over device limits, the app naturally sends the kids into the living room to collaborate on creative real-world challenges.',
    rating: 5,
    badge: 'Verified Family',
    planetHighlight: 'Planet Empathy',
  },
  {
    id: 'story-3',
    name: 'Dr. Nadia Lahlou',
    role: 'Pediatrician & Mother',
    location: 'Marrakech',
    avatarInitials: 'NL',
    avatarBg: 'from-[#7C3AED] to-[#a855f7]',
    quote: 'Finding a developmental platform without predatory dark patterns, ads, or endless dopamine traps is rare. AbtalQuest sets an inspiring benchmark for a mindful digital childhood.',
    rating: 5,
    badge: 'Community Ambassador',
    planetHighlight: 'Digital Wellbeing',
  },
  {
    id: 'story-4',
    name: 'Omar Tazi',
    role: 'Father of 9yo Lina',
    location: 'Tangier',
    avatarInitials: 'OT',
    avatarBg: 'from-[#0284c7] to-[#06b6d4]',
    quote: 'The Explorer Mission Kit arrived in 48 hours. Pairing tactile planetary maps with the mobile storyline gave Lina an immense sense of purpose. She has not missed a reading quest in 3 weeks!',
    rating: 5,
    badge: 'Kit Explorer',
    planetHighlight: 'Explorer Kit',
  },
  {
    id: 'story-5',
    name: 'Fatima-Zahra El Idrissi',
    role: 'Elementary Educator & Mother',
    location: 'Fes',
    avatarInitials: 'FZ',
    avatarBg: 'from-[#10b981] to-[#14b8a6]',
    quote: 'The parental oversight dashboard gives me clear insights without feeling like surveillance. I can see the exact values and life skills being practiced in every mission.',
    rating: 5,
    badge: 'Verified Family',
    planetHighlight: 'Planet Wisdom',
  },
  {
    id: 'story-6',
    name: 'Mehdi & Yasmine K.',
    role: 'Parents of 6 & 8yo boys',
    location: 'Agadir',
    avatarInitials: 'MY',
    avatarBg: 'from-[#f59e0b] to-[#ea580c]',
    quote: 'Screen time in our home used to cause friction. Now it is a calm 20-minute daily quest that sparks offline drawing, journaling, and family conversations around the dinner table.',
    rating: 5,
    badge: 'Family Quest',
    planetHighlight: 'Family Bundle',
  },
  {
    id: 'story-7',
    name: 'AbtalQuest Family Circle',
    role: 'Awaiting Approved Quote',
    location: 'Community Beta',
    avatarInitials: 'AQ',
    avatarBg: 'from-[#016ba5] via-[#fa8221] to-[#7C3AED]',
    quote: 'Your approved parent story will appear here. We regularly review stories submitted by parents testing our upcoming seasonal kits, missions, and developmental worlds.',
    rating: 5,
    badge: 'Real Story Reserved',
    isReservedPlaceholder: true,
  },
];

interface ParentStoriesSectionProps {
  stories?: ParentStory[];
}

export const ParentStoriesSection: React.FC<ParentStoriesSectionProps> = ({
  stories = DEFAULT_PARENT_STORIES,
}) => {
  const { t } = useLanguage();

  return (
    <section 
      id="parent-stories" 
      className="group py-20 sm:py-28 bg-[#F8FAFC] dark:bg-[#06152B] text-slate-900 dark:text-white relative overflow-hidden border-b border-slate-100 dark:border-slate-800 transition-colors"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#016ba5]/8 dark:bg-[#016ba5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#fa8221]/6 dark:bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5FB] dark:bg-[#016ba5]/20 border border-[#016ba5]/30 text-[#016ba5] dark:text-[#38BDF8] font-headline text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#fa8221]" />
            <span>{t('parent_stories.eyebrow')}</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-4 leading-tight">
            {t('parent_stories.title')}
          </h2>
          <p className="font-body text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t('parent_stories.subtitle')}
          </p>
        </div>
      </div>

      {/* Infinite Horizontal Scrolling Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left Edge Gradient Fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-r from-[#F8FAFC] dark:from-[#06152B] to-transparent z-20" />
        
        {/* Right Edge Gradient Fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 md:w-36 bg-gradient-to-l from-[#F8FAFC] dark:from-[#06152B] to-transparent z-20" />

        {/* Marquee Track (Double clone for continuous infinite loop) */}
        <div className="flex w-max select-none py-2">
          {/* Primary Track Set */}
          <div className="flex shrink-0 items-stretch gap-6 pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {stories.map((story) => (
              <StoryCard key={`primary-${story.id}`} story={story} />
            ))}
          </div>

          {/* Duplicate Track Set (Exact replica for seamless infinite loop) */}
          <div 
            className="flex shrink-0 items-stretch gap-6 pe-6 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            aria-hidden="true"
          >
            {stories.map((story) => (
              <StoryCard key={`duplicate-${story.id}`} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface StoryCardProps {
  story: ParentStory;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div
      className={`w-[320px] sm:w-[380px] md:w-[420px] shrink-0 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group/card ${
        story.isReservedPlaceholder
          ? 'bg-slate-50/90 dark:bg-[#0A1C36]/70 border-2 border-dashed border-slate-300 dark:border-[#1E3A60] shadow-sm'
          : 'bg-white dark:bg-[#0A1C36] border border-slate-200/80 dark:border-[#1E3A60] shadow-card-soft hover:shadow-card-hover dark:shadow-xl dark:hover:border-[#38BDF8]/40 hover:-translate-y-1'
      }`}
    >
      {/* Top Bar: 5-Star Rating & Decorative Quotes */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1 text-[#fa8221]" aria-label={`${story.rating} out of 5 stars`}>
          {[...Array(story.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#fa8221] text-[#fa8221]" />
          ))}
        </div>
        <div className="text-[#fa8221]/30 dark:text-[#fa8221]/45 font-serif text-3xl font-black leading-none select-none">
          &ldquo;&ldquo;
        </div>
      </div>

      {/* Story Quote Body */}
      <div className="flex-1 mb-6">
        <p className="font-headline text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
          &ldquo;{story.quote}&rdquo;
        </p>
      </div>

      {/* Card Footer: Author Credentials & Verification Badge */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${story.avatarBg} text-white font-headline font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm`}
          >
            {story.avatarInitials}
          </div>
          <div className="min-w-0">
            <h4 className="font-headline font-bold text-xs sm:text-sm text-[#0F2A4A] dark:text-white truncate">
              {story.name}
            </h4>
            <p className="font-body text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {story.role} • {story.location}
            </p>
          </div>
        </div>

        <span 
          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-headline font-bold tracking-wide ${
            story.isReservedPlaceholder
              ? 'bg-sky-50 dark:bg-sky-950/40 text-[#0284c7] dark:text-[#38BDF8] border border-sky-200 dark:border-sky-800/60'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50'
          }`}
        >
          {story.badge}
        </span>
      </div>
    </div>
  );
};

export default ParentStoriesSection;
