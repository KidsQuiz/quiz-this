
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
  const handleTimeUp = (answerSubmitted: boolean, timeBetweenQuestions: number) => {
    if (answerSubmitted) return;
    
    setTimerActive(false);
    
    // Wait for the time between questions before moving to next
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
    }, timeBetweenQuestions * 1000);
    
    return true; // Time up event processed
  };

  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    setTimerActive,
    handleTimeUp
  };
};
