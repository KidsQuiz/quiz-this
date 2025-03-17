
import { useEffect, useCallback, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles transitions between questions and session states
 * Improved to fix race conditions
 */
export const useSessionTransition = (
  isConfiguring: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Tracking references to prevent race conditions
  const transitionLockRef = useRef(false);
  const lastTransitionTimeRef = useRef(0);
  const lastProcessedIndexRef = useRef(-1);
  
  // Handle end of questions check
  useEffect(() => {
    // Skip during configuration or when session is already complete
    if (isConfiguring || sessionComplete) return;
    
    // Check if we've reached the end of questions
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      console.log("Reached end of questions, completing session");
      setSessionComplete(true);
    }
  }, [currentQuestionIndex, questions, isConfiguring, sessionComplete, setSessionComplete]);
  
  // Improved advance to next question function with race condition protection
  const advanceToNextQuestion = useCallback(() => {
    // Skip if in transition lockout period
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < 1000) { // Increased from 800ms to 1000ms
      console.log("Transition debounced - too soon after previous transition");
      return;
    }
    
    // Skip if already processing a transition
    if (transitionLockRef.current) {
      console.log("Transition already in progress, ignoring request");
      return;
    }
    
    // Skip if we've already processed this index
    if (lastProcessedIndexRef.current === currentQuestionIndex) {
      console.log(`Already processed transition for index ${currentQuestionIndex}`);
      return;
    }
    
    // Lock transitions and update timestamp and processed index
    transitionLockRef.current = true;
    lastTransitionTimeRef.current = now;
    lastProcessedIndexRef.current = currentQuestionIndex;
    
    console.log(`Advancing from question ${currentQuestionIndex + 1} to ${currentQuestionIndex + 2}`);
    
    // Disable interaction during transition
    document.body.style.pointerEvents = 'none';
    
    // Update question index with a slight delay to allow state to settle
    setTimeout(() => {
      console.log(`Setting current question index to ${currentQuestionIndex + 1}`);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      
      // Release lock after delay to ensure state updates complete
      setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
        transitionLockRef.current = false;
      }, 500);
    }, 100);
  }, [currentQuestionIndex, setCurrentQuestionIndex]);
  
  return { advanceToNextQuestion };
};
