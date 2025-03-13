
import { useEffect } from 'react';

export const useTimeoutHandling = (
  timeRemaining: number,
  currentQuestion: any,
  isConfiguring: boolean,
  sessionComplete: boolean,
  answerSubmitted: boolean,
  currentQuestionIndex: number,
  questions: any[],
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Monitor time remaining and close the question dialog when time elapses
  useEffect(() => {
    if (!currentQuestion || isConfiguring || sessionComplete || answerSubmitted) return;
    
    if (timeRemaining === 0) {
      // Mark as submitted with no selection
      setAnswerSubmitted(true);
      
      // Wait 2 seconds to show the timeout state, then move to next question
      setTimeout(() => {
        if (currentQuestionIndex >= questions.length - 1) {
          // Last question, will complete the session
          setSessionComplete(true);
        } else {
          // Close current question dialog to trigger opening the next one
          setIsModalOpen(false);
        }
      }, 2000);
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
