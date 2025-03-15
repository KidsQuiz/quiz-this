
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
    if (!currentQuestion || isConfiguring || sessionComplete || answerSubmitted) return;
    
    if (timeRemaining === 0) {
      // We don't use setAnswerSubmitted anymore since we don't have access to it
      // Just close the dialog after timeout which will effectively move to the next question
      
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
    currentQuestionIndex, 
    questions.length, 
    setSessionComplete,
    setIsModalOpen
  ]);
};
