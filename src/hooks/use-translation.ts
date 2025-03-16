
import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { language, translations } = useLanguage();

  const t = useCallback((key: string) => {
    return translations[language][key] || key;
  }, [language, translations]);

  return { t };
};
