
import { useEffect, useCallback, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles transitions between questions and session states
 * Improved to fix race conditions and prevent going back to first question
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
  const targetQuestionIndexRef = useRef(-1);
  
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
  
  // Track the target question index to prevent reverting back to first question
  useEffect(() => {
    // Only update the target if this is a forward progression
    if (currentQuestionIndex > targetQuestionIndexRef.current) {
      console.log(`Updating target question index to ${currentQuestionIndex}`);
      targetQuestionIndexRef.current = currentQuestionIndex;
    } else if (currentQuestionIndex < targetQuestionIndexRef.current) {
      // Detected an invalid backward movement, correct it
      console.log(`Detected backward question movement: ${currentQuestionIndex} < ${targetQuestionIndexRef.current}, correcting`);
      
      // Add a small delay to ensure we're not fighting with other state updates
      setTimeout(() => {
        console.log(`Correcting question index back to ${targetQuestionIndexRef.current}`);
        setCurrentQuestionIndex(targetQuestionIndexRef.current);
      }, 50);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);
  
  // Improved advance to next question function with race condition protection
  const advanceToNextQuestion = useCallback(() => {
    // Skip if in transition lockout period
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < 1500) { // Increased from 1000ms to 1500ms
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
    
    // Calculate the next index
    const nextIndex = currentQuestionIndex + 1;
    console.log(`Advancing from question ${currentQuestionIndex + 1} to ${nextIndex + 1}`);
    
    // Update the target index reference to prevent reverting back
    targetQuestionIndexRef.current = nextIndex;
    
    // Disable interaction during transition
    document.body.style.pointerEvents = 'none';
    
    // Update question index with a slight delay to allow state to settle
    setTimeout(() => {
      console.log(`Setting current question index to ${nextIndex}`);
      setCurrentQuestionIndex(nextIndex);
      
      // Release lock after delay to ensure state updates complete
      setTimeout(() => {
        document.body.style.removeProperty('pointer-events');
        transitionLockRef.current = false;
      }, 800); // Increased from 500ms to 800ms
    }, 200); // Increased from 100ms to 200ms
  }, [currentQuestionIndex, setCurrentQuestionIndex]);
  
  return { advanceToNextQuestion };
};
