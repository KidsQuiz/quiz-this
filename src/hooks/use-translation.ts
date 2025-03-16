
import { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslation = () => {
  const { currentLanguage, languagePack, t } = useLanguage();

  // We can either return the existing t function from the context directly
  // or implement our own with the same signature
  return { t };
};
