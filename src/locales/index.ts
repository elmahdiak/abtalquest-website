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
