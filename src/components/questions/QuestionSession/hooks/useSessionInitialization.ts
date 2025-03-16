
import { useState, useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

export const useSessionInitialization = (
  kidId: string,
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  onClose: () => void
) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

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
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('somethingWentWrong')
        });
        
        // Close the session on error
        onClose();
      }
    };
    
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  return { initialLoadComplete };
};
