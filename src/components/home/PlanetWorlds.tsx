import React, { useState } from 'react';
import { 
  Brain, 
  Cog, 
  BookOpen, 
  Puzzle, 
  Mountain, 
  Shield, 
  Wrench, 
  HelpCircle, 
  Lightbulb, 
  Heart, 
  Users, 
  Sparkles, 
  Star, 
  ArrowRight, 
  X,
  Compass,
  Trophy,
  Zap
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export interface PlanetWorld {
  id: string;
  name: string;
  category: string;
  skill: string;
  levelBadge: string;
  xpReward: string;
  colorGradient: string;
  borderColor: string;
  iconBg: string;
  primaryIcon: React.ReactNode;
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  features: {
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[];
  sampleQuest: {
    title: string;
    task: string;
    virtue: string;
  };
}

const PLANETS: PlanetWorld[] = [
  {
    id: 'thinkers',
    name: "Thinkers' Planet",
    category: 'Cognitive Mastery',
    skill: 'Critical Thinking',
    levelBadge: 'Sector Alpha • Level 1–5',
    xpReward: '+350 XP',
    colorGradient: 'from-[#016ba5]/15 via-[#38BDF8]/10 to-transparent',
    borderColor: 'hover:border-[#016ba5]/50 group-hover:shadow-[0_15px_35px_-5px_rgba(1,107,165,0.25)]',
    iconBg: 'bg-[#016ba5]/10 text-[#016ba5]',
    primaryIcon: <Brain className="w-8 h-8" />,
    tags: ['Puzzles', 'Gears', 'Ancient Books', 'Logic'],
    shortDesc: 'Master deduction, analyze patterns, and unlock ancient mechanisms of thought.',
    fullDesc: 'A soaring archipelago of floating libraries and clockwork observatories. Children solve mechanical riddles, decipher historical manuscripts, and build critical reasoning without algorithmic manipulation.',
    features: [
      { title: 'Clockwork Gear Puzzles', desc: 'Align ratios and sequences to power the Great Oasis water pumps.', icon: <Cog className="w-4 h-4 text-[#016ba5]" /> },
      { title: 'Riddles of the Scribes', desc: 'Identify truth from false claims using evidence and observation.', icon: <BookOpen className="w-4 h-4 text-[#016ba5]" /> },
      { title: 'Pattern Mazes', desc: 'Complete geometric mosaics inspired by timeless art and mathematics.', icon: <Puzzle className="w-4 h-4 text-[#016ba5]" /> },
    ],
    sampleQuest: {
      title: 'The Great Waterwheel Restoration',
      task: 'Restore water to the village orchards by arranging 5 interlocking wooden gears according to their logical torque ratios.',
      virtue: 'Reasoning & Patient Analysis',
    },
  },
  {
    id: 'brave',
    name: 'Brave Planet',
    category: 'Grit & Character',
    skill: 'Resilience (Sabr)',
    levelBadge: 'Highlands • Level 2–6',
    xpReward: '+400 XP',
    colorGradient: 'from-[#fa8221]/15 via-[#FACC15]/10 to-transparent',
    borderColor: 'hover:border-[#fa8221]/50 group-hover:shadow-[0_15px_35px_-5px_rgba(250,130,33,0.25)]',
    iconBg: 'bg-[#fa8221]/10 text-[#fa8221]',
    primaryIcon: <Mountain className="w-8 h-8" />,
    tags: ['Mountains', 'Obstacles', 'Rope Paths', 'Grit'],
    shortDesc: 'Conquer steep summits, balance over windy rope bridges, and build unbreakable grit.',
    fullDesc: 'A dramatic alpine wilderness of misty peaks and sheer cliffs where defeat is merely a stepping stone. Kids learn emotional resilience, patience (Sabr), and how to stand up after falling.',
    features: [
      { title: 'The Rope Bridges of Courage', desc: 'Navigate shaky swaying crossings by focusing on steady, calm steps.', icon: <Zap className="w-4 h-4 text-[#fa8221]" /> },
      { title: 'Mountain Obstacle Trails', desc: 'Calculate safe climbing routes while conserving physical energy.', icon: <Mountain className="w-4 h-4 text-[#fa8221]" /> },
      { title: 'The Beacon of Patience', desc: 'Wait out sudden windstorms safely inside rock shelters without panic.', icon: <Shield className="w-4 h-4 text-[#fa8221]" /> },
    ],
    sampleQuest: {
      title: 'Summit of Mount Sabr',
      task: 'Guide a lost mountain gazelle across a broken suspension bridge by maintaining composure and timing safe crossings between gusts.',
      virtue: 'Emotional Fortitude & Perseverance',
    },
  },
  {
    id: 'solvers',
    name: "Solvers' Planet",
    category: 'Ingenuity & Maker',
    skill: 'Problem-Solving',
    levelBadge: 'Forge Nebula • Level 3–7',
    xpReward: '+450 XP',
    colorGradient: 'from-[#22C55E]/15 via-[#38BDF8]/10 to-transparent',
    borderColor: 'hover:border-[#22C55E]/50 group-hover:shadow-[0_15px_35px_-5px_rgba(34,197,94,0.25)]',
    iconBg: 'bg-[#22C55E]/10 text-[#16a34a]',
    primaryIcon: <Lightbulb className="w-8 h-8" />,
    tags: ['Mazes', 'Hand Tools', 'Glowing Symbols', 'Hacks'],
    shortDesc: 'Navigate labyrinthine ruins, invent custom tools, and follow mysterious glowing question marks.',
    fullDesc: 'A bustling workshop world filled with winding labyrinths and glowing question glyphs. Children disassemble everyday problems into manageable steps and build practical inventive solutions.',
    features: [
      { title: 'Labyrinth of Clues', desc: 'Follow cryptic environmental trails to reach the center of lost citadels.', icon: <HelpCircle className="w-4 h-4 text-[#16a34a]" /> },
      { title: 'The Artisan Workbench', desc: 'Craft wooden pulleys, compasses, and telescopes with interactive tools.', icon: <Wrench className="w-4 h-4 text-[#16a34a]" /> },
      { title: 'Glowing Question Portals', desc: 'Ask the right questions to unlock hidden underground aquifers.', icon: <Lightbulb className="w-4 h-4 text-[#16a34a]" /> },
    ],
    sampleQuest: {
      title: 'The Underground Aquifer Labyrinth',
      task: 'Map three separate underground canals to redirect fresh spring water into drought-affected farmlands using custom crafted wooden sluices.',
      virtue: 'Resourcefulness & Creative Solutions',
    },
  },
  {
    id: 'heart',
    name: 'Heart Planet',
    category: 'Empathy & Community',
    skill: 'Values & Empathy',
    levelBadge: 'Oasis Garden • Level 1–8',
    xpReward: '+500 XP',
    colorGradient: 'from-[#7C3AED]/15 via-[#fa8221]/10 to-transparent',
    borderColor: 'hover:border-[#7C3AED]/50 group-hover:shadow-[0_15px_35px_-5px_rgba(124,58,237,0.25)]',
    iconBg: 'bg-[#7C3AED]/10 text-[#7C3AED]',
    primaryIcon: <Heart className="w-8 h-8" />,
    tags: ['Empathy', 'Kindness', 'Teamwork', 'Smiling Kids'],
    shortDesc: 'Cooperate with companions, share bounties, and experience the warmth of mutual care.',
    fullDesc: 'A blossoming sanctuary of mutual support, laughter, and community gardens. Here, real strength is measured by how gently you treat the weak, how honestly you speak, and how well you work together.',
    features: [
      { title: 'The Community Harvest', desc: 'Coordinate with virtual companions to gather and distribute fruits to all elders.', icon: <Users className="w-4 h-4 text-[#7C3AED]" /> },
      { title: 'The Listening Pavilion', desc: 'Listen to heartfelt neighbor stories and identify how best to soothe their sorrows.', icon: <Heart className="w-4 h-4 text-[#7C3AED]" /> },
      { title: 'Bridges of Reconciliation', desc: 'Resolve character disputes using peaceful communication and truthful apology.', icon: <Sparkles className="w-4 h-4 text-[#7C3AED]" /> },
    ],
    sampleQuest: {
      title: 'The Shared Feast of Gratitude',
      task: 'Organize a village banquet where every child contributes an act of service, ensuring no family goes without shelter or joyful celebration.',
      virtue: 'Compassion, Empathy & Altruism',
    },
  },
];

export const PlanetWorlds: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetWorld | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const filteredPlanets = activeTab === 'all' 
    ? PLANETS 
    : PLANETS.filter(p => p.id === activeTab);

  return (
    <section id="planet-worlds" className="py-20 sm:py-28 bg-slate-50/70 dark:bg-[#071727] relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      {/* Subtle cosmic decorative backdrop */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge 
            variant="gamification" 
            size="md" 
            icon={<Sparkles className="w-4 h-4" />}
            className="mb-3"
          >
            AbtalQuest Galaxy Map
          </Badge>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] dark:text-white tracking-tight mb-4">
            Explore the Planet Worlds
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] dark:text-slate-300 leading-relaxed">
            Four distinct life-skill realms crafted without violence, where every puzzle builds character, resilience, and compassionate wisdom.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-[#016ba5] text-white shadow-brand'
                  : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Worlds (4)
            </button>
            {PLANETS.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`font-headline text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === p.id
                    ? 'bg-[#016ba5] text-white shadow-brand'
                    : 'bg-white dark:bg-[#0F2F4E] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Interactive Planet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {filteredPlanets.map((planet) => (
            <div
              key={planet.id}
              onClick={() => setSelectedPlanet(planet)}
              className={`group relative bg-white dark:bg-[#0F2F4E] rounded-3xl p-6 sm:p-7 border-2 border-slate-200/90 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between overflow-hidden ${planet.borderColor}`}
            >
              {/* Soft Gradient Aura at top of card */}
              <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${planet.colorGradient} pointer-events-none rounded-t-3xl`} />

              <div>
                {/* Gamification Accent Level Badge (#7C3AED) */}
                <div className="flex items-center justify-between gap-2 mb-5 relative z-10">
                  <Badge 
                    variant="gamification" 
                    size="sm" 
                    icon={<Star className="w-3.5 h-3.5 fill-current" />}
                    className="shadow-sm font-gamification"
                  >
                    {planet.levelBadge}
                  </Badge>
                  
                  <span className="font-gamification text-xs font-bold text-[#7C3AED] bg-[#7C3AED]/10 px-2 py-0.5 rounded-full">
                    {planet.xpReward}
                  </span>
                </div>

                {/* Planet Illustration & Icon */}
                <div className="relative mb-5 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-[#0A2540] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-center relative group-hover:scale-110 transition-transform duration-300">
                    <div className={`w-14 h-14 rounded-2xl ${planet.iconBg} flex items-center justify-center shadow-inner`}>
                      {planet.primaryIcon}
                    </div>
                  </div>
                </div>

                {/* Planet Name (Montserrat) */}
                <div className="text-center mb-3">
                  <span className="font-body text-[11px] font-semibold uppercase tracking-wider text-[#016ba5] dark:text-[#38BDF8] block mb-1">
                    {planet.category}
                  </span>
                  <h3 className="font-headline text-xl font-extrabold text-[#1E293B] dark:text-white group-hover:text-[#016ba5] dark:group-hover:text-[#fa8221] transition-colors">
                    {planet.name}
                  </h3>
                </div>

                {/* Primary Skill Callout */}
                <div className="bg-slate-50 dark:bg-[#0A2540] rounded-xl py-2 px-3 text-center border border-slate-100 dark:border-slate-700 mb-4">
                  <span className="font-body text-xs text-slate-500 dark:text-slate-400 block">Core Life Skill</span>
                  <span className="font-headline font-bold text-sm text-slate-800 dark:text-slate-200">
                    {planet.skill}
                  </span>
                </div>

                {/* Short Description (Roboto Mono) */}
                <p className="font-body text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-4 text-center">
                  {planet.shortDesc}
                </p>

                {/* Visual thematic tags */}
                <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                  {planet.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="font-body text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Interactive CTA Button (#fa8221 Secondary CTA) */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between relative z-10">
                <span className="font-body text-[11px] text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
                  Tap to Inspect
                </span>
                <span className="inline-flex items-center gap-1 font-headline text-xs font-bold text-[#fa8221] group-hover:translate-x-1 transition-transform">
                  Enter Planet <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Planet Interactive Modal / Inspector Drawer */}
        {selectedPlanet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div 
              className="relative w-full max-w-2xl bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Top Header with Planet Gradient */}
              <div className={`p-6 sm:p-8 bg-gradient-to-r ${selectedPlanet.colorGradient} border-b border-slate-200 dark:border-slate-700 flex items-start justify-between relative`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedPlanet.iconBg} flex items-center justify-center shadow-md`}>
                    {selectedPlanet.primaryIcon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="gamification" size="sm" icon={<Star className="w-3 h-3 fill-current" />}>
                        {selectedPlanet.levelBadge}
                      </Badge>
                      <span className="font-gamification text-xs text-[#7C3AED] font-bold bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full">
                        {selectedPlanet.xpReward}
                      </span>
                    </div>
                    <h3 className="font-headline text-2xl sm:text-3xl font-black text-[#1E293B] dark:text-white">
                      {selectedPlanet.name}
                    </h3>
                    <span className="font-body text-xs text-slate-600 dark:text-slate-300">
                      Focus: <strong className="text-[#016ba5] dark:text-[#38BDF8]">{selectedPlanet.skill}</strong>
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanet(null)}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-body text-xs">
                
                {/* Description */}
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#1E293B] dark:text-white mb-2 uppercase tracking-wide">
                    World Overview
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedPlanet.fullDesc}
                  </p>
                </div>

                {/* Key Gameplay Features */}
                <div>
                  <h4 className="font-headline text-sm font-bold text-[#1E293B] dark:text-white mb-3 uppercase tracking-wide">
                    Thematic Challenges & Mechanics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedPlanet.features.map((feat, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A2540] border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex-shrink-0">
                            {feat.icon}
                          </div>
                          <span className="font-headline font-bold text-xs text-slate-800 dark:text-slate-200">
                            {feat.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Active Quest Preview */}
                <div className="p-5 rounded-2xl bg-[#0A2540] text-white border border-[#016ba5]/40 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                      <Trophy className="w-4 h-4 text-amber-400" /> Signature Quest
                    </span>
                    <Badge variant="secondary" size="sm">
                      Interactive Simulation
                    </Badge>
                  </div>

                  <h5 className="font-headline text-base font-bold text-white mb-1.5">
                    {selectedPlanet.sampleQuest.title}
                  </h5>

                  <p className="text-slate-300 text-xs leading-relaxed mb-3">
                    "{selectedPlanet.sampleQuest.task}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                    <span>Target Virtue: <strong className="text-[#22C55E]">{selectedPlanet.sampleQuest.virtue}</strong></span>
                    <span className="text-amber-300 font-bold">{selectedPlanet.xpReward}</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A2540] border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedPlanet(null)}
                  className="font-headline text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
                >
                  Return to Galaxy Map
                </button>

                <Button
                  variant="cta"
                  size="md"
                  icon={<Compass className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={() => {
                    setSelectedPlanet(null);
                    const el = document.getElementById('explore-demo');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Launch Quest on {selectedPlanet.name}
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PlanetWorlds;
