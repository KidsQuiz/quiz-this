
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

  // Handle when time is up - this function is now simplified since the 
  // timeout effect is handled in useTimeoutEffects
  const handleTimeUp = () => {
    if (timerActive) {
      setTimerActive(false);
      return true; // Time up event processed
    }
    return false;
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
