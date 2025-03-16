
import { useSessionData } from './useSessionData';
import { useSessionHandlers } from './useSessionHandlers';
import { useSessionSetupEffect } from './useSessionSetupEffect';
import { useSessionUIEffects } from './useSessionUIEffects';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  // Use a dedicated hook for all session state data
  const sessionData = useSessionData();
  
  // Use a dedicated hook for all session event handlers
  const sessionHandlers = useSessionHandlers({
    ...sessionData,
    kidId,
    onClose
  });
  
  // Use setup effect for initialization logic
  useSessionSetupEffect({
    kidId,
    onClose,
    ...sessionData,
    ...sessionHandlers
  });
  
  // Handle UI effects like animations
  useSessionUIEffects({
    ...sessionData
  });

  return {
    ...sessionData,
    ...sessionHandlers,
  };
};
