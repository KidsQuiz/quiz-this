
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Manages timeout effects when time runs out for a question
 */
export const useTimeoutEffects = (
  timeRemaining: number,
  currentQuestion: Question | null,
  isConfiguring: boolean,
  sessionComplete: boolean,
  answerSubmitted: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle when time runs out for a question
  useEffect(() => {
    if (!currentQuestion || isConfiguring || sessionComplete || answerSubmitted) return;
    
    if (timeRemaining === 0) {
      console.log('Time ran out for current question');
      
      // Mark as submitted with no selection
      setAnswerSubmitted(true);
      
      // Wait 2 seconds to show the timeout state, then move to next question
      const timeoutId = setTimeout(() => {
        if (currentQuestionIndex >= questions.length - 1) {
          // Last question, will complete the session
          setSessionComplete(true);
        } else {
          // Close current question dialog to trigger opening the next one
          setIsModalOpen(false);
        }
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    timeRemaining, 
    currentQuestion, 
    isConfiguring, 
    sessionComplete, 
    answerSubmitted, 
    setAnswerSubmitted, 
    currentQuestionIndex, 
    questions.length, 
    setSessionComplete,
    setIsModalOpen
  ]);
};
