
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
    
    // When time runs out but answer isn't submitted yet, handle timeout
    if (timeRemaining === 0 && !answerSubmitted) {
      // Wait 5 seconds to show the feedback (correct answer), then move to next question
      const timer = setTimeout(() => {
        if (currentQuestionIndex >= questions.length - 1) {
          // Last question, will complete the session
          setSessionComplete(true);
        } else {
          // Close current question dialog to trigger opening the next one
          setIsModalOpen(false);
        }
      }, 5000); // Exactly 5 seconds to show the correct answer
      
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
