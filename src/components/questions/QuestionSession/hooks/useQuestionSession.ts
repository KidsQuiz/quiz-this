
import { useSessionData } from './useSessionData';
import { useSessionHandlers } from './useSessionHandlers';
import { useSessionSetupEffect } from './useSessionSetupEffect';
import { useSessionUIEffects } from './useSessionUIEffects';
import { useSessionConfig } from './useSessionConfig';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  // Use a dedicated hook for all session state data
  const sessionData = useSessionData();
  
  // Use session configuration hook
  const sessionConfig = useSessionConfig(kidId, kidName, onClose);
  
  // Use a dedicated hook for all session event handlers
  const sessionHandlers = useSessionHandlers({
    ...sessionData,
    kidId,
    onClose,
    resetAnswerState: sessionData.resetAnswerState
  });
  
  // Initialize session configuration functions
  if (sessionConfig.initializeSessionFunctions) {
    sessionConfig.initializeSessionFunctions(
      sessionData.loadQuestions,
      sessionData.setIsConfiguring,
      sessionData.setCurrentQuestionIndex
    );
  }
  
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
    isConfiguring: sessionData.isConfiguring
  };
};
