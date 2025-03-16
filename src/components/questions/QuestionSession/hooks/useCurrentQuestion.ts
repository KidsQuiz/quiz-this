
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
  
  // Display the current question
  useEffect(() => {
    if (isConfiguring || questions.length === 0) return;
    
    const loadCurrentQuestion = async () => {
      // Check if we've reached the end of questions
      if (currentQuestionIndex >= questions.length) return;
      
      console.log("-------- STARTING NEW QUESTION LOAD SEQUENCE --------");
      console.log("Aggressively resetting ALL answer state before loading new question");
      
      // CRITICAL: Immediately disable UI and stop timer
      document.body.style.pointerEvents = 'none';
      setTimerActive(false);
      
      // CRITICAL: Forcefully reset selection state - even before loading anything
      setSelectedAnswerId(null);
      
      // RESET ALL question-related state immediately with high priority
      const forceCompleteReset = () => {
        console.log("FORCED RESET: Aggressively clearing all answer state");
        setSelectedAnswerId(null);
        setAnswerSubmitted(false);
        setIsCorrect(false);
        setShowWowEffect(false);
        
        // Force browser to process these state changes
        setTimeout(() => {
          setSelectedAnswerId(null);
        }, 0);
      };
      
      // Apply first forced reset immediately
      forceCompleteReset();
      
      // Create a new question ID unique to this load sequence to prevent race conditions
      const newQuestionLoadId = `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      currentQuestionIdRef.current = newQuestionLoadId;
      
      // Use a sequence of staggered resets for maximum reliability
      setTimeout(() => {
        // Check if this is still the active load sequence
        if (currentQuestionIdRef.current !== newQuestionLoadId) {
          console.log("Aborting question load - superseded by newer request");
          return;
        }
        
        forceCompleteReset();
        
        // Second reset with larger delay
        setTimeout(() => {
          // Check if this is still the active load sequence
          if (currentQuestionIdRef.current !== newQuestionLoadId) return;
          
          forceCompleteReset();
          
          // Only after multiple resets, start loading the new question
          const question = questions[currentQuestionIndex];
          console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`, question.id);
          
          // Set current question and time limit
          setCurrentQuestion(question);
          setTimeRemaining(question.time_limit);
          
          // Final reset before loading options
          setSelectedAnswerId(null);
          
          // Load answer options for the new question
          loadAnswerOptions(question.id).then(() => {
            // Check if this is still the active load sequence
            if (currentQuestionIdRef.current !== newQuestionLoadId) return;
            
            // CRITICAL: Reset selection state again after options loaded
            setSelectedAnswerId(null);
            console.log("Answer options loaded, FORCED selection state reset to:", null);
            
            // Add 2 additional resets with delays to ensure it takes effect
            setTimeout(() => {
              if (currentQuestionIdRef.current !== newQuestionLoadId) return;
              forceCompleteReset();
              setSelectedAnswerId(null);
              
              // Re-enable UI interactions
              document.body.style.removeProperty('pointer-events');
              
              console.log("Final state reset before activating timer");
              
              // Start the timer only after everything is loaded and reset
              setTimeout(() => {
                if (currentQuestionIdRef.current !== newQuestionLoadId) return;
                
                // Final confirmation reset
                setSelectedAnswerId(null);
                setTimerActive(true);
                console.log("Question fully loaded and timer started");
                console.log("CONFIRMED selection state:", null);
                console.log("-------- QUESTION LOAD SEQUENCE COMPLETE --------");
              }, 250);
            }, 150);
          });
        }, 150);
      }, 150);
    };
    
    loadCurrentQuestion();
    
    // Cleanup function to remove any lingering pointer-events styles
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
