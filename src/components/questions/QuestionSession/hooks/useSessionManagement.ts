
import { useCallback, useEffect } from 'react';

export const useSessionManagement = (
  isConfiguring: boolean,
  selectedPackageIds: string[],
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setIsConfiguring: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  toast: any,
  t: (key: string) => string
) => {
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
    
    await loadQuestions(selectedPackageIds);
    setIsConfiguring(false);
    setCurrentQuestionIndex(0);
  }, [loadQuestions, selectedPackageIds, setCurrentQuestionIndex, setIsConfiguring, toast, t]);

  return {
    handleStartSession
  };
};
