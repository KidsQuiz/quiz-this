
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSessionStartup = (
  selectedPackageIds: string[],
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setIsConfiguring: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Start the session with the selected packages
  const handleStartSession = useCallback(async () => {
    if (selectedPackageIds.length === 0) {
      toast({
        title: t('noPackagesSelected'),
        description: t('pleaseSelectPackages'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      await loadQuestions(selectedPackageIds);
      setIsConfiguring(false);
      setCurrentQuestionIndex(0);
    } catch (error) {
      // Only show toast for unexpected errors
      if (error && (error as any).message !== 'no_packages') {
        toast({
          title: t('error'),
          description: t('somethingWentWrong'),
          variant: "destructive"
        });
      }
    }
  }, [loadQuestions, selectedPackageIds, setCurrentQuestionIndex, setIsConfiguring, toast, t]);

  return { handleStartSession };
};
