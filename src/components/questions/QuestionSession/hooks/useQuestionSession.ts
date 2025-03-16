
import { useState, useCallback, useEffect } from 'react';
import { useSessionData } from './useSessionData';
import { useSessionHandlers } from './useSessionHandlers';
import { useSessionSetupEffect } from './useSessionSetupEffect';
import { useSessionUIEffects } from './useSessionUIEffects';
import { useSessionConfig } from './useSessionConfig';
import { usePackageAutoLoader } from './usePackageAutoLoader';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  // Use a dedicated hook for all session state data
  const sessionData = useSessionData();
  
  // We'll set isConfiguring to false by default now
  const [isConfiguring, setIsConfiguring] = useState(false);
  
  // Use session configuration hook
  const sessionConfig = useSessionConfig(kidId, kidName, onClose);
  
  // Use a dedicated hook for all session event handlers
  const sessionHandlers = useSessionHandlers({
    ...sessionData,
    kidId,
    onClose,
    resetAnswerState: sessionData.resetAnswerState
  });

  // Initialize session configuration functions (only once)
  useEffect(() => {
    if (sessionConfig.initializeSessionFunctions) {
      sessionConfig.initializeSessionFunctions(
        sessionData.loadQuestions,
        setIsConfiguring,
        sessionData.setCurrentQuestionIndex
      );
    }
  }, [
    sessionConfig.initializeSessionFunctions, 
    sessionData.loadQuestions, 
    sessionData.setCurrentQuestionIndex
  ]);
  
  // Use the auto loader hook to load all assigned packages on init
  usePackageAutoLoader(
    kidId,
    sessionData.loadQuestions,
    sessionData.setCurrentQuestionIndex
  );
  
  // Use setup effect for initialization logic
  useSessionSetupEffect({
    kidId,
    onClose,
    ...sessionData,
    ...sessionHandlers,
    resetAnswerState: sessionData.resetAnswerState,
    navigationTimeUpTriggered: false
  });
  
  // Handle UI effects like animations
  useSessionUIEffects({
    ...sessionData
  });

  return {
    ...sessionData,
    ...sessionHandlers,
    ...sessionConfig,
    isConfiguring
  };
};
