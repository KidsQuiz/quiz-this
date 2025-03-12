
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useModalTransition = (
  isModalOpen: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  timeBetweenQuestions: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Advance to the next question when modal is closed
  useEffect(() => {
    if (!isModalOpen && !sessionComplete && currentQuestionIndex < questions.length) {
      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex >= questions.length) {
        // If we've reached the end, mark session as complete
        setSessionComplete(true);
      } else {
        // Otherwise, set up a timer to show the next question
        const timer = setTimeout(() => {
          setCurrentQuestionIndex(nextQuestionIndex);
          setIsModalOpen(true);
        }, timeBetweenQuestions * 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, timeBetweenQuestions, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
