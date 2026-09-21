import { en } from './en';
import { ar } from './ar';
import { fr } from './fr';

export type Language = 'en' | 'ar' | 'fr';
export type Direction = 'ltr' | 'rtl';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  direction: Direction;
}

export const LANGUAGES: Record<Language, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English (US)',
    flag: '🇺🇸',
    direction: 'ltr',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇦🇪',
    direction: 'rtl',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
  },
};

export const dictionaries = {
  en,
  ar,
  fr,
} as const;

export type TranslationDictionary = typeof en;

export const DEFAULT_LANGUAGE: Language = 'fr';
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'ar', 'fr'] as const;
export const STORAGE_KEY = 'abtalquest_lang';

export function isSupportedLanguage(lang: unknown): lang is Language {
  return typeof lang === 'string' && (lang === 'en' || lang === 'ar' || lang === 'fr');
}

/**
 * Detects visitor's device/browser language preference:
 * - Checks `navigator.languages` (priority array) and `navigator.language`.
 * - Matches against supported locales ('fr', 'ar', 'en').
 * - Falls back to French ('fr') if unsupported or unrecognized.
 */
export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const candidates: string[] = [];
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
      candidates.push(...navigator.languages);
    }
    if (navigator.language) {
      candidates.push(navigator.language);
    }

    for (const candidate of candidates) {
      if (!candidate) continue;
      const normalized = candidate.trim().toLowerCase();
      const primaryTag = normalized.split(/[-_]/)[0];
      if (primaryTag === 'fr') return 'fr';
      if (primaryTag === 'ar') return 'ar';
      if (primaryTag === 'en') return 'en';
    }
  } catch (e) {
    console.warn('Failed to detect device language:', e);
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Initializes language preference:
 * 1. Checks localStorage for explicit manual user selection.
 * 2. If no saved preference, automatically detects device language.
 * 3. Falls back to French ('fr') if unrecognized or unsupported.
 */
export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(saved)) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read language preference from localStorage:', e);
  }

  return detectDeviceLanguage();
}

