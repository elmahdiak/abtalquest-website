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
  AlertCircle,
  KeyRound,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import AbtalQuestLogo from '../common/AbtalQuestLogo';
import { 
  signInUser, 
  signUpUser, 
  confirmUserEmail, 
  requestPasswordReset, 
  verifyPasswordResetCode, 
  completePasswordReset 
} from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: SupabaseUser) => void;
}

type AuthMode = 
  | 'signin' 
  | 'signup' 
  | 'confirm_email' 
  | 'forgot_password' 
  | 'verify_reset_code' 
  | 'new_password';

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const { t, direction } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessNotice(null);
  };

  // 1. Sign In / Sign Up Form Submission
  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
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
      } else if (mode === 'signup') {
        const res = await signUpUser(
          email,
          password,
          fullName || 'Family Hero'
        );

        if (res.error || !res.user) {
          setErrorMessage(res.error || 'Registration failed');
          setSubmitting(false);
          return;
        }

        if (res.verificationCode) {
          setDispatchedCode(res.verificationCode);
        }

        setSuccessNotice('Account created! A 6-digit confirmation email has been dispatched.');
        setMode('confirm_email');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Email Confirmation Submission
  const handleConfirmEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    try {
      const res = await confirmUserEmail(email, verificationCode);
      if (!res.success) {
        setErrorMessage(res.error || 'Verification code invalid or expired.');
        setSubmitting(false);
        return;
      }

      // Auto sign-in after confirmation
      const loginRes = await signInUser(email, password);
      if (loginRes.user) {
        onSuccess(loginRes.user);
        onClose();
      } else {
        setSuccessNotice('Email successfully verified! Please sign in with your password.');
        setMode('signin');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Confirmation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Request Password Reset Code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    try {
      const res = await requestPasswordReset(email);
      if (!res.success) {
        setErrorMessage(res.error || 'Could not send verification code.');
        setSubmitting(false);
        return;
      }

      if (res.code) {
        setDispatchedCode(res.code);
      }

      setSuccessNotice(`A 6-digit reset code has been sent to ${email}.`);
      setMode('verify_reset_code');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Reset request failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Verify Password Reset Code
  const handleVerifyResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    try {
      const res = await verifyPasswordResetCode(email, verificationCode);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid or expired code.');
        setSubmitting(false);
        return;
      }

      setSuccessNotice('Verification successful! You can now set your new password.');
      setMode('new_password');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Code verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Complete Password Reset
  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    try {
      const res = await completePasswordReset(email, newPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to update password.');
        setSubmitting(false);
        return;
      }

      // Auto-sign in with new password
      const loginRes = await signInUser(email, newPassword);
      if (loginRes.user) {
        onSuccess(loginRes.user);
        onClose();
      } else {
        setSuccessNotice('Password successfully updated! Please sign in with your new password.');
        setPassword(newPassword);
        setMode('signin');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Password update failed');
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
          className={cn(
            'absolute top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer',
            direction === 'rtl' ? 'left-5' : 'right-5'
          )}
          aria-label={t('nav.close')}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <AbtalQuestLogo variant={theme === 'dark' ? 'dark' : 'light'} size="sm" showText={true} />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant="gamification" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            {t('auth.badge')}
          </Badge>
        </div>

        {/* Dynamic Titles */}
        <h3 className="font-headline text-2xl font-black text-[#1E293B] dark:text-white mb-1">
          {mode === 'signin' && t('auth.welcome_back')}
          {mode === 'signup' && t('auth.create_account')}
          {mode === 'confirm_email' && t('auth.confirm_account_title')}
          {mode === 'forgot_password' && t('auth.forgot_password_title')}
          {mode === 'verify_reset_code' && t('auth.verify_code_title')}
          {mode === 'new_password' && t('auth.new_password_title')}
        </h3>

        <p className="font-body text-xs text-slate-500 dark:text-slate-400 mb-5">
          {mode === 'signin' && t('auth.signin_sub')}
          {mode === 'signup' && t('auth.signup_sub')}
          {mode === 'confirm_email' && t('auth.confirm_account_sub', { email })}
          {mode === 'forgot_password' && t('auth.forgot_password_sub')}
          {mode === 'verify_reset_code' && t('auth.verify_code_sub', { email })}
          {mode === 'new_password' && t('auth.new_password_sub')}
        </p>

        {/* Live Outbox Helper Pill (Ensures zero silent email delivery failures) */}
        {dispatchedCode && (mode === 'confirm_email' || mode === 'verify_reset_code') && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-mono text-slate-700 dark:text-slate-200">
                Code: <strong className="text-amber-600 dark:text-amber-400 text-sm">{dispatchedCode}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationCode(dispatchedCode)}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[10px] hover:bg-amber-600 cursor-pointer active:scale-95 transition-all"
            >
              Auto-fill Code
            </button>
          </div>
        )}

        {/* Alert Messages */}
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

        {/* 1. SIGN IN & SIGN UP FORM */}
        {(mode === 'signin' || mode === 'signup') && (
          <form onSubmit={handleSubmitAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {t('auth.family_name')}
                </label>
                <div className="relative">
                  <User className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('auth.family_name_placeholder')}
                    className={cn(
                      'w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                      direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                    )}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className={cn(
                    'w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200">
                  {t('auth.password')}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      resetMessages();
                      setMode('forgot_password');
                    }}
                    className="text-[11px] text-[#016ba5] dark:text-[#38BDF8] hover:underline font-semibold cursor-pointer"
                  >
                    {t('auth.forgot_password')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            {/* Member Perks Highlight */}
            {mode === 'signup' && (
              <div className="p-3.5 rounded-2xl bg-[#016ba5]/5 dark:bg-[#016ba5]/15 border border-[#016ba5]/15 dark:border-[#016ba5]/30 space-y-1.5 text-[11px] font-body text-slate-600 dark:text-slate-300">
                <span className="font-headline font-bold text-[#016ba5] dark:text-[#38BDF8] block text-xs">
                  {t('auth.benefits_title')}
                </span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{t('auth.benefit_1')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{t('auth.benefit_2')}</span>
                </div>
              </div>
            )}

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
                  ? t('auth.btn_processing')
                  : mode === 'signin'
                  ? t('auth.btn_signin')
                  : t('auth.btn_signup')}
              </Button>
            </div>
          </form>
        )}

        {/* 2. CONFIRM EMAIL VIEW */}
        {mode === 'confirm_email' && (
          <form onSubmit={handleConfirmEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('auth.code_label')}
              </label>
              <div className="relative">
                <KeyRound className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('auth.code_placeholder')}
                  className={cn(
                    'w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 font-mono text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submitting || verificationCode.length < 6}
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            >
              {submitting ? t('auth.btn_processing') : t('auth.btn_confirm_account')}
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={async () => {
                  resetMessages();
                  const res = await signUpUser(email, password, fullName || 'Family Hero');
                  if (res.verificationCode) setDispatchedCode(res.verificationCode);
                  setSuccessNotice('New confirmation code sent to your email.');
                }}
                className="inline-flex items-center gap-1 text-[#016ba5] dark:text-[#38BDF8] hover:underline cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('auth.resend_code')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signin');
                }}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                {t('auth.back_to_signin')}
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD - STEP 1: ENTER EMAIL */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className={cn(
                    'w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submitting}
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            >
              {submitting ? t('auth.btn_processing') : t('auth.btn_send_code')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signin');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <ArrowLeft className={cn("w-3.5 h-3.5", direction === 'rtl' && 'rotate-180')} />
                <span>{t('auth.back_to_signin')}</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. FORGOT PASSWORD - STEP 2: VERIFY 6-DIGIT CODE */}
        {mode === 'verify_reset_code' && (
          <form onSubmit={handleVerifyResetCode} className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('auth.code_label')}
              </label>
              <div className="relative">
                <KeyRound className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder={t('auth.code_placeholder')}
                  className={cn(
                    'w-full py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 font-mono text-center tracking-widest text-lg font-black focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submitting || verificationCode.length < 6}
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            >
              {submitting ? t('auth.btn_processing') : t('auth.btn_verify_code')}
            </Button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={async () => {
                  resetMessages();
                  const res = await requestPasswordReset(email);
                  if (res.code) setDispatchedCode(res.code);
                  setSuccessNotice('A new verification code has been sent.');
                }}
                className="inline-flex items-center gap-1 text-[#016ba5] dark:text-[#38BDF8] hover:underline cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('auth.resend_code')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signin');
                }}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                {t('auth.back_to_signin')}
              </button>
            </div>
          </form>
        )}

        {/* 5. FORGOT PASSWORD - STEP 3: NEW PASSWORD */}
        {mode === 'new_password' && (
          <form onSubmit={handleCompleteReset} className="space-y-4">
            <div>
              <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">
                {t('auth.new_password_label')}
              </label>
              <div className="relative">
                <Lock className={cn('w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2', direction === 'rtl' ? 'right-3' : 'left-3')} />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0A2540] text-slate-900 dark:text-white placeholder:text-slate-400 font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]',
                    direction === 'rtl' ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                  )}
                />
              </div>
            </div>

            <Button
              variant="cta"
              size="lg"
              fullWidth
              disabled={submitting || newPassword.length < 6}
              icon={submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {submitting ? t('auth.btn_processing') : t('auth.btn_save_password')}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode('signin');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                {t('auth.back_to_signin')}
              </button>
            </div>
          </form>
        )}

        {/* Bottom Switcher and Security Badge */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 flex flex-col items-center gap-3 text-center">
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setMode(mode === 'signin' ? 'signup' : 'signin');
              }}
              className="font-headline text-xs font-semibold text-[#016ba5] dark:text-[#38BDF8] hover:underline cursor-pointer"
            >
              {mode === 'signin'
                ? t('auth.switch_to_signup')
                : t('auth.switch_to_signin')}
            </button>

            <span className="text-[11px] font-body text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {t('auth.security_badge')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuthModal;
