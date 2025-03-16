import { useState, useEffect, useRef, useCallback } from 'react';

export const useQuestionTimer = (
  initialTime: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeRef = useRef(isActive);
  const initialTimeRef = useRef(initialTime);
  
  // Keep refs updated with latest values
  useEffect(() => {
    activeRef.current = isActive;
  }, [isActive]);
  
  useEffect(() => {
    initialTimeRef.current = initialTime;
    if (!isActive) {
      setTimeRemaining(initialTime);
    }
  }, [initialTime, isActive]);
  
  // Set up and manage the timer
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset time when inactive
    if (!isActive) {
      console.log("Timer stopped, resetting to:", initialTimeRef.current);
      setTimeRemaining(initialTimeRef.current);
      return;
    }
    
    console.log("Timer started with", initialTimeRef.current, "seconds");
    setTimeRemaining(initialTimeRef.current);
    
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
  const resetTimer = useCallback((newTime?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const timeToSet = newTime !== undefined ? newTime : initialTimeRef.current;
    console.log("Resetting timer to:", timeToSet);
    setTimeRemaining(timeToSet);
  }, []);
  
  return {
    timeRemaining,
    resetTimer
  };
};
