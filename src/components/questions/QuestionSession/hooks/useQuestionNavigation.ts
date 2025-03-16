
import { useState, useCallback, useRef } from 'react';
import { useQuestionTimer } from './useQuestionTimer';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(30); // Default time
  const timerResetRef = useRef(false);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);
  
  // Handle when time runs out
  const handleTimeUp = useCallback(() => {
    console.log("Time's up callback triggered in useQuestionNavigation");
    setTimerActive(false); // Stop the timer immediately when time is up
    setTimeUpTriggered(true); // Mark that we've triggered the time up event
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
  
  // Function to reset and start the timer
  const resetAndStartTimer = useCallback((seconds: number) => {
    console.log(`Reset and start timer: ${seconds} seconds`);
    // Mark timer as not active during setup
    setTimerActive(false);
    // Update the time limit
    setQuestionTimeLimit(seconds);
    // Reset the timer with this value
    resetTimer(seconds);
    // Reset the time up triggered state
    setTimeUpTriggered(false);
    // Start the timer with a small delay to ensure all states are updated
    setTimeout(() => {
      setTimerActive(true);
    }, 50);
  }, [resetTimer, setQuestionTimeLimit]);
  
  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    timeUpTriggered,
    setTimeUpTriggered,
    setTimerActive,
    setCurrentQuestionIndex,
    setTimeRemaining: resetTimer,
    updateTimeLimit,
    resetAndStartTimer,
    handleTimeUp,
    handleTerminateSession
  };
};
