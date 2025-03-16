
import { useState, useCallback } from 'react';
import { useQuestionTimer } from './useQuestionTimer';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Handle when time runs out
  const handleTimeUp = useCallback(() => {
    console.log("Time's up callback triggered");
    // We'll implement this logic in the parent hook
  }, []);
  
  // Set up the timer with the useQuestionTimer hook
  const { timeRemaining, resetTimer } = useQuestionTimer(
    30, // Default time
    timerActive,
    handleTimeUp
  );
  
  // Function to handle session termination
  const handleTerminateSession = useCallback(() => {
    setTimerActive(false);
    resetTimer(0);
  }, [resetTimer]);
  
  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setTimerActive,
    setCurrentQuestionIndex,
    setTimeRemaining: resetTimer,
    handleTimeUp,
    handleTerminateSession
  };
};
