
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
      
      // CRITICAL: Immediately stop timer and disable UI interaction
      setTimerActive(false);
      
      // CRITICAL: Reset selection state immediately - multiple resets for redundancy
      setSelectedAnswerId(null);
      
      // Create a complete hard reset function that we can call multiple times
      const forceCompleteReset = () => {
        console.log("Applying FORCED complete reset of answer state");
        // Triple-reset the selected answer ID to ensure it clears on all devices
        setSelectedAnswerId(null);
        
        // Reset all other question-related state
        setAnswerSubmitted(false);
        setIsCorrect(false);
        setShowWowEffect(false);
      };
      
      // Apply forced reset immediately
      forceCompleteReset();
      
      // Use multiple staggered timeouts to ensure state resets properly
      // First reset with small delay
      setTimeout(() => {
        forceCompleteReset();
        
        // Second reset with larger delay
        setTimeout(() => {
          forceCompleteReset();
          
          // Only after multiple resets, load the new question
          const question = questions[currentQuestionIndex];
          console.log(`Loading question ${currentQuestionIndex + 1}/${questions.length}`, question.id);
          
          // Set current question and time limit
          setCurrentQuestion(question);
          setTimeRemaining(question.time_limit);
          
          // Load answer options for the new question
          loadAnswerOptions(question.id).then(() => {
            // CRITICAL: Reset selection state again after options loaded
            setSelectedAnswerId(null);
            console.log("Answer options loaded, selection state forcibly reset to:", null);
            
            // Final reset before activating the timer
            setTimeout(() => {
              forceCompleteReset();
              console.log("Final state reset before activating timer");
              
              // Start the timer only after everything is loaded and reset
              setTimeout(() => {
                // One final check before starting timer
                setSelectedAnswerId(null);
                setTimerActive(true);
                console.log("Question fully loaded and timer started, confirmed selection state:", null);
              }, 150);
            }, 100);
          });
        }, 100);
      }, 100);
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
