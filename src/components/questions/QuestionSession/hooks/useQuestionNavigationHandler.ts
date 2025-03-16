
import { useCallback } from 'react';

interface NavigationHandlerProps {
  currentQuestionIndex: number;
  questions: any[];
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  resetAnswerState: () => void;
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimeUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingTimeUpFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useQuestionNavigationHandler = ({
  currentQuestionIndex,
  questions,
  setCurrentQuestionIndex,
  resetAnswerState,
  setAnswerSubmitted,
  setSelectedAnswerId,
  setIsCorrect,
  setIsTimeUp,
  setShowingTimeUpFeedback,
  setTimeUpTriggered,
  setIsModalOpen,
  setSessionComplete
}: NavigationHandlerProps) => {
  // Create a function to go to the next question
  const goToNextQuestion = useCallback(() => {
    console.log("Going to next question, current index:", currentQuestionIndex);
    
    // Ensure the document is interactive
    document.body.style.pointerEvents = '';
    
    // Ensure we're in a clean state for the next question
    resetAnswerState();
    
    // Reset all state variables to ensure a clean transition
    setAnswerSubmitted(false);
    setSelectedAnswerId(null);
    setIsCorrect(false);
    setIsTimeUp(false);
    setShowingTimeUpFeedback(false);
    setTimeUpTriggered(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Get the next index value directly
      const nextIndex = currentQuestionIndex + 1;
      console.log(`NAVIGATION: Setting question index to ${nextIndex}`);
      
      // Set the index using the direct value
      setCurrentQuestionIndex(nextIndex);
      
      // Ensure the modal stays open
      setIsModalOpen(true);
    } else {
      console.log("This was the last question, completing session");
      setSessionComplete(true);
      
      // Keep modal open for completion screen
      setIsModalOpen(true);
    }
  }, [
    currentQuestionIndex, 
    questions.length, 
    resetAnswerState, 
    setCurrentQuestionIndex, 
    setIsModalOpen,
    setSessionComplete,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setIsTimeUp,
    setShowingTimeUpFeedback,
    setTimeUpTriggered
  ]);

  // Reset answer state function for navigation
  const prepareForNavigation = useCallback(() => {
    setAnswerSubmitted(false);
    setSelectedAnswerId(null);
    setIsCorrect(false);
    setIsTimeUp(false);
    setShowingTimeUpFeedback(false);
    setTimeUpTriggered(false);
  }, [
    setAnswerSubmitted, 
    setSelectedAnswerId, 
    setIsCorrect, 
    setIsTimeUp,
    setShowingTimeUpFeedback,
    setTimeUpTriggered
  ]);

  return {
    goToNextQuestion,
    prepareForNavigation
  };
};
