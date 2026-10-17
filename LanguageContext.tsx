import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS, LanguageInfo } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languageInfo: LanguageInfo;
  availableLanguages: LanguageInfo[];
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('agritrust_lang') as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('agritrust_lang', lang);
  };

  const languageInfo = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (dict[key]) {
      return dict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languageInfo,
        availableLanguages: LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
