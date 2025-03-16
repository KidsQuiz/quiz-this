
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
        // Immediately advance to next question index
        console.log(`Advancing to question ${nextQuestionIndex + 1}`);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Store transition time for debugging
        const transitionTime = Date.now();
        console.log(`Starting modal transition at time: ${transitionTime}`);
        
        // Re-open the modal with a significant delay to ensure state updates properly
        setTimeout(() => {
          console.log(`Re-opening modal for next question at ${Date.now() - transitionTime}ms after transition start`);
          
          // Make sure pointer events are enabled before showing next question
          document.body.style.removeProperty('pointer-events');
          
          setIsModalOpen(true);
        }, 500); // Significantly increased delay for more reliable state update
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
