
import { useEffect } from 'react';
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
  
  return {
    advanceToNextQuestion: () => {
      console.log("Advancing to next question");
      setIsModalOpen(false); // Close current dialog to trigger next question
    }
  };
};
