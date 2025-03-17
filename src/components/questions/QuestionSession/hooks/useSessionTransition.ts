
import { useEffect, useCallback, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles transitions between questions and session states
 * Simplified to focus on core transition logic with better safeguards
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
  // Single ref to prevent duplicate transitions
  const transitionLockRef = useRef(false);
  const lastTransitionTimeRef = useRef(0);
  
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
  
  // Simplified advance to next question function
  const advanceToNextQuestion = useCallback(() => {
    // Skip if in transition lockout period
    const now = Date.now();
    if (now - lastTransitionTimeRef.current < 800) {
      console.log("Transition debounced - too soon after previous transition");
      return;
    }
    
    // Skip if already processing a transition
    if (transitionLockRef.current) {
      console.log("Transition already in progress, ignoring request");
      return;
    }
    
    // Lock transitions and update timestamp
    transitionLockRef.current = true;
    lastTransitionTimeRef.current = now;
    
    console.log(`Advancing from question ${currentQuestionIndex + 1} to ${currentQuestionIndex + 2}`);
    
    // Reset any DOM state before transition
    document.body.style.pointerEvents = 'none';
    
    // Update question index
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    
    // Release lock after delay to ensure state updates complete
    setTimeout(() => {
      document.body.style.removeProperty('pointer-events');
      transitionLockRef.current = false;
    }, 500);
  }, [currentQuestionIndex, setCurrentQuestionIndex]);
  
  return { advanceToNextQuestion };
};
