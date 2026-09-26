import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const CommonQuestionsSection: React.FC = () => {
  const faqs: FaqItem[] = [
    {
      question: 'What is AbtalQuest?',
      answer:
        'AbtalQuest is a child-centered digital experience that turns screen time into stories, quests and real-world missions designed to encourage action and growth.',
    },
    {
      question: 'What age is it designed for?',
      answer:
        'The current experience is being designed for children ages 7–10. Age ranges may evolve as the product is tested with families.',
    },
    {
      question: 'Is it a game or an educational app?',
      answer:
        'It uses the joy of games and stories, but it is designed as a broader developmental journey—not a school replacement or a traditional game.',
    },
    {
      question: 'How are parents involved?',
      answer:
        'Parents receive guidance they can apply at home—helping them strengthen their relationship with their child and nurture confidence, autonomy, resilience and emotional skills.',
    },
    {
      question: 'How does it encourage real-world activity?',
      answer:
        'Digital quests lead to simple missions children can try at home and in daily life, connecting discovery on screen with action beyond it.',
    },
    {
      question: 'How does AbtalQuest approach privacy?',
      answer:
        'Child safety and privacy are core design priorities. Full policies and product details will be published before public release.',
    },
    {
      question: 'Which devices will it support?',
      answer:
        'Final device availability and store links will be announced before launch.',
    },
  ];

  // Keep first open by default or all closed with smooth toggling
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#F4F9FD]/50 dark:bg-[#071727] relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left rtl:text-right mb-12 sm:mb-16">
          <span className="font-headline text-xs sm:text-sm font-bold text-[#0284c7] uppercase tracking-wider block mb-3">
            COMMON QUESTIONS
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight">
            A clear view for families.
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0c2238] rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left rtl:text-right gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-headline text-lg sm:text-xl font-bold text-[#0F2A4A] dark:text-white">
                    {faq.question}
                  </span>
                  
                  {/* Plus / Close Icon in Vibrant Blue */}
                  <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/80 text-[#0284c7] flex items-center justify-center shrink-0 transition-transform duration-200">
                    {isOpen ? (
                      <X className="w-5 h-5 text-[#0284c7] stroke-[2.5]" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#0284c7] stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-left rtl:text-right animate-fadeIn">
                    <p className="font-body text-base text-[#475569] dark:text-slate-300 leading-relaxed font-normal">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CommonQuestionsSection;
