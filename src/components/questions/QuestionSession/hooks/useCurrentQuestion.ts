
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
      
      // We need to ensure UI is fully reset between questions
      // Immediately disable the timer to prevent interactions during this time
      setTimerActive(false);
      
      // Force a reset of answer-related state with a delay
      // This helps with the tablet/mobile issue where state persists
      setTimeout(() => {
        // Ensure selected answer is definitely null
        setSelectedAnswerId(null);
        setAnswerSubmitted(false);
        setIsCorrect(false);
        setShowWowEffect(false);
        
        const question = questions[currentQuestionIndex];
        console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`, question.id);
        setCurrentQuestion(question);
        setTimeRemaining(question.time_limit);
        
        // Load answer options for the new question
        loadAnswerOptions(question.id).then(() => {
          // One final reset of selection state after options are loaded
          setSelectedAnswerId(null);
          
          // Start the timer only after everything is loaded and reset
          setTimeout(() => {
            setTimerActive(true);
            console.log("Question fully loaded and timer started, confirmed selection state:", null);
          }, 50);
        });
      }, 100); // Increased delay to ensure state updates properly
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
