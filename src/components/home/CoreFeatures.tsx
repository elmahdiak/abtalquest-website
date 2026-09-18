import React from 'react';
import { 
  Film, 
  Compass, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Quote, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export interface FeatureItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: 'gamification' | 'success' | 'secondary';
  icon: React.ReactNode;
  iconBg: string;
  accentBorder: string;
  description: string;
  highlights: string[];
}

const FEATURES: FeatureItem[] = [
  {
    id: 'cartoons',
    title: 'Values-Based Cartoons',
    subtitle: 'Nurturing Visual Storytelling',
    badge: 'Wholesome Animation',
    badgeVariant: 'secondary',
    icon: <Film className="w-8 h-8" />,
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    accentBorder: 'hover:border-[#fa8221]/40 hover:shadow-[0_15px_30px_-5px_rgba(250,130,33,0.2)]',
    description:
      'Handcrafted, gentle animation series teaching courage, honesty, empathy, and gratitude. Zero fast-paced overstimulation, zero commercial product-placements, and zero slapstick cruelty.',
    highlights: [
      'Paced for healthy neural development',
      'Stories rooted in timeless ethical parables',
      'Rich Arab & global cultural wisdom',
    ],
  },
  {
    id: 'quests',
    title: 'Real-Life Quests',
    subtitle: 'Bridging Screen to Home',
    badge: 'Hands-On Action',
    badgeVariant: 'gamification',
    icon: <Compass className="w-8 h-8" />,
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    accentBorder: 'hover:border-[#7C3AED]/40 hover:shadow-[0_15px_30px_-5px_rgba(124,58,237,0.2)]',
    description:
      'Digital achievements unlock only when children perform kind, real-world acts: helping parents tidy up, caring for plants, reading physical books, or comforting a sad sibling.',
    highlights: [
      'Parent verification system for earned badges',
      'Transforms passive watching into active service',
      'Rewards patience (Sabr) and daily responsibility',
    ],
  },
  {
    id: 'social',
    title: 'Safe Social Adventures',
    subtitle: 'Friendship Without Toxicity',
    badge: '100% Protected Community',
    badgeVariant: 'success',
    icon: <Users className="w-8 h-8" />,
    iconBg: 'bg-[#22C55E]/10 text-[#16a34a]',
    accentBorder: 'hover:border-[#22C55E]/40 hover:shadow-[0_15px_30px_-5px_rgba(34,197,94,0.2)]',
    description:
      'Cooperative multiplayer where young heroes solve group puzzles together. Free from open text chats, bullying, or stranger risks through curated heroic emotes and team objectives.',
    highlights: [
      'Curated uplifting emote communication',
      'Zero open chats, direct messages, or photo sharing',
      'Strict AI moderation and educator oversight',
    ],
  },
];

export const CoreFeatures: React.FC = () => {
  return (
    <section id="core-features" className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-slate-200">
      {/* Soft ambient lighting */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-[#016ba5]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#fa8221]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" size="md" icon={<Sparkles className="w-4 h-4" />}>
            Built Differently By Design
          </Badge>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mt-4 mb-4">
            Core Features for Heroic Growth
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] leading-relaxed">
            Every feature in AbtalQuest has been vetted by child psychologists and educators to foster genuine moral character rather than digital dopamine addiction.
          </p>
        </div>

        {/* 3 Core Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className={`bg-white rounded-3xl p-8 border-2 border-slate-200/90 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${feat.accentBorder}`}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${feat.iconBg} flex items-center justify-center shadow-sm`}>
                    {feat.icon}
                  </div>
                  <Badge variant={feat.badgeVariant} size="sm">
                    {feat.badge}
                  </Badge>
                </div>

                {/* Subtitle & Title (Montserrat) */}
                <span className="font-body text-xs font-semibold text-[#016ba5] uppercase tracking-wider block mb-1">
                  {feat.subtitle}
                </span>
                <h3 className="font-headline text-2xl font-extrabold text-[#1E293B] tracking-tight mb-4">
                  {feat.title}
                </h3>

                {/* Description (Roboto Mono) */}
                <p className="font-body text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                  {feat.description}
                </p>

                {/* Key Bullet Highlights */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  {feat.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-body text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="font-body text-xs text-slate-500">
                  Child Safe Standard
                </span>
                <a
                  href="#explore-demo"
                  className="font-headline text-xs font-bold text-[#fa8221] hover:text-[#e87313] inline-flex items-center gap-1 group"
                >
                  Experience It <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Banner: "We didn't want to raise kids in fear. So we built a space for courage!" */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0A2540] via-[#016ba5] to-[#0A2540] p-8 sm:p-12 lg:p-14 text-white shadow-2xl border border-[#016ba5]/40 overflow-hidden">
          {/* Subtle warm decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
          <Quote className="w-24 h-24 text-white/5 absolute -bottom-4 right-8 pointer-events-none select-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 mb-6 shadow-inner">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <blockquote className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug mb-6 text-white">
              “We didn't want to raise kids in fear. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fa8221] via-amber-300 to-[#fa8221]">
                So we built a space for courage!
              </span>”
            </blockquote>

            <div className="flex flex-wrap items-center justify-center gap-3 font-body text-xs sm:text-sm text-slate-300">
              <span className="font-bold text-white">— The AbtalQuest Founding Covenant</span>
              <span>•</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Values-Guaranteed
              </span>
            </div>

            <div className="mt-8">
              <Button
                variant="cta"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => {
                  const el = document.getElementById('explore-demo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Join the Courage Movement
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CoreFeatures;
