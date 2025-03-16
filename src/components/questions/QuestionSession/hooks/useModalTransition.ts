import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

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
  // Advance to the next question when modal is closed
  useEffect(() => {
    // Only process if modal is closed, session is not complete, and we have valid questions
    if (!isModalOpen && !sessionComplete && questions.length > 0 && currentQuestionIndex < questions.length) {
      console.log(`Modal closed, current question index: ${currentQuestionIndex}, total questions: ${questions.length}`);
      
      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex >= questions.length) {
        // If we've reached the end, mark session as complete
        console.log('Reached end of questions, completing session');
        setSessionComplete(true);
        
        // Check for perfect score
        const isPerfectScore = correctAnswers === questions.length && questions.length > 0;
        if (isPerfectScore) {
          // For perfect scores, keep the modal closed
          console.log("Perfect score detected - keeping modal closed");
        } else {
          // For non-perfect scores, reopen the modal for the summary screen
          console.log("Non-perfect score - reopening modal for summary");
          
          // Store transition time for debugging
          const transitionTime = Date.now();
          console.log(`TRANSITION: Modal closed at ${transitionTime}, scheduling reopen with delay`);
          
          // CRITICAL: Use setTimeout with a LONGER delay to ensure complete DOM updates
          setTimeout(() => {
            console.log(`TRANSITION: Reopening modal after ${Date.now() - transitionTime}ms delay`);
            
            // Make sure pointer events are enabled before showing summary
            document.body.style.removeProperty('pointer-events');
            
            // This will reopen the modal with the summary screen
            setIsModalOpen(true);
          }, 800);
        }
      } else {
        // CRITICAL: Immediately advance to next question index
        console.log(`Advancing to question ${nextQuestionIndex + 1}`);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Store transition time for debugging
        const transitionTime = Date.now();
        console.log(`TRANSITION: Modal closed at ${transitionTime}, scheduling reopen with delay`);
        
        // CRITICAL: Ensure the modal reopens with the next question
        // Use setTimeout with a longer delay to ensure complete DOM updates
        setTimeout(() => {
          console.log(`TRANSITION: Reopening modal after ${Date.now() - transitionTime}ms delay`);
          
          // Make sure pointer events are enabled before showing next question
          document.body.style.removeProperty('pointer-events');
          
          // Reopen the modal with the next question
          setIsModalOpen(true);
        }, 800);
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, correctAnswers, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
