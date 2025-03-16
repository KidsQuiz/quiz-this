
import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

/**
 * Manages timeout effects when time runs out for a question
 */
export const useTimeoutEffects = (
  timeRemaining: number,
  currentQuestion: Question | null,
  isConfiguring: boolean,
  sessionComplete: boolean,
  answerSubmitted: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  answerOptions: AnswerOption[],
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  // Create a ref to track if advancement is already scheduled
  const advancementScheduledRef = useRef(false);
  
  // Handle when time runs out for a question
  useEffect(() => {
    // Skip if any of these conditions are met
    if (!currentQuestion || isConfiguring || sessionComplete) return;
    
    // Only process if timer reaches zero and answer is not already submitted
    if (timeRemaining === 0 && !answerSubmitted && !advancementScheduledRef.current) {
      console.log('Time ran out for current question - preparing to advance');
      
      // Set flag to prevent duplicate advancement scheduling
      advancementScheduledRef.current = true;
      
      // Mark as submitted with no selection
      setAnswerSubmitted(true);
      setIsCorrect(false);
      
      // Find and highlight the correct answer
      const correctAnswer = answerOptions.find(option => option.is_correct);
      if (correctAnswer) {
        console.log('Highlighting correct answer:', correctAnswer.id);
        setSelectedAnswerId(correctAnswer.id);
      }
      
      // Wait 5 seconds to show the timeout state and the correct answer, then move to next question
      const timeoutId = setTimeout(() => {
        console.log('Timeout completed, ready to advance question');
        
        // Log advancement attempt for debugging
        console.log(`FORCEFULLY ADVANCING: Timeout advancement from question ${currentQuestionIndex + 1} to ${currentQuestionIndex + 2}`);
        
        // Directly manipulate the DOM to reset any lingering state
        const allButtons = document.querySelectorAll('[data-answer-option]');
        allButtons.forEach(button => {
          button.setAttribute('data-selected', 'false');
          button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md', 
                                'border-green-500', 'bg-green-50', 'dark:bg-green-950/30',
                                'border-red-500', 'bg-red-50', 'dark:bg-red-950/30');
        });
        
        // Reset document pointer events in case they were disabled
        document.body.style.removeProperty('pointer-events');
        
        if (currentQuestionIndex < questions.length - 1) {
          // CRITICAL FIX: Force a direct state update, not using function form
          // Capture next index in a local variable to avoid closure issues
          const nextIndex = currentQuestionIndex + 1;
          console.log(`CRITICAL NAVIGATION: Setting question index to ${nextIndex}`);
          
          // Directly set currentQuestionIndex to the new value
          setCurrentQuestionIndex(nextIndex);
          
          // Log for debugging
          console.log('Question advancement triggered', { from: currentQuestionIndex, to: nextIndex });
          
          // Reset advancement flag after a short delay to ensure state updates complete
          setTimeout(() => {
            advancementScheduledRef.current = false;
          }, 100);
        } else {
          // Last question, complete the session
          console.log('Last question timed out, completing session');
          setSessionComplete(true);
          advancementScheduledRef.current = false;
        }
      }, 5000); // 5 seconds delay
      
      return () => {
        console.log('Clearing timeout for question advancement');
        clearTimeout(timeoutId);
        advancementScheduledRef.current = false;
      };
    }
  }, [
    timeRemaining, 
    currentQuestion, 
    isConfiguring, 
    sessionComplete, 
    answerSubmitted, 
    setAnswerSubmitted, 
    currentQuestionIndex, 
    questions.length, 
    setSessionComplete,
    setIsModalOpen,
    answerOptions,
    setIsCorrect,
    setSelectedAnswerId,
    setCurrentQuestionIndex
  ]);
};
