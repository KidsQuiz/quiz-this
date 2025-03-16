
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
      
      console.log("Resetting question state before loading new question");
      
      // Force a complete reset of all question-related state
      // The order matters here - reset selection first
      setSelectedAnswerId(null);
      
      // Add a small delay to ensure state updates properly
      // This helps with the tablet/mobile issue where state persists
      setTimeout(() => {
        setAnswerSubmitted(false);
        setIsCorrect(false);
        setShowWowEffect(false);
        
        const question = questions[currentQuestionIndex];
        console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`, question.id);
        setCurrentQuestion(question);
        setTimeRemaining(question.time_limit);
        
        // Load answer options for the new question
        loadAnswerOptions(question.id).then(() => {
          // Start the timer only after everything is loaded and reset
          setTimerActive(true);
          console.log("Question fully loaded and timer started");
        });
      }, 50); // Small delay to ensure state updates properly
    };
    
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
