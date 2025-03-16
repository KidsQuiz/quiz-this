
import { useState, useCallback, useRef } from 'react';
import { useQuestionTimer } from './useQuestionTimer';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(30); // Default time
  
  // Handle when time runs out
  const handleTimeUp = useCallback(() => {
    console.log("Time's up callback triggered in useQuestionNavigation");
    setTimerActive(false); // Stop the timer when time is up
    // The parent hook will implement the rest of the logic
  }, []);
  
  // Set up the timer with the useQuestionTimer hook
  const { timeRemaining, resetTimer } = useQuestionTimer(
    questionTimeLimit,
    timerActive,
    handleTimeUp
  );
  
  // Function to handle updating the time limit for a new question
  const updateTimeLimit = useCallback((newTimeLimit: number) => {
    console.log("Updating time limit to:", newTimeLimit);
    setQuestionTimeLimit(newTimeLimit);
  }, []);
  
  // Function to handle session termination
  const handleTerminateSession = useCallback(() => {
    console.log("Terminating session, stopping timer");
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
    updateTimeLimit,
    handleTimeUp,
    handleTerminateSession
  };
};
