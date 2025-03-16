
import { useEffect, useCallback } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles transitions between questions and session states
 */
export const useSessionTransition = (
  isConfiguring: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle transition between questions
  useEffect(() => {
    // Don't handle transitions during configuration or when session is complete
    if (isConfiguring || sessionComplete) return;
    
    // Check if we've reached the end of questions
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      console.log("Reached end of questions, completing session");
      setSessionComplete(true);
    }
  }, [currentQuestionIndex, questions, isConfiguring, sessionComplete, setSessionComplete]);
  
  // Advance to next question with more aggressive state reset
  const advanceToNextQuestion = useCallback(() => {
    console.log("Advancing to next question directly");
    
    // CRITICAL: Log the current and next question index to debug transitions
    const nextIndex = currentQuestionIndex + 1;
    console.log(`Transition: from question ${currentQuestionIndex + 1} to ${nextIndex + 1}`);
    
    // Forcibly reset any selected buttons in the DOM first
    const allButtons = document.querySelectorAll('[data-answer-option]');
    allButtons.forEach(button => {
      button.setAttribute('data-selected', 'false');
      button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md');
    });
    
    // Briefly disable pointer events to prevent race conditions
    document.body.style.pointerEvents = 'none';
    
    // Force the exact next index - not using function updater to avoid potential stale state
    setCurrentQuestionIndex(nextIndex);
    console.log(`Question index updated to: ${nextIndex}`);
    
    // Re-enable pointer events after a delay
    setTimeout(() => {
      document.body.style.removeProperty('pointer-events');
    }, 100);
  }, [currentQuestionIndex, setCurrentQuestionIndex]);
  
  return { advanceToNextQuestion };
};
