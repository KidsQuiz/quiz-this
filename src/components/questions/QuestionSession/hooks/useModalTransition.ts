
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
        
        // Re-open the modal with a slight delay to ensure state updates properly
        setTimeout(() => {
          console.log('Re-opening modal for next question');
          setIsModalOpen(true);
        }, 50);
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
