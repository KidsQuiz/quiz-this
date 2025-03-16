
import { useState, useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSessionInitialization = (
  kidId: string,
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  onClose: () => void
) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initial setup - fetch questions
  useEffect(() => {
    const setup = async () => {
      console.log("Setting up question session for kid:", kidId);
      
      try {
        // Fix: Pass an array with the kidId
        await loadQuestions([kidId]);
        setCurrentQuestionIndex(0);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading questions:", error);
        // Only show the toast for actual errors, not expected conditions
        if (error && (error as any).message !== 'no_packages') {
          toast({
            variant: "destructive",
            title: t('error'),
            description: t('somethingWentWrong')
          });
          
          // Close the session on error
          onClose();
        }
      }
    };
    
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  return { initialLoadComplete };
};
