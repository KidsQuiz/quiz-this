
import { useState, useCallback } from 'react';
import { useToastAndLanguage } from './useToastAndLanguage';
import { usePackageSelection } from './usePackageSelection';

type LoadQuestionsFunction = (selectedPackageIds: string[]) => Promise<void>;
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

export const useSessionConfig = (
  kidId: string, 
  kidName: string, 
  onClose: () => void
) => {
  const { toast, t } = useToastAndLanguage();
  
  // These functions will be provided later by useQuestionSession
  const [loadQuestionsFn, setLoadQuestionsFn] = useState<LoadQuestionsFunction | null>(null);
  const [setIsConfiguringFn, setIsConfiguringStateFn] = useState<SetStateFn<boolean> | null>(null);
  const [setCurrentQuestionIndexFn, setCurrentQuestionIndexStateFn] = useState<SetStateFn<number> | null>(null);
  
  // Load packages and handle selection
  const {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = usePackageSelection(kidId, kidName, onClose, toast);

  // Handle session startup
  const handleStartSession = useCallback(async () => {
    if (selectedPackageIds.length === 0) {
      toast({
        title: t('noPackagesSelected'),
        description: t('pleaseSelectPackages'),
        variant: "destructive"
      });
      return;
    }
    
    if (loadQuestionsFn && setIsConfiguringFn && setCurrentQuestionIndexFn) {
      await loadQuestionsFn(selectedPackageIds);
      setIsConfiguringFn(false);
      setCurrentQuestionIndexFn(0);
    } else {
      console.error('Session functions not initialized');
    }
  }, [loadQuestionsFn, selectedPackageIds, setIsConfiguringFn, setCurrentQuestionIndexFn, toast, t]);

  // This function will be called by useQuestionSession to initialize the required functions
  const initializeSessionFunctions = useCallback((
    loadQuestions: LoadQuestionsFunction,
    setIsConfiguring: SetStateFn<boolean>,
    setCurrentQuestionIndex: SetStateFn<number>
  ) => {
    setLoadQuestionsFn(() => loadQuestions);
    setIsConfiguringStateFn(() => setIsConfiguring);
    setCurrentQuestionIndexStateFn(() => setCurrentQuestionIndex);
  }, []);

  return {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    initializeSessionFunctions
  };
};
