import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  type Language, 
  type Direction, 
  LANGUAGES, 
  dictionaries 
} from '../locales';

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'abtalquest_lang';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && (saved === 'en' || saved === 'ar' || saved === 'fr')) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to read language preference from localStorage:', e);
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const direction: Direction = LANGUAGES[language].direction;

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Failed to save language preference to localStorage:', e);
    }
  }, []);

  // Synchronize <html> element lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  // Translation lookup function with nested dot-notation and parameter replacement
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    
    // 1. Try active language
    let current: unknown = dictionaries[language];
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = (current as Record<string, unknown>)[k];
      } else {
        current = undefined;
        break;
      }
    }

    // 2. Fallback to English if missing
    if (typeof current !== 'string') {
      let fallback: unknown = dictionaries.en;
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = (fallback as Record<string, unknown>)[k];
        } else {
          fallback = undefined;
          break;
        }
      }
      current = fallback;
    }

    if (typeof current !== 'string') {
      return key; // return key if completely not found
    }

    // 3. Interpolate parameters if any
    let result = current;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return result;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
