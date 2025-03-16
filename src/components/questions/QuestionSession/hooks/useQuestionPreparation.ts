
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Hook that handles loading and preparing the current question
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
  // Set up current question whenever the index changes
  useEffect(() => {
    // Skip if we're still configuring
    if (isConfiguring) return;
    
    // Get the question at the current index
    const question = questions[currentQuestionIndex];
    
    if (question) {
      console.log(`Setting up question ${currentQuestionIndex + 1}: ${question.id}`);
      
      // Reset state for new question
      setCurrentQuestion(question);
      setTimeRemaining(question.time_limit);
      setAnswerSubmitted(false);
      setSelectedAnswerId(null);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      // Start the timer
      console.log(`Starting timer for ${question.time_limit} seconds`);
      setTimerActive(true);
      
      // Load answer options for this question
      loadAnswerOptions(question.id);
    }
  }, [
    isConfiguring,
    questions,
    currentQuestionIndex,
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
