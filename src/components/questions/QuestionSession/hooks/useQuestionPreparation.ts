
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles preparation of the current question and resets state
 */
export const useQuestionPreparation = (
  isConfiguring: boolean,
  questions: Question[],
  currentQuestionIndex: number,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>,
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>,
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>,
  loadAnswerOptions: (questionId: string) => Promise<void>
) => {
  // Set up the current question when question index changes
  useEffect(() => {
    if (isConfiguring) return;
    
    const setupQuestion = async () => {
      // Reset all answer-related state when loading a new question
      setAnswerSubmitted(false);
      setSelectedAnswerId(null);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      // Check if we have a valid question at this index
      if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        console.log(`Setting up question ${currentQuestionIndex + 1}/${questions.length}: ${question.id}`);
        
        // Set current question
        setCurrentQuestion(question);
        
        // Reset timer to question's time limit
        setTimeRemaining(question.time_limit || 30);
        setTimerActive(true);
        
        // Load answer options for this question
        await loadAnswerOptions(question.id);
      } else {
        // No valid question at this index
        setCurrentQuestion(null);
        setTimerActive(false);
      }
    };
    
    setupQuestion();
  }, [
    isConfiguring,
    currentQuestionIndex,
    questions,
    setCurrentQuestion,
    setTimeRemaining,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setShowWowEffect,
    setTimerActive,
    loadAnswerOptions
  ]);
};
