
import { useState, useCallback, useRef } from 'react';
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
  
  // Use refs instead of state for function storage to prevent re-renders
  const loadQuestionsFnRef = useRef<LoadQuestionsFunction | null>(null);
  const setIsConfiguringRef = useRef<SetStateFn<boolean> | null>(null);
  const setCurrentQuestionIndexRef = useRef<SetStateFn<number> | null>(null);
  
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
    
    if (loadQuestionsFnRef.current && setIsConfiguringRef.current && setCurrentQuestionIndexRef.current) {
      await loadQuestionsFnRef.current(selectedPackageIds);
      setIsConfiguringRef.current(false);
      setCurrentQuestionIndexRef.current(0);
    } else {
      console.error(t('sessionFunctionsNotInitialized'));
    }
  }, [selectedPackageIds, toast, t]);

  // This function will be called by useQuestionSession to initialize the required functions
  const initializeSessionFunctions = useCallback((
    loadQuestions: LoadQuestionsFunction,
    setIsConfiguring: SetStateFn<boolean>,
    setCurrentQuestionIndex: SetStateFn<number>
  ) => {
    loadQuestionsFnRef.current = loadQuestions;
    setIsConfiguringRef.current = setIsConfiguring;
    setCurrentQuestionIndexRef.current = setCurrentQuestionIndex;
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
