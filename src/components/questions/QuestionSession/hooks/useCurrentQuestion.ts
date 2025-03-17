
import { useEffect, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

/**
 * Improved hook to handle current question loading and setup with better race condition protection
 */
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
  // Track loading state to prevent duplicate loads
  const loadingRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Skip during configuration or with no questions
    if (isConfiguring || questions.length === 0) return;
    
    // Skip if already processed this index
    if (lastProcessedIndexRef.current === currentQuestionIndex) {
      console.log(`Question index ${currentQuestionIndex} already processed, skipping`);
      return;
    }
    
    // Skip if beyond question range
    if (currentQuestionIndex >= questions.length) {
      console.log(`Question index ${currentQuestionIndex} is beyond available questions`);
      return;
    }
    
    // Skip if already loading
    if (loadingRef.current) {
      console.log(`Question loading in progress, skipping`);
      return;
    }
    
    console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`);
    loadingRef.current = true;
    lastProcessedIndexRef.current = currentQuestionIndex;
    
    // Disable interaction during load
    document.body.style.pointerEvents = 'none';
    setTimerActive(false);
    
    // Reset answer state immediately
    setSelectedAnswerId(null);
    setAnswerSubmitted(false);
    setIsCorrect(false);
    setShowWowEffect(false);
    
    // Add a slight delay to ensure state has settled before loading the new question
    setupTimeoutRef.current = setTimeout(() => {
      // Get deep clone of current question to avoid reference issues
      const question = structuredClone(questions[currentQuestionIndex]);
      console.log(`Loading question: ${question.id}`);
      
      // Set time limit with validation
      const timeLimit = typeof question.time_limit === 'number' && question.time_limit > 0 
        ? question.time_limit 
        : 30;
      
      // Update state with new question
      setCurrentQuestion(question);
      setTimeRemaining(timeLimit);
      
      // Load answer options
      loadAnswerOptions(question.id)
        .then(() => {
          console.log(`Answer options loaded for question ${question.id}`);
          
          // Enable interaction and start timer
          document.body.style.removeProperty('pointer-events');
          
          // Add a slight delay before starting the timer
          setTimeout(() => {
            setTimerActive(true);
            loadingRef.current = false;
          }, 200);
        })
        .catch(error => {
          console.error("Error loading answer options:", error);
          document.body.style.removeProperty('pointer-events');
          loadingRef.current = false;
        });
    }, 100);
    
    return () => {
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }
      document.body.style.removeProperty('pointer-events');
    };
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
