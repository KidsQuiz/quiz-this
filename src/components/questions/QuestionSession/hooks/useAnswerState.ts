
import { useState, useCallback, useRef, useEffect } from 'react';

export const useAnswerState = () => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);
  
  // Create a ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Setup effect to track component mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Define a reusable function to reset all answer-related state
  const resetAnswerState = useCallback(() => {
    console.log("CRITICAL: Explicitly resetting ALL answer state");
    // Only update state if component is still mounted
    if (isMountedRef.current) {
      // Reset in specific order - selection state first
      setSelectedAnswerId(null);
      
      // Then reset other states
      setAnswerSubmitted(false);
      setIsCorrect(false);
      
      // Force a DOM update by calling in a timeout
      setTimeout(() => {
        if (isMountedRef.current) {
          setSelectedAnswerId(null);
        }
      }, 50);
    }
  }, [setSelectedAnswerId, setAnswerSubmitted, setIsCorrect]);

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    setShowRelaxAnimation,
    resetAnswerState,
    isMountedRef
  };
};
