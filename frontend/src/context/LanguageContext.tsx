'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';
import mr from '@/i18n/mr.json';

export type LanguageCode = 'en' | 'hi' | 'mr';

const dictionaries: Record<LanguageCode, any> = {
  en,
  hi,
  mr
};

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (keyPath: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (keyPath: string, fallback?: string) => fallback || keyPath
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agriguard_language') as LanguageCode;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agriguard_language', lang);
    }
  };

  const t = (keyPath: string, fallback?: string): string => {
    const dict = dictionaries[language] || dictionaries['en'];
    const keys = keyPath.split('.');
    let current: any = dict;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English dictionary if key missing in current dict
        let engCurrent: any = dictionaries['en'];
        for (const ek of keys) {
          if (engCurrent && typeof engCurrent === 'object' && ek in engCurrent) {
            engCurrent = engCurrent[ek];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof engCurrent === 'string' ? engCurrent : (fallback || keyPath);
      }
    }

    return typeof current === 'string' ? current : (fallback || keyPath);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
