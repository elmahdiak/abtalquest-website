import React from 'react';
import { 
  Telescope, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Compass, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import Badge from '../common/Badge';

export const VisionMission: React.FC = () => {
  return (
    <section id="vision-mission" className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-slate-100">
      {/* Soft ambient background surface highlights */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#016ba5]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#fa8221]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <Badge variant="primary" size="md" icon={<Compass className="w-4 h-4" />}>
            Purpose & Foundation
          </Badge>
          
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mt-4 mb-5">
            Our Guiding Compass
          </h2>

          <p className="font-body text-sm sm:text-base text-[#64748B] leading-relaxed">
            Every quest, interaction, and sound in AbtalQuest is designed with a singular, uncompromising purpose: protecting innocent childhood and inspiring noble growth.
          </p>
        </div>

        {/* Clean Two-Card Layout with Soft Background Surfaces & Generous Spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: VISION CARD (Soft Blue / Purple Tinted Surface) */}
          <div className="group relative rounded-3xl p-8 sm:p-10 transition-all duration-300 bg-gradient-to-br from-[#016ba5]/[0.04] via-white to-slate-50 border-2 border-[#016ba5]/15 hover:border-[#016ba5]/35 hover:shadow-xl flex flex-col justify-between">
            
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#016ba5]/10 text-[#016ba5] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Telescope className="w-7 h-7" />
                </div>
                <Badge variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                  The Horizon Ahead
                </Badge>
              </div>

              {/* Title using Montserrat */}
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B] mb-4 tracking-tight flex items-center gap-2">
                <span>Our Vision</span>
                <ArrowUpRight className="w-5 h-5 text-[#016ba5] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              {/* Vision Statement Quote */}
              <blockquote className="font-body text-base sm:text-lg text-slate-800 leading-relaxed font-medium bg-white/80 p-5 rounded-2xl border border-[#016ba5]/10 shadow-sm mb-6 relative">
                <span className="text-3xl text-[#016ba5] font-serif absolute -top-2 left-2 opacity-30 select-none">“</span>
                <p className="relative z-10 pl-3">
                  To create a world where every child becomes a hero of their own life, resilient, kind, and ready for real-world challenges...
                </p>
              </blockquote>

              {/* Strategic Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Inner Resilience & Grit
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Cultivating patience (Sabr) and courage to overcome daily hurdles without fear.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Kindness as Superpower
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Rewarding empathy, truthfulness, and community solidarity over destructive competition.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#016ba5] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Real-World Character Readiness
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Nurturing curious thinkers who apply virtuous habits in family and school life.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Accent */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-body text-[#016ba5] font-semibold">
              <span>Goal: 10 Million Empowered Children</span>
              <span className="font-gamification text-sm text-[#7C3AED]">Abtal Global Impact</span>
            </div>

          </div>

          {/* Card 2: MISSION CARD (Soft Orange / Green Tinted Surface) */}
          <div className="group relative rounded-3xl p-8 sm:p-10 transition-all duration-300 bg-gradient-to-br from-[#fa8221]/[0.04] via-white to-slate-50 border-2 border-[#fa8221]/20 hover:border-[#fa8221]/40 hover:shadow-xl flex flex-col justify-between">
            
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#fa8221]/10 text-[#fa8221] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Target className="w-7 h-7" />
                </div>
                <Badge variant="secondary" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  Our Daily Action
                </Badge>
              </div>

              {/* Title using Montserrat */}
              <h3 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#1E293B] mb-4 tracking-tight flex items-center gap-2">
                <span>Our Mission</span>
                <ArrowUpRight className="w-5 h-5 text-[#fa8221] opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>

              {/* Mission Statement Quote */}
              <blockquote className="font-body text-base sm:text-lg text-slate-800 leading-relaxed font-medium bg-white/80 p-5 rounded-2xl border border-[#fa8221]/15 shadow-sm mb-6 relative">
                <span className="text-3xl text-[#fa8221] font-serif absolute -top-2 left-2 opacity-30 select-none">“</span>
                <p className="relative z-10 pl-3">
                  To protect children from harmful content and empower them to grow through joyful, values-based challenges...
                </p>
              </blockquote>

              {/* Strategic Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Impenetrable Digital Sanctuary
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Zero commercial advertising, zero violence, zero dark patterns, and strict COPPA privacy compliance.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Joyful, Value-Driven Play
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Turning moral choices, wisdom stories, and creative quests into delightfully rewarding achievements.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-headline font-bold text-sm text-slate-800 block">
                      Parent Partnership & Peace of Mind
                    </span>
                    <span className="font-body text-xs text-[#64748B] leading-normal">
                      Transparent dashboards with healthy time boundaries that strengthen the family bond.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Accent */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-body text-[#fa8221] font-semibold">
              <span>Standard: Zero Commercial Ads</span>
              <span className="font-gamification text-sm text-[#22C55E]">100% Values-Safe</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default VisionMission;
