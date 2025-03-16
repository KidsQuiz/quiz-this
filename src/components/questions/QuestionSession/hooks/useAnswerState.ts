
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
    console.log("Resetting answer state");
    // Only update state if component is still mounted
    if (isMountedRef.current) {
      setSelectedAnswerId(null);
      setAnswerSubmitted(false);
      setIsCorrect(false);
      
      // Force a DOM update by calling in a timeout
      setTimeout(() => {
        if (isMountedRef.current) {
          // Aggressive DOM cleanup to ensure no visual state persists
          const allButtons = document.querySelectorAll('[data-answer-option]');
          allButtons.forEach(button => {
            button.setAttribute('data-selected', 'false');
            button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md', 
                                 'border-green-500', 'bg-green-50', 'dark:bg-green-950/30',
                                 'border-red-500', 'bg-red-50', 'dark:bg-red-950/30');
          });
        }
      }, 50);
    }
  }, []);

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
