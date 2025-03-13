
import { useState, useEffect } from 'react';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  // Handle when time is up
  const handleTimeUp = (answerSubmitted: boolean, timeBetweenQuestions: number, onClose: () => void) => {
    if (answerSubmitted) return;
    
    setTimerActive(false);
    
    // Wait for the time between questions before moving to next or closing
    setTimeout(() => {
      // Check if this was the last question
      setCurrentQuestionIndex(prev => prev + 1);
    }, timeBetweenQuestions * 1000);
    
    return true; // Time up event processed
  };

  // Handle user-initiated termination of the quiz session
  const handleTerminateSession = (onClose: () => void) => {
    // Stop the timer immediately
    setTimerActive(false);
    
    // Call the onClose callback to close the dialog
    onClose();
  };

  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setTimerActive,
    handleTimeUp,
    handleTerminateSession
  };
};
