
import { useLanguage, LanguagePackKeys } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { currentLanguage, languagePack, t } = useLanguage();

  // Return the translation function and other useful properties
  return { 
    t,
    currentLanguage,
    languagePack
  };
};
