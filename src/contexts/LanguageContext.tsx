
import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../locales/en';
import { bg } from '../locales/bg';

// All supported languages
export type SupportedLanguage = 'en' | 'bg';

// Type for the language pack dictionaries
export type LanguagePack = typeof en;

// Type for the language context
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  languagePack: LanguagePack;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: keyof LanguagePack) => string;
}

// Available language packs
export const languagePacks: Record<SupportedLanguage, LanguagePack> = {
  en,
  bg
};

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  languagePack: en,
  changeLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get the saved language from localStorage or use the browser's language
  const getSavedLanguage = (): SupportedLanguage => {
    const saved = localStorage.getItem('preferredLanguage') as SupportedLanguage | null;
    if (saved && Object.keys(languagePacks).includes(saved)) {
      return saved;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (browserLang && Object.keys(languagePacks).includes(browserLang)) {
      return browserLang;
    }
    
    return 'en'; // Default to English
  };

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getSavedLanguage);
  const [languagePack, setLanguagePack] = useState<LanguagePack>(languagePacks[currentLanguage]);

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    setLanguagePack(languagePacks[lang]);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
  };

  // Initialize on mount
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Translation function
  const t = (key: keyof LanguagePack): string => {
    return languagePack[key] || key.toString();
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, languagePack, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
