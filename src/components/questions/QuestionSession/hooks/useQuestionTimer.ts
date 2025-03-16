import { useState, useEffect, useRef } from 'react';

export const useQuestionTimer = (
  initialTime: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(isActive);
  
  // Keep activeRef updated with latest isActive value
  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);
  
  // Set up and manage the timer
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset time when inactive or when initial time changes
    if (!isActive) {
      setTimeRemaining(initialTime);
      return;
    }
    
    console.log("Timer started with", initialTime, "seconds");
    setTimeRemaining(initialTime);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        // If timer is no longer active, don't decrement
        if (!activeRef.current) return prev;
        
        const newTime = prev - 1;
        
        // Time's up
        if (newTime <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // Call the onTimeUp callback
          console.log("Time's up!");
          onTimeUp();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [initialTime, isActive, onTimeUp]);
  
  // Reset the timer
  const resetTimer = (newTime?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setTimeRemaining(newTime !== undefined ? newTime : initialTime);
  };
  
  return {
    timeRemaining,
    resetTimer
  };
};
