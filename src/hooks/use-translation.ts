
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { currentLanguage, languagePack, t } = useLanguage();

  // Enhanced translation function with string interpolation support
  const translate = (key: string, replacements?: Record<string, string | number>) => {
    let text = t(key);
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  // Return the translation function and other useful properties
  return { 
    t: translate,
    currentLanguage,
    languagePack
  };
};
