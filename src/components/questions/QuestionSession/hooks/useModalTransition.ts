
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useModalTransition = (
  isModalOpen: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Advance to the next question when modal is closed
  useEffect(() => {
    if (!isModalOpen && !sessionComplete && currentQuestionIndex < questions.length) {
      console.log(`Modal closed, current question index: ${currentQuestionIndex}, total questions: ${questions.length}`);
      
      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex >= questions.length) {
        // If we've reached the end, mark session as complete
        console.log('Reached end of questions, completing session');
        setSessionComplete(true);
      } else {
        // CRITICAL: Immediately advance to next question index
        console.log(`Advancing to question ${nextQuestionIndex + 1}`);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Store transition time for debugging
        const transitionTime = Date.now();
        console.log(`TRANSITION: Modal closed at ${transitionTime}, scheduling reopen with delay`);
        
        // CRITICAL: Use setTimeout with a LONGER delay to ensure complete DOM updates
        // and proper React rendering cycle completion before reopening
        setTimeout(() => {
          console.log(`TRANSITION: Reopening modal after ${Date.now() - transitionTime}ms delay`);
          
          // Make sure pointer events are enabled before showing next question
          document.body.style.removeProperty('pointer-events');
          
          // CRITICAL: Force clean state before reopening modal
          setTimeout(() => {
            console.log("TRANSITION: Final state reset before reopening modal");
            // This will reopen the modal with the next question
            setIsModalOpen(true);
          }, 50);
        }, 800); // Significantly increased delay for more reliable transition
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
