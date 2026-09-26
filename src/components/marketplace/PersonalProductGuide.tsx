import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  RotateCcw, 
  Check
} from 'lucide-react';
import type { Product } from '../../services/marketplaceService';
import { formatPrice, getProductDisplayImage } from '../../services/marketplaceService';
import { useLanguage } from '../../context/LanguageContext';

export interface PersonalProductGuideProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cartIds: string[];
}

interface MatchResult {
  product: Product;
  score: number;
  matchReason: string;
}

export const PersonalProductGuide: React.FC<PersonalProductGuideProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  cartIds,
}) => {
  const { language } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const promptSuggestions = [
    { label: 'Building & robotics', text: 'Loves taking things apart, building models with gears and understanding how machines work.' },
    { label: 'Nature & outdoor courage', text: 'Enjoys hiking in the forest, scavenger hunts, and taking brave physical challenges outdoors.' },
    { label: 'Logic, coding & riddles', text: 'Fascinated by puzzles, sequential patterns, math puzzles, and solving complex challenges.' },
    { label: 'Family games & kindness', text: 'Needs screen-free family time where we can cooperate together and practice sharing and patience.' },
    { label: 'Stories & bedtime tales', text: 'Passionate reader who loves adventure chronicles, heroes with moral courage, and grand lore.' },
  ];

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = inputText.toLowerCase();

      // Semantic keyword dictionaries
      const keywords = {
        thinkers: ['build', 'gear', 'wheel', 'clockwork', 'machine', 'wood', 'stem', 'mechanic', 'engineer', 'waterwheel', 'assemble'],
        brave: ['outdoor', 'trail', 'nature', 'hike', 'camp', 'compass', 'courage', 'brave', 'adventur', 'mountain', 'resilien', 'calm', 'explorer'],
        solvers: ['logic', 'puzzle', 'code', 'coding', 'algorithm', 'robot', 'hydraulic', 'fluid', 'sequence', 'math', 'riddle', 'deck', 'pattern'],
        heart: ['family', 'game', 'cooperat', 'kind', 'kindness', 'share', 'empathy', 'gratitude', 'lantern', 'together', 'sibling', 'ritual', 'quest'],
        books: ['read', 'book', 'story', 'tales', 'scribe', 'chronicle', 'wisdom', 'hero', 'moral', 'astronomy', 'lore'],
      };

      const scored = products.map((prod) => {
        let score = 50; // base score
        let matchedKeywords: string[] = [];

        // Check category affiliation
        if (prod.category === 'thinkers') {
          keywords.thinkers.forEach((k) => {
            if (lower.includes(k)) { score += 15; matchedKeywords.push(k); }
          });
        }
        if (prod.category === 'brave') {
          keywords.brave.forEach((k) => {
            if (lower.includes(k)) { score += 15; matchedKeywords.push(k); }
          });
        }
        if (prod.category === 'solvers') {
          keywords.solvers.forEach((k) => {
            if (lower.includes(k)) { score += 15; matchedKeywords.push(k); }
          });
        }
        if (prod.category === 'heart') {
          keywords.heart.forEach((k) => {
            if (lower.includes(k)) { score += 15; matchedKeywords.push(k); }
          });
        }
        if (prod.category === 'books' || prod.productType?.toLowerCase().includes('book')) {
          keywords.books.forEach((k) => {
            if (lower.includes(k)) { score += 15; matchedKeywords.push(k); }
          });
        }

        // Cross-check tags & skills
        prod.tags.forEach((tag) => {
          if (lower.includes(tag.toLowerCase())) { score += 10; }
        });
        prod.skillsLearned.forEach((s) => {
          if (lower.includes(s.name.toLowerCase())) { score += 12; }
        });

        // Determine customized match rationale
        let matchReason = 'Matched based on your child’s developmental interests.';
        if (prod.category === 'thinkers' || lower.includes('build')) {
          matchReason = 'Matched for hands-on building, physical mechanics, and focus.';
        } else if (prod.category === 'brave' || lower.includes('outdoor')) {
          matchReason = 'Matched for outdoor navigation, fortitude, and active resilience.';
        } else if (prod.category === 'solvers' || lower.includes('logic')) {
          matchReason = 'Matched for algorithmic logic, problem solving, and screen-free coding.';
        } else if (prod.category === 'heart' || lower.includes('family')) {
          matchReason = 'Matched for cooperative play, empathetic teamwork, and shared family missions.';
        } else if (prod.category === 'books' || lower.includes('read')) {
          matchReason = 'Matched for rich storytelling, moral reflection, and cultural imagination.';
        }

        const clampedScore = Math.min(99, Math.max(78, score));
        return {
          product: prod,
          score: clampedScore,
          matchReason,
        };
      });

      // Sort descending by match score and pick top 3
      scored.sort((a, b) => b.score - a.score);
      setMatches(scored.slice(0, 3));
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 450);
  };

  const handleReset = () => {
    setInputText('');
    setHasAnalyzed(false);
    setMatches([]);
  };

  return (
    <section className="relative w-full rounded-3xl bg-[#06152B] text-white p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl overflow-hidden bg-star-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#016ba5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fa8221]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Eyebrow matching PDF Page 10 */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-[#38bdf8] text-xs font-black uppercase tracking-wider mb-4 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>PERSONAL PRODUCT GUIDE</span>
        </div>

        {/* Title matching PDF Page 10 */}
        <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
          Tell us what your child enjoys.
        </h2>

        {/* Subtitle matching PDF Page 10 */}
        <p className="font-body text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
          Describe their interests, strengths, or what you would like to practise together. We&apos;ll suggest matching kits from the catalog.
        </p>

        {/* Quick Inspiration Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6 max-w-3xl">
          {promptSuggestions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setInputText(item.text);
                setHasAnalyzed(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            >
              + {item.label}
            </button>
          ))}
        </div>

        {/* Text Input / Textarea */}
        <div className="w-full max-w-2xl relative mb-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g., My 8-year-old loves hands-on building, outdoor discovery, and puzzles, but we want something screen-free that encourages patience..."
            rows={3}
            className="w-full px-5 py-4 rounded-2xl bg-slate-900/90 border border-slate-700 focus:border-[#fa8221] focus:ring-2 focus:ring-[#fa8221]/20 text-white placeholder-slate-400 text-sm sm:text-base outline-none transition-all resize-none shadow-inner"
          />
        </div>

        {/* Action Button: FIND A GOOD MATCH */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!inputText.trim() || isAnalyzing}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] text-white text-sm font-bold uppercase tracking-wider shadow-cta transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <span>ANALYZING INTERESTS...</span>
            ) : (
              <>
                <span>FIND A GOOD MATCH</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {hasAnalyzed && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TRY ANOTHER</span>
            </button>
          )}
        </div>

        {/* Matched Recommendations Result Cards */}
        {hasAnalyzed && matches.length > 0 && (
          <div className="w-full mt-10 text-left rtl:text-right animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                Tailored Recommendations ({matches.length})
              </span>
              <span className="text-xs text-slate-400">
                Based on your child’s unique profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {matches.map(({ product, score, matchReason }) => {
                const img = getProductDisplayImage(product);
                const isInCart = cartIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group bg-slate-900/90 rounded-2xl border border-slate-700 hover:border-[#fa8221] p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg cursor-pointer"
                  >
                    <div>
                      {/* Match Badge & Image */}
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-slate-800">
                        {img ? (
                          <img
                            src={img}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Sparkles className="w-8 h-8 text-[#fa8221]" />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-sm">
                          {score}% MATCH
                        </span>
                      </div>

                      {/* Title & Planet */}
                      <span className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider block mb-1">
                        {product.planetName}
                      </span>
                      <h4 className="font-headline text-sm font-bold text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#fa8221] transition-colors">
                        {product.title}
                      </h4>

                      {/* Rationale pill */}
                      <p className="text-xs text-slate-300 bg-white/5 rounded-lg p-2 mb-3 leading-relaxed border border-white/5">
                        &ldquo;{matchReason}&rdquo;
                      </p>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between mt-2">
                      <span className="font-headline font-bold text-base text-white">
                        {formatPrice(product.price, language)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#fa8221] hover:bg-[#e87313] text-white text-[11px] font-bold uppercase transition-all cursor-pointer"
                      >
                        {isInCart ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>IN CART</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>ADD</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PersonalProductGuide;
