/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  type Language, 
  type Direction, 
  LANGUAGES, 
  dictionaries,
  STORAGE_KEY,
  getInitialLanguage
} from '../locales';

export interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


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

    // 2. Fallback to French if missing
    if (typeof current !== 'string') {
      let fallbackFr: unknown = dictionaries.fr;
      for (const k of keys) {
        if (fallbackFr && typeof fallbackFr === 'object' && k in fallbackFr) {
          fallbackFr = (fallbackFr as Record<string, unknown>)[k];
        } else {
          fallbackFr = undefined;
          break;
        }
      }
      current = fallbackFr;
    }

    // 3. Fallback to English if also missing in French
    if (typeof current !== 'string') {
      let fallbackEn: unknown = dictionaries.en;
      for (const k of keys) {
        if (fallbackEn && typeof fallbackEn === 'object' && k in fallbackEn) {
          fallbackEn = (fallbackEn as Record<string, unknown>)[k];
        } else {
          fallbackEn = undefined;
          break;
        }
      }
      current = fallbackEn;
    }

    if (typeof current !== 'string') {
      return key; // return key if completely not found
    }

    // 4. Interpolate parameters if any
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
