
import { useSessionState } from './useSessionState';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useToastAndLanguage } from './useToastAndLanguage';

/**
 * Centralizes all data and state needed for the question session
 */
export const useSessionData = () => {
  // Get toast and language utilities
  const { toast, t } = useToastAndLanguage();
  
  // Get session state (answers, UI state, etc.)
  const sessionState = useSessionState();
  
  // Get question loading state and functions
  const questionLoadingState = useQuestionLoading();
  
  // Get navigation state and functions
  const navigationState = useQuestionNavigation();
  
  // Create a resetAnswerState function that combines multiple reset functions
  const resetAnswerState = () => {
    // Use the resetSessionState function which should reset all necessary state
    if (sessionState.resetSessionState) {
      sessionState.resetSessionState();
    }
  };
  
  // Memoize all returned values to prevent unnecessary re-renders
  return {
    // Toast and language
    toast, 
    t,
    
    // Session state
    ...sessionState,
    
    // Question loading state
    ...questionLoadingState,
    
    // Navigation state
    ...navigationState,
    
    // Add the resetAnswerState function
    resetAnswerState
  };
};
