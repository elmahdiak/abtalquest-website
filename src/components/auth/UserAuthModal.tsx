import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { signInUser, signUpUser } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: SupabaseUser) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        const { user, error } = await signInUser(email, password);
        if (error || !user) {
          setErrorMessage(error || 'Invalid email or password');
          setSubmitting(false);
          return;
        }
        onSuccess(user);
        onClose();
      } else {
        const { user, error, confirmationRequired } = await signUpUser(
          email,
          password,
          fullName || 'Family Hero'
        );

        if (error || !user) {
          setErrorMessage(error || 'Sign up failed');
          setSubmitting(false);
          return;
        }

        if (confirmationRequired) {
          setSuccessNotice('Account created! Please check your email inbox to verify your account.');
          setSubmitting(false);
          return;
        }

        onSuccess(user);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#0F2F4E] rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-700 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <AbtalQuestLogo variant={theme === 'dark' ? 'dark' : 'light'} size="sm" showText={true} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gamification" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            AbtalQuest Family Portal
          </Badge>
        </div>

        <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-1">
          {mode === 'signin' ? 'Welcome Back!' : 'Create Family Account'}
        </h3>

        <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-6">
          {mode === 'signin'
            ? 'Sign in to access your order history, special offers, and saved quest XP.'
            : 'Join free to track orders, earn double quest XP bonuses, and access parental tools.'}
        </p>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs font-body text-red-700 dark:text-red-300 mb-5">
            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-xs font-body text-emerald-800 dark:text-emerald-300 mb-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                Parent / Family Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Al-Mansoor Family"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
              />
            </div>
          </div>

          {/* Member Perks Highlight */}
          <div className="p-3.5 rounded-2xl bg-[#016ba5]/5 dark:bg-[#016ba5]/15 border border-[#016ba5]/15 dark:border-[#016ba5]/30 space-y-1.5 text-[11px] font-body text-slate-600 dark:text-slate-300">
            <span className="font-headline font-bold text-[#016ba5] dark:text-[#38BDF8] block text-xs">
              ✨ Family Membership Benefits:
            </span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Track physical kit delivery in real-time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Save quest XP & achievements across devices</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submitting}
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              iconPosition="right"
            >
              {submitting
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Family Hub'
                : 'Create Family Account'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMessage(null);
            }}
            className="font-headline text-xs font-semibold text-[#016ba5] dark:text-[#38BDF8] hover:underline"
          >
            {mode === 'signin'
              ? "Don't have an account yet? Create one here"
              : 'Already have an account? Sign In'}
          </button>

          <span className="text-[11px] font-body text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            100% Ad-Free • Safe & Secure
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;
