
import { useEffect, useRef } from 'react';
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
  // Create a ref to track the ongoing setup process
  const setupInProgressRef = useRef(false);
  
  // Set up current question whenever the index changes
  useEffect(() => {
    // Skip if we're still configuring
    if (isConfiguring) return;
    
    // Prevent duplicate setups
    if (setupInProgressRef.current) {
      console.log("Question setup already in progress, skipping duplicate");
      return;
    }
    
    setupInProgressRef.current = true;
    
    // Get the question at the current index
    const question = questions[currentQuestionIndex];
    
    if (question) {
      console.log(`Setting up question ${currentQuestionIndex + 1}/${questions.length}: ${question.id}`);
      
      // First, stop the timer and disable interactions
      setTimerActive(false);
      
      // Reset state for new question
      setCurrentQuestion(question);
      setTimeRemaining(question.time_limit || 30);
      setAnswerSubmitted(false);
      setSelectedAnswerId(null);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      // Load answer options for this question
      const setupQuestion = async () => {
        try {
          await loadAnswerOptions(question.id);
          
          // Start the timer AFTER options are loaded
          console.log(`Starting timer for ${question.time_limit} seconds`);
          setTimerActive(true);
          
          // Setup is complete
          setupInProgressRef.current = false;
        } catch (error) {
          console.error("Error loading answer options:", error);
          setupInProgressRef.current = false;
        }
      };
      
      setupQuestion();
    } else {
      // No valid question at this index
      console.log(`No question found at index ${currentQuestionIndex}`);
      setCurrentQuestion(null);
      setTimerActive(false);
      setupInProgressRef.current = false;
    }
    
    // Cleanup function
    return () => {
      setupInProgressRef.current = false;
    };
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
