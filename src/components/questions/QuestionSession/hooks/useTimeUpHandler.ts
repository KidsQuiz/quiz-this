
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useTimeUpHandler = (
  timeRemaining: number,
  answerSubmitted: boolean,
  currentQuestion: Question | null,
  timerActive: boolean,
  questions: Question[],
  currentQuestionIndex: number,
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>,
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>,
  setShowRelaxAnimation: React.Dispatch<React.SetStateAction<boolean>>,
  resetAnswerState: () => void,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle time up - automatically move to next question
  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted && currentQuestion && timerActive) {
      console.log("Time's up for question:", currentQuestion.content);
      
      // Show incorrect feedback
      setAnswerSubmitted(true);
      setIsCorrect(false);
      setTimerActive(false);
      
      // Play wrong sound
      // We can't use playWrongSound() here as it would create a circular dependency
      const audio = new Audio('/sounds/wrong.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Error playing sound:", e));
      
      // Show relax animation
      setShowRelaxAnimation(true);
      
      // Move to next question after delay
      setTimeout(() => {
        // Reset state
        resetAnswerState();
        setShowRelaxAnimation(false);
        
        // Move to next question
        setCurrentQuestionIndex(prev => {
          const next = prev + 1;
          if (next >= questions.length) {
            setSessionComplete(true);
            setShowBoomEffect(true);
            return prev;
          }
          return next;
        });
        
        // Restart timer for next question if not the last
        setTimeout(() => {
          const isLastQuestion = currentQuestionIndex + 1 >= questions.length;
          if (!isLastQuestion) {
            setTimerActive(true);
          }
        }, 500);
      }, 2500);
    }
  }, [
    answerSubmitted,
    currentQuestion,
    currentQuestionIndex,
    questions.length,
    resetAnswerState,
    setAnswerSubmitted,
    setCurrentQuestionIndex,
    setIsCorrect,
    setSessionComplete,
    setShowBoomEffect,
    setShowRelaxAnimation,
    setTimerActive,
    timeRemaining,
    timerActive
  ]);
};
