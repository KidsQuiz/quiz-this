
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
    console.log("Advancing to next question");
    
    // Forcibly reset any selected buttons in the DOM first
    const allButtons = document.querySelectorAll('[data-answer-option]');
    allButtons.forEach(button => {
      button.setAttribute('data-selected', 'false');
      button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md');
    });
    
    // Briefly disable pointer events to prevent race conditions
    document.body.style.pointerEvents = 'none';
    
    // Small delay before closing dialog to ensure DOM updates
    setTimeout(() => {
      setIsModalOpen(false); // Close current dialog to trigger next question
      
      // Re-enable pointer events after a delay
      setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
      }, 200);
    }, 50);
  }, [setIsModalOpen]);
  
  return { advanceToNextQuestion };
};
