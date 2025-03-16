
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useCurrentQuestion = (
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
  // Display the current question
  useEffect(() => {
    if (isConfiguring || questions.length === 0) return;
    
    const loadCurrentQuestion = async () => {
      // Check if we've reached the end of questions
      if (currentQuestionIndex >= questions.length) return;
      
      // Complete reset of all question-related state before loading the new question
      // This ensures no highlight persists between questions
      setAnswerSubmitted(false);
      setSelectedAnswerId(null); // Explicitly set to null to clear any previous selection
      setIsCorrect(false);
      setShowWowEffect(false);
      
      const question = questions[currentQuestionIndex];
      setCurrentQuestion(question);
      setTimeRemaining(question.time_limit);
      
      // Load answer options for the new question
      // Make sure to reset states before answer options are loaded
      await loadAnswerOptions(question.id);
      
      // Start the timer for this question
      setTimerActive(true);
    };
    
    // Ensure we have a clean slate for the next question
    loadCurrentQuestion();
  }, [
    currentQuestionIndex, 
    isConfiguring, 
    questions, 
    loadAnswerOptions, 
    setAnswerSubmitted, 
    setCurrentQuestion, 
    setIsCorrect, 
    setSelectedAnswerId, 
    setShowWowEffect, 
    setTimeRemaining, 
    setTimerActive
  ]);
};
