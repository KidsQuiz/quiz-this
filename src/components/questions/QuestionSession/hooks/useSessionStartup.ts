
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSessionStartup = (
  selectedPackageIds: string[],
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setIsConfiguring: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const { toast } = useToast();
  
  // Start the session with the selected packages
  const handleStartSession = useCallback(async () => {
    if (selectedPackageIds.length === 0) {
      toast({
        title: "No packages selected",
        description: "Please select at least one question package to start.",
        variant: "destructive"
      });
      return;
    }
    
    await loadQuestions(selectedPackageIds);
    setIsConfiguring(false);
    setCurrentQuestionIndex(0);
  }, [loadQuestions, selectedPackageIds, setCurrentQuestionIndex, setIsConfiguring, toast]);

  return { handleStartSession };
};
