
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { en } from '../locales/en';
import { bg } from '../locales/bg';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

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
  currentLanguage: 'bg', // Default to Bulgarian
  languagePack: bg,
  changeLanguage: () => {},
  t: () => '',
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { user } = useAuth();
  // Try to get the saved language from localStorage, user profile, or use Bulgarian as default
  const getSavedLanguage = (): SupportedLanguage => {
    const saved = localStorage.getItem('preferredLanguage') as SupportedLanguage | null;
    if (saved && Object.keys(languagePacks).includes(saved)) {
      return saved;
    }
    
    // Default to Bulgarian instead of browser language
    return 'bg';
  };

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getSavedLanguage);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use useMemo to prevent unnecessary re-renders
  const languagePack = useMemo(() => languagePacks[currentLanguage], [currentLanguage]);

  // Update language when user changes
  useEffect(() => {
    const fetchUserLanguagePreference = async () => {
      if (user) {
        try {
          // Try to get language preference from user profile
          const { data, error } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching language preference:', error);
            return;
          }
          
          if (data && data.preferred_language) {
            const preferredLang = data.preferred_language as SupportedLanguage;
            if (Object.keys(languagePacks).includes(preferredLang)) {
              setCurrentLanguage(preferredLang);
              localStorage.setItem('preferredLanguage', preferredLang);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user language preference:', error);
        }
      }
      setIsInitialized(true);
    };

    fetchUserLanguagePreference();
  }, [user]);

  const changeLanguage = async (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    
    // Save to user profile if logged in
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ preferred_language: lang })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error saving language preference:', error);
        }
      } catch (error) {
        console.error('Failed to save language preference:', error);
      }
    }
  };

  // Initialize on mount
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Translation function
  const t = (key: keyof LanguagePack): string => {
    return languagePack[key] || key.toString();
  };

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentLanguage,
    languagePack,
    changeLanguage,
    t
  }), [currentLanguage, languagePack]);

  // Only render children when we've checked for user language preference
  if (!isInitialized && user) {
    return null; // Or a loading indicator
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
