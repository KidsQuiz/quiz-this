
import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

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
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);
  
  // Handle when time runs out for a question
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    
    // Skip if any of these conditions are met
    if (!currentQuestion || isConfiguring || sessionComplete) return;
    
    // Only process if timer reaches zero and answer is not already submitted
    if (timeRemaining === 0 && !answerSubmitted && !advancementScheduledRef.current) {
      console.log('Time ran out for current question - preparing to advance');
      
      // Play timeout sound
      playSound('incorrect');
      
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
      
      // Immediately move to next question after a very brief highlight delay
      timeoutIdRef.current = setTimeout(() => {
        console.log('TIMEOUT COMPLETE: Now advancing to next question immediately');
        timeoutIdRef.current = null;
        
        // Reset any lingering DOM state
        const clearDomState = () => {
          const allButtons = document.querySelectorAll('[data-answer-option]');
          allButtons.forEach(button => {
            button.setAttribute('data-selected', 'false');
            button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md', 
                                  'border-green-500', 'bg-green-50', 'dark:bg-green-950/30',
                                  'border-red-500', 'bg-red-50', 'dark:bg-red-950/30');
          });
        };
        
        // Clear DOM state
        clearDomState();
        
        // Briefly disable all pointer events to prevent race conditions
        document.body.style.pointerEvents = 'none';
        
        if (currentQuestionIndex < questions.length - 1) {
          // Critical: Force update the index directly with the new value
          const nextIndex = currentQuestionIndex + 1;
          console.log(`ADVANCING: Timeout advancement, setting question index from ${currentQuestionIndex} to ${nextIndex}`);
          
          // CRITICAL FIX: Using direct value instead of function form
          setCurrentQuestionIndex(nextIndex);
        } else {
          // Last question, complete the session
          console.log('Last question timed out, completing session');
          setSessionComplete(true);
        }
        
        // Re-enable pointer events after a short delay
        setTimeout(() => {
          document.body.style.removeProperty('pointer-events');
          advancementScheduledRef.current = false;
          console.log('Question advancement process complete, advancement flag reset');
        }, 100);
      }, 500); // Brief 500ms delay to show the correct answer before advancing
      
      return () => {
        if (timeoutIdRef.current) {
          console.log('Clearing timeout for question advancement');
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
        advancementScheduledRef.current = false;
        document.body.style.removeProperty('pointer-events');
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
