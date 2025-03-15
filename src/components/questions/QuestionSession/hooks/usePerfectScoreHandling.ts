
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const usePerfectScoreHandling = (
  sessionComplete: boolean,
  correctAnswers: number,
  questions: Question[],
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const isPerfectScore = correctAnswers === questions.length && questions.length > 0;
  
  // Watch for session completion with a perfect score
  useEffect(() => {
    if (sessionComplete && isPerfectScore) {
      console.log("Perfect score detected, preparing boom effect");
      
      // Delay the boom effect slightly to ensure it appears after the session completes
      setTimeout(() => {
        setShowBoomEffect(true);
      }, 500);
      
      // Close the dialog with a delay to show the completion screen briefly
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
    }
  }, [sessionComplete, isPerfectScore, setShowBoomEffect, setIsModalOpen]);
  
  return {
    isPerfectScore
  };
};
