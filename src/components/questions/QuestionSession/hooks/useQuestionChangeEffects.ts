
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useQuestionChangeEffects = (
  currentQuestionIndex: number,
  initialLoadComplete: boolean,
  questions: Question[],
  sessionComplete: boolean,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
  resetAnswerState: () => void,
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>,
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>,
  loadAnswerOptions: (questionId: string) => Promise<void>,
  setTimeRemaining: (newTime: number) => void,
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Update current question when index changes
  useEffect(() => {
    if (!questions.length || !initialLoadComplete) return;
    
    if (currentQuestionIndex >= questions.length) {
      return;
    }
    
    const question = questions[currentQuestionIndex];
    console.log("Setting current question:", question?.content);
    setCurrentQuestion(question);
    
    // Reset answer state when question changes
    resetAnswerState();
    setAnswerSubmitted(false);
    setSelectedAnswerId(null);
    setIsCorrect(false);
    
    // Load answer options for the new question
    loadAnswerOptions(question.id);
    
    // Set the timer based on the question's time limit
    if (question.time_limit && !sessionComplete) {
      setTimeRemaining(question.time_limit);
      // Start the timer after a short delay to allow the UI to update
      setTimeout(() => {
        setTimerActive(true);
      }, 500);
    }
  }, [
    currentQuestionIndex,
    initialLoadComplete,
    loadAnswerOptions,
    questions,
    resetAnswerState,
    sessionComplete,
    setAnswerSubmitted,
    setCurrentQuestion,
    setIsCorrect,
    setSelectedAnswerId,
    setTimeRemaining,
    setTimerActive
  ]);
};
