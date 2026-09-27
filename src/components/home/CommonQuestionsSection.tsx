import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FaqItem {
  question: string;
  answer: string;
}

export const CommonQuestionsSection: React.FC = () => {
  const { t } = useLanguage();

  const faqs: FaqItem[] = [
    {
      question: t('common_questions.q1'),
      answer: t('common_questions.a1'),
    },
    {
      question: t('common_questions.q2'),
      answer: t('common_questions.a2'),
    },
    {
      question: t('common_questions.q3'),
      answer: t('common_questions.a3'),
    },
    {
      question: t('common_questions.q4'),
      answer: t('common_questions.a4'),
    },
    {
      question: t('common_questions.q5'),
      answer: t('common_questions.a5'),
    },
    {
      question: t('common_questions.q6'),
      answer: t('common_questions.a6'),
    },
    {
      question: t('common_questions.q7'),
      answer: t('common_questions.a7'),
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
            {t('common_questions.eyebrow')}
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F2A4A] dark:text-white tracking-tight">
            {t('common_questions.title')}
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
