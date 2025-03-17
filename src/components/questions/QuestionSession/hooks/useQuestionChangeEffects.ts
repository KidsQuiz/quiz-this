
import { useEffect, useRef } from 'react';
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
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>,
  updateTimeLimit: (newTimeLimit: number) => void,
  resetAndStartTimer: (seconds: number) => void
) => {
  // Track the last processed question index to prevent duplicate processing
  const lastProcessedIndexRef = useRef<number>(-1);
  const setupInProgressRef = useRef(false);
  
  // Update current question when index changes
  useEffect(() => {
    if (!questions.length || !initialLoadComplete) return;
    
    // Skip if index is beyond questions array bounds
    if (currentQuestionIndex >= questions.length) {
      return;
    }
    
    // Skip if we're already processing this question index
    if (lastProcessedIndexRef.current === currentQuestionIndex || setupInProgressRef.current) {
      console.log(`Question ${currentQuestionIndex} is already being processed or was processed, skipping`);
      return;
    }
    
    // Mark that we're starting to process this question
    setupInProgressRef.current = true;
    lastProcessedIndexRef.current = currentQuestionIndex;
    
    const question = questions[currentQuestionIndex];
    console.log(`Setting up question ${currentQuestionIndex + 1}/${questions.length}: ${question.content}`);
    console.log("Question time limit:", question.time_limit || 30);
    
    // First, stop any existing timer and reset answer state
    setTimerActive(false);
    resetAnswerState();
    setAnswerSubmitted(false);
    setSelectedAnswerId(null);
    setIsCorrect(false);
    
    // Set the current question
    setCurrentQuestion(question);
    
    // Load answer options for the new question
    const setupQuestion = async () => {
      try {
        await loadAnswerOptions(question.id);
        
        // Set the timer based on the question's time limit
        if (!sessionComplete) {
          // Get time limit from the question, with fallback to 30 seconds
          const timeLimit = question.time_limit || 30;
          
          // Ensure we use the correct time limit from this question
          console.log(`Setting time limit for question ${currentQuestionIndex + 1} to ${timeLimit} seconds`);
          updateTimeLimit(timeLimit);
          
          // Reset and start timer with the correct time limit
          console.log(`Resetting and starting timer with ${timeLimit} seconds`);
          resetAndStartTimer(timeLimit);
        }
        
        // Setup is complete
        setupInProgressRef.current = false;
      } catch (error) {
        console.error("Error loading answer options:", error);
        setupInProgressRef.current = false;
      }
    };
    
    setupQuestion();
    
    // Cleanup function
    return () => {
      setupInProgressRef.current = false;
    };
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
    setTimerActive,
    updateTimeLimit,
    resetAndStartTimer
  ]);
};
