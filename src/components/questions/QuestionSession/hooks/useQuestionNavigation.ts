
import { useState, useEffect, useCallback, useRef } from 'react';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  // Use ref to track if advancement is already in progress
  const advancementInProgressRef = useRef(false);

  // Timer logic
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          console.log("Timer reached zero, stopping timer automatically");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  // Handle when time is up - this ensures the timer is properly stopped
  const handleTimeUp = useCallback(() => {
    console.log('handleTimeUp called, current timer active state:', timerActive);
    if (timerActive) {
      console.log('Stopping timer due to time up');
      setTimerActive(false);
      return true; // Time up event processed
    }
    return false;
  }, [timerActive]);

  // Handle user-initiated termination of the quiz session
  const handleTerminateSession = useCallback((onClose: () => void) => {
    // Stop the timer immediately
    setTimerActive(false);
    
    // Call the onClose callback to close the dialog
    onClose();
  }, []);

  // Force advance to next question - improved with direct state setting
  const forceAdvanceQuestion = useCallback(() => {
    // Prevent multiple simultaneous advancements
    if (advancementInProgressRef.current) {
      console.log("Advancement already in progress, ignoring duplicate request");
      return;
    }
    
    // Set flag to prevent multiple advancements
    advancementInProgressRef.current = true;
    
    console.log("Forcing advancement to next question");
    const newIndex = currentQuestionIndex + 1;
    console.log(`DIRECT ADVANCEMENT: from question ${currentQuestionIndex + 1} to ${newIndex + 1}`);
    
    // Set the index directly, not using a function to avoid closure issues
    setCurrentQuestionIndex(newIndex);
    
    // Reset flag after a short delay
    setTimeout(() => {
      advancementInProgressRef.current = false;
    }, 100);
  }, [currentQuestionIndex]);

  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setTimerActive,
    handleTimeUp,
    handleTerminateSession,
    forceAdvanceQuestion
  };
};
