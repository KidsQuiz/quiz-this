
import { useCallback, useRef } from 'react';

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
  setTimerActive?: React.Dispatch<React.SetStateAction<boolean>>;
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
  setSessionComplete,
  setTimerActive
}: NavigationHandlerProps) => {
  // Reference to track if navigation is in progress
  const isNavigatingRef = useRef(false);
  
  // Create a function to go to the next question
  const goToNextQuestion = useCallback(() => {
    // Prevent duplicate navigation
    if (isNavigatingRef.current) {
      console.log("Navigation already in progress, skipping duplicate call");
      return;
    }
    
    isNavigatingRef.current = true;
    console.log("Going to next question, current index:", currentQuestionIndex);
    
    // First pause the timer if available
    if (setTimerActive) {
      setTimerActive(false);
    }
    
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
    
    // Reset navigation flag after a short delay
    setTimeout(() => {
      isNavigatingRef.current = false;
      console.log("Navigation flag reset, ready for next navigation");
    }, 300);
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
    setTimeUpTriggered,
    setTimerActive
  ]);

  // Reset answer state function for navigation
  const prepareForNavigation = useCallback(() => {
    // First pause the timer if available
    if (setTimerActive) {
      setTimerActive(false);
    }
    
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
    setTimeUpTriggered,
    setTimerActive
  ]);

  return {
    goToNextQuestion,
    prepareForNavigation
  };
};
