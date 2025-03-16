
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
  };
};
