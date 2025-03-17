
import { useEffect, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Simplified hook to handle modal transitions between questions
 */
export const useModalTransition = (
  isModalOpen: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  correctAnswers: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Single transition lock ref
  const transitionLockRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);
  
  // Handle modal closing to advance to next question
  useEffect(() => {
    // Only process when modal closes during active session
    if (isModalOpen || sessionComplete || questions.length === 0 || 
        currentQuestionIndex >= questions.length) {
      return;
    }
    
    // Skip if already processed this index
    if (lastProcessedIndexRef.current === currentQuestionIndex) {
      console.log(`Already processed transition for index ${currentQuestionIndex}`);
      return;
    }
    
    // Skip if transition is in progress
    if (transitionLockRef.current) {
      console.log("Modal transition locked, skipping");
      return;
    }
    
    // Lock transition and mark index as processed
    transitionLockRef.current = true;
    lastProcessedIndexRef.current = currentQuestionIndex;
    
    console.log(`Modal closed for question ${currentQuestionIndex + 1}, handling transition`);
    
    // Determine next action based on question index
    const nextQuestionIndex = currentQuestionIndex + 1;
    
    if (nextQuestionIndex >= questions.length) {
      // End of questions reached
      console.log('Last question completed, ending session');
      setSessionComplete(true);
      
      // Check for perfect score (skip modal for celebration)
      const isPerfectScore = correctAnswers === questions.length && questions.length > 0;
      if (!isPerfectScore) {
        // Show summary for non-perfect scores after delay
        setTimeout(() => {
          console.log('Reopening modal with summary');
          setIsModalOpen(true);
          transitionLockRef.current = false;
        }, 1000);
      } else {
        transitionLockRef.current = false;
      }
    } else {
      // Advance to next question
      console.log(`Advancing to question ${nextQuestionIndex + 1}`);
      setCurrentQuestionIndex(nextQuestionIndex);
      
      // Reopen modal with next question after delay
      setTimeout(() => {
        console.log('Reopening modal with next question');
        setIsModalOpen(true);
        transitionLockRef.current = false;
      }, 1000);
    }
  }, [
    isModalOpen, 
    sessionComplete, 
    currentQuestionIndex, 
    questions, 
    correctAnswers, 
    setCurrentQuestionIndex, 
    setIsModalOpen, 
    setSessionComplete
  ]);
};
