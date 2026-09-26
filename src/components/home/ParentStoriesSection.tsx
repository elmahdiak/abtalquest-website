import React from 'react';

export const ParentStoriesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#06152B] text-white relative overflow-hidden border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#016ba5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#fa8221]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-left rtl:text-right">
          <span className="font-headline text-xs sm:text-sm font-bold text-[#38BDF8] uppercase tracking-wider block mb-3">
            PARENT STORIES
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Real experiences.<br />Shared by families.
          </h2>
          <p className="font-body text-base text-slate-300 leading-relaxed font-normal">
            This space is ready for genuine stories from parents. Approved quotes will be published here exactly as shared.
          </p>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Reserved Story Card 1 */}
          <div className="bg-[#0A1C36] rounded-3xl p-8 border border-[#1E3A60] shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#38BDF8]/40 transition-colors">
            <div>
              {/* Orange Quotation Icon */}
              <div className="text-[#fa8221] font-serif text-4xl sm:text-5xl font-black leading-none mb-4 select-none">
                &ldquo;&ldquo;
              </div>

              <p className="font-headline text-lg sm:text-xl font-medium text-slate-200 leading-relaxed mb-8">
                Your approved parent story will appear here.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80">
              <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#38BDF8] block">
                REAL STORY RESERVED
              </span>
              <span className="font-body text-xs text-slate-400 mt-1 block">
                Awaiting an approved quote
              </span>
            </div>
          </div>

          {/* Reserved Story Card 2 */}
          <div className="bg-[#0A1C36] rounded-3xl p-8 border border-[#1E3A60] shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#38BDF8]/40 transition-colors">
            <div>
              <div className="text-[#fa8221] font-serif text-4xl sm:text-5xl font-black leading-none mb-4 select-none">
                &ldquo;&ldquo;
              </div>

              <p className="font-headline text-lg sm:text-xl font-medium text-slate-200 leading-relaxed mb-8">
                Your approved parent story will appear here.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80">
              <span className="font-headline text-xs font-bold uppercase tracking-wider text-[#38BDF8] block">
                REAL STORY RESERVED
              </span>
              <span className="font-body text-xs text-slate-400 mt-1 block">
                Awaiting an approved quote
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ParentStoriesSection;
