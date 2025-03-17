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
  const timeUpCalledRef = useRef(false);
  const pendingResetRef = useRef<number | null>(null);
  
  // Keep refs updated with latest values
  useEffect(() => {
    activeRef.current = isActive;
    // Reset the timeUpCalled flag when timer becomes active
    if (isActive) {
      timeUpCalledRef.current = false;
      console.log("Timer active, resetting timeUpCalled flag");
      
      // Apply any pending reset when timer becomes active
      if (pendingResetRef.current !== null) {
        console.log(`Applying pending time reset to ${pendingResetRef.current} now that timer is active`);
        setTimeRemaining(pendingResetRef.current);
        pendingResetRef.current = null;
      }
    }
  }, [isActive]);
  
  useEffect(() => {
    initialTimeRef.current = initialTime;
    // Only apply initial time when timer is not active
    if (!isActive) {
      pendingResetRef.current = initialTime;
    }
  }, [initialTime, isActive]);
  
  // Set up and manage the timer
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Don't start timer if inactive
    if (!isActive) {
      return;
    }
    
    console.log(`Timer started with ${timeRemaining} seconds (initial: ${initialTimeRef.current})`);
    
    // Start the timer - CRITICAL: use setInterval for continuous countdown
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        // If timer is no longer active, don't decrement
        if (!activeRef.current) return prev;
        
        const newTime = prev - 1;
        
        // Time's up
        if (newTime <= 0) {
          console.log("Timer reached zero!");
          
          // Immediately stop the timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // Only call onTimeUp once, and ensure it's not called again
          if (!timeUpCalledRef.current) {
            console.log("Time's up! Calling onTimeUp callback");
            timeUpCalledRef.current = true;
            
            // Call onTimeUp immediately
            onTimeUp(); // Execute the time up callback
            console.log("onTimeUp callback executed");
          }
          
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
  }, [isActive, onTimeUp, timeRemaining]);
  
  // Reset the timer
  const resetTimer = useCallback((newTime?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const timeToSet = newTime !== undefined ? newTime : initialTimeRef.current;
    
    if (isActive) {
      console.log("Timer active, immediately setting time to:", timeToSet);
      setTimeRemaining(timeToSet);
    } else {
      // Store the reset for when the timer becomes active again
      console.log("Timer inactive, storing pending reset to:", timeToSet);
      pendingResetRef.current = timeToSet;
    }
    
    // Reset the timeUpCalled flag when manually resetting the timer
    timeUpCalledRef.current = false;
  }, [isActive]);
  
  return {
    timeRemaining,
    resetTimer
  };
};
