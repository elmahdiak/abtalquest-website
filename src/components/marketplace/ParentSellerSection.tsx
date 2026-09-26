import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Loader2, 
  Store, 
  Heart,
  Users
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface ParentSellerSectionProps {
  user?: SupabaseUser | null;
  onOpenAuth?: () => void;
}

export const ParentSellerSection: React.FC<ParentSellerSectionProps> = ({
  user,
  onOpenAuth,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('stem');
  const [description, setDescription] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [safetyPledge, setSafetyPledge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleApplyClick = () => {
    if (!user && onOpenAuth) {
      onOpenAuth();
      return;
    }
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setModalOpen(false);
      }, 2500);
    }, 700);
  };

  return (
    <>
      <section className="relative w-full rounded-3xl bg-white dark:bg-[#0c2238] border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-card-soft overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#016ba5]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left Text matching PDF Page 14/15 */}
          <div className="flex-1 text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#016ba5]/10 dark:bg-[#016ba5]/20 text-[#016ba5] dark:text-[#38bdf8] text-xs font-black uppercase tracking-wider mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>PARENT SELLERS</span>
            </div>

            <h2 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F2A4A] dark:text-white tracking-tight mb-3">
              Sell meaningful family products.
            </h2>

            <p className="font-body text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-xl">
              Parent sellers apply first. The ABTALQUEST team reviews every application before any listing can be published, ensuring all products match our safety and values criteria.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Upfront Listing Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <Heart className="w-4 h-4 text-[#fa8221] shrink-0" />
                <span>Child-Safety Tested</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                <Users className="w-4 h-4 text-[#016ba5] shrink-0" />
                <span>Direct Family Reach</span>
              </div>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0 flex flex-col items-center">
            <button
              type="button"
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#016ba5] hover:bg-[#015887] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>{user ? 'APPLY AS PARENT SELLER' : 'SIGN IN TO APPLY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-slate-400 mt-2 text-center">
              Curated partner network • Manual vetting
            </span>
          </div>

        </div>
      </section>

      {/* Parent Seller Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-headline text-xl font-black text-[#0F2A4A] dark:text-white">
                  Application Received!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                  Thank you for applying to sell with AbtalQuest. Our team reviews submissions within 2 business days. We will contact you at {email || 'your email'}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-2">
                  <span className="text-[10px] font-black uppercase text-[#016ba5] dark:text-[#38bdf8] tracking-wider block">
                    PARENT SELLER PROGRAM
                  </span>
                  <h3 className="font-headline text-xl sm:text-2xl font-black text-[#0F2A4A] dark:text-white">
                    Apply to Join the Marketplace
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every product is vetted for safety, material quality, and developmental value.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Leila Bennani"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Brand / Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="e.g. Atlas Wood Crafts"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Product Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                  >
                    <option value="stem">STEM & Mechanical Building Kits</option>
                    <option value="outdoor">Outdoor Quest & Exploration Gear</option>
                    <option value="games">Cooperative Board Games & Cards</option>
                    <option value="books">Illustrated Storybooks & Chronicles</option>
                    <option value="sensory">Sensory & Emotional Calm Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Website or Portfolio Link (optional)
                  </label>
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://instagram.com/myworkshop"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tell us about your products and materials *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you make, materials used (e.g. natural wood, non-toxic dyes), and the age range..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#016ba5] resize-none"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="safety-pledge"
                    required
                    checked={safetyPledge}
                    onChange={(e) => setSafetyPledge(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#016ba5] focus:ring-[#016ba5]"
                  />
                  <label htmlFor="safety-pledge" className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                    I pledge that my products comply with non-toxic, child-safe standards and are free of hazardous small parts for target ages.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#016ba5] hover:bg-[#015887] text-white text-xs font-black uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>SUBMITTING APPLICATION...</span>
                      </>
                    ) : (
                      <span>SUBMIT SELLER APPLICATION</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default ParentSellerSection;
