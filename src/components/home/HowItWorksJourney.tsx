import React from 'react';
import { 
  Compass, 
  BookOpen, 
  Sprout, 
  Star, 
  RotateCw 
} from 'lucide-react';

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HowItWorksJourney: React.FC = () => {
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Discover',
      description: 'Children enter a world shaped around curiosity and exploration.',
      icon: <Compass className="w-6 h-6 text-[#0284c7]" />,
    },
    {
      number: '02',
      title: 'Quest',
      description: 'They receive thoughtful, age-appropriate challenges and missions.',
      icon: <BookOpen className="w-6 h-6 text-[#0284c7]" />,
    },
    {
      number: '03',
      title: 'Act',
      description: 'Digital engagement becomes meaningful action in everyday life.',
      icon: <Sprout className="w-6 h-6 text-[#0284c7]" />,
    },
    {
      number: '04',
      title: 'Grow',
      description: 'Skills, habits and confidence develop through repeated practice.',
      icon: <Star className="w-6 h-6 text-[#0284c7]" />,
    },
    {
      number: '05',
      title: 'Progress',
      description: 'The journey evolves as the child grows and discovers more.',
      icon: <RotateCw className="w-6 h-6 text-[#0284c7]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-[#EBF5FB]/70 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight leading-tight mb-4">
            A digital journey designed<br className="hidden sm:inline" /> to lead somewhere real.
          </h2>
          <p className="font-body text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
            AbtalQuest connects engaging experiences with simple actions children can try in everyday life.
          </p>
        </div>

        {/* 5-Step Connected Timeline */}
        <div className="relative">
          
          {/* Subtle vertical connecting line */}
          <div className="hidden md:block absolute left-[54px] rtl:left-auto rtl:right-[54px] top-8 bottom-12 w-0.5 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-100 dark:from-sky-900 dark:via-sky-800 dark:to-transparent" />

          <div className="space-y-8 sm:space-y-10">
            {steps.map((step) => (
              <div 
                key={step.number}
                className="group relative flex flex-col md:flex-row items-start gap-4 sm:gap-6 bg-slate-50/60 dark:bg-[#0c2238]/60 hover:bg-white dark:hover:bg-[#0c2238] p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-700/60 hover:border-sky-200 dark:hover:border-sky-700 hover:shadow-card-soft transition-all duration-300"
              >
                {/* Step Number in Orange Accent */}
                <div className="flex items-center gap-3 md:flex-col md:items-center md:justify-center shrink-0">
                  <span className="font-headline font-black text-xl sm:text-2xl text-[#fa8221] tracking-tight">
                    {step.number}
                  </span>

                  {/* Circular Icon in soft sky circle */}
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-sky-200/70 transition-all duration-300">
                    {step.icon}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1 text-left rtl:text-right">
                  <h3 className="font-headline text-2xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-2 group-hover:text-[#016ba5] dark:group-hover:text-[#38bdf8] transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-body text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default HowItWorksJourney;
