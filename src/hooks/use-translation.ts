
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Enhanced translation hook that provides type-safe translations with interpolation
 */
export const useTranslation = () => {
  const { currentLanguage, languagePack, t } = useLanguage();

  /**
   * Enhanced translation function with string interpolation support
   * @param key Translation key to lookup
   * @param replacements Optional object with replacement values
   * @returns Translated string with replacements applied
   */
  const translate = (key: string, replacements?: Record<string, string | number>) => {
    let text = t(key);
    
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  /**
   * Returns all translation utilities needed throughout the application
   */
  return { 
    t: translate,
    currentLanguage,
    languagePack
  };
};
