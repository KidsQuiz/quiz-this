
import { useEffect } from 'react';

export const useTimeoutHandling = (
  timeRemaining: number,
  currentQuestion: any,
  isConfiguring: boolean,
  sessionComplete: boolean,
  answerSubmitted: boolean,
  currentQuestionIndex: number,
  questions: any[],
  // Change this from a setter to a dummy parameter we don't use
  _unused: any,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Monitor time remaining and close the question dialog when time elapses
  useEffect(() => {
    if (!currentQuestion || isConfiguring || sessionComplete) return;
    
    // When answer is submitted OR time runs out, move to next question after a delay
    if (answerSubmitted || timeRemaining === 0) {
      // Wait 2 seconds to show the feedback, then move to next question
      const timer = setTimeout(() => {
        if (currentQuestionIndex >= questions.length - 1) {
          // Last question, will complete the session
          setSessionComplete(true);
        } else {
          // Close current question dialog to trigger opening the next one
          setIsModalOpen(false);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [
    timeRemaining, 
    currentQuestion, 
    isConfiguring, 
    sessionComplete, 
    answerSubmitted, 
    currentQuestionIndex, 
    questions.length, 
    setSessionComplete,
    setIsModalOpen
  ]);
};
