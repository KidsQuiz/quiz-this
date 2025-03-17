
import { useEffect, useRef } from 'react';
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
  // Create a ref to track latest question ID to prevent race conditions
  const currentQuestionIdRef = useRef<string | null>(null);
  // Track the last processed index to detect genuine changes
  const lastProcessedIndexRef = useRef<number>(-1);
  // Track active operation to prevent overlapping loads
  const loadingOperationRef = useRef<string | null>(null);
  // Track the last time we processed this index
  const lastProcessedTimeRef = useRef<number>(0);
  
  // Display the current question
  useEffect(() => {
    if (isConfiguring || questions.length === 0) return;
    
    // Prevent processing the same index in quick succession
    const now = Date.now();
    if (lastProcessedIndexRef.current === currentQuestionIndex && 
        now - lastProcessedTimeRef.current < 1000) {
      console.log(`Already processed question index ${currentQuestionIndex} recently, skipping duplicate load`);
      return;
    }
    
    // Skip if we've reached the end of questions
    if (currentQuestionIndex >= questions.length) {
      console.log(`Question index ${currentQuestionIndex} is beyond available questions (${questions.length})`);
      return;
    }
    
    console.log(`====== DETECTED INDEX CHANGE TO ${currentQuestionIndex} (from ${lastProcessedIndexRef.current}) ======`);
    
    // Update last processed time
    lastProcessedTimeRef.current = now;
    
    // Update last processed index immediately to prevent duplicate processing
    lastProcessedIndexRef.current = currentQuestionIndex;
    
    // Generate a unique operation ID for this load sequence
    const operationId = `load_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    loadingOperationRef.current = operationId;
    
    const loadCurrentQuestion = async () => {
      console.log(`-------- STARTING NEW QUESTION LOAD SEQUENCE (${operationId}) --------`);
      console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`);
      
      // CRITICAL: Immediately disable UI and stop timer
      document.body.style.pointerEvents = 'none';
      setTimerActive(false);
      
      // CRITICAL: Forcefully reset selection state - even before loading anything
      setSelectedAnswerId(null);
      setAnswerSubmitted(false);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      // Clear any lingering visual styling in the DOM
      const clearDomState = () => {
        const allButtons = document.querySelectorAll('[data-answer-option]');
        allButtons.forEach(button => {
          button.setAttribute('data-selected', 'false');
          button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md', 
                               'border-green-500', 'bg-green-50', 'dark:bg-green-950/30',
                               'border-red-500', 'bg-red-50', 'dark:bg-red-950/30');
        });
      };
      
      // Apply visual state reset immediately
      clearDomState();
      
      // Check if this is still the active operation
      if (loadingOperationRef.current !== operationId) {
        console.log(`Operation ${operationId} has been superseded, aborting`);
        document.body.style.removeProperty('pointer-events');
        return;
      }
      
      // Create a new question ID unique to this load sequence to prevent race conditions
      const newQuestionLoadId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      currentQuestionIdRef.current = newQuestionLoadId;
      
      // Get the question at the current index
      if (!questions[currentQuestionIndex]) {
        console.error(`No question found at index ${currentQuestionIndex}`);
        document.body.style.removeProperty('pointer-events');
        return;
      }
      
      // CRITICAL: Deep clone the question to avoid reference issues that could cause the same question to reappear
      const question = JSON.parse(JSON.stringify(questions[currentQuestionIndex]));
      console.log(`Loading question data for index ${currentQuestionIndex}:`, question.id);
      
      // Ensure time_limit is a valid number
      const questionTimeLimit = typeof question.time_limit === 'number' && question.time_limit > 0 
        ? question.time_limit 
        : 30;
      
      console.log(`Question time limit: ${questionTimeLimit} seconds`);
      
      // Check if this is still the active operation
      if (loadingOperationRef.current !== operationId) {
        console.log(`Operation ${operationId} has been superseded during question setup, aborting`);
        document.body.style.removeProperty('pointer-events');
        return;
      }
      
      // Set current question and time limit
      setCurrentQuestion(question);
      setTimeRemaining(questionTimeLimit);
      
      // Load answer options for the new question
      try {
        // Check if this is still the active operation
        if (loadingOperationRef.current !== operationId) {
          console.log(`Operation ${operationId} has been superseded before loading options, aborting`);
          document.body.style.removeProperty('pointer-events');
          return;
        }
        
        await loadAnswerOptions(question.id);
        console.log(`Answer options loaded for question ${question.id}`);
        
        // Check if this is still the active load sequence
        if (currentQuestionIdRef.current !== newQuestionLoadId || loadingOperationRef.current !== operationId) {
          console.log(`Operation ${operationId} has been superseded after loading options, aborting`);
          document.body.style.removeProperty('pointer-events');
          return;
        }
        
        // Final reset before activating timer
        setSelectedAnswerId(null);
        setAnswerSubmitted(false);
        clearDomState();
        
        // Re-enable UI interactions
        document.body.style.removeProperty('pointer-events');
        
        // Start the timer using the question's time limit
        console.log(`Starting timer with ${questionTimeLimit} seconds for question ${question.id}`);
        setTimerActive(true);
        console.log(`Question ${currentQuestionIndex + 1} fully loaded and timer started`);
        console.log(`-------- QUESTION LOAD SEQUENCE (${operationId}) COMPLETE --------`);
      } catch (error) {
        console.error("Error loading answer options:", error);
        document.body.style.removeProperty('pointer-events');
      }
    };
    
    loadCurrentQuestion();
    
    // Cleanup function
    return () => {
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
