
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
  // Track the last time we initiated an advancement
  const lastAdvancementTimeRef = useRef(0);
  // Track the last index we processed a timeout for
  const lastTimeoutIndexRef = useRef(-1);
  
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
    
    // Skip if we just processed a timeout for this question index
    if (lastTimeoutIndexRef.current === currentQuestionIndex) {
      console.log(`Already processed timeout for question index ${currentQuestionIndex}, skipping`);
      return;
    }
    
    // Only process if timer reaches zero and answer is not already submitted
    if (timeRemaining === 0 && !answerSubmitted && !advancementScheduledRef.current) {
      // Check for debounce
      const now = Date.now();
      if (now - lastAdvancementTimeRef.current < 2000) {
        console.log(`Timeout advancement requested too soon (${now - lastAdvancementTimeRef.current}ms), ignoring`);
        return;
      }
      
      console.log('Time ran out for current question - preparing to advance');
      
      // Update last advancement time and index
      lastAdvancementTimeRef.current = now;
      lastTimeoutIndexRef.current = currentQuestionIndex;
      
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
      
      // Wait a moment to show the correct answer, then advance
      timeoutIdRef.current = setTimeout(() => {
        console.log('TIMEOUT COMPLETE: Now advancing to next question');
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
          console.log(`DIRECT ADVANCEMENT: Setting question index from ${currentQuestionIndex} to ${nextIndex}`);
          
          // Use direct index setting instead of function form
          setCurrentQuestionIndex(nextIndex);
          console.log(`Question index updated to ${nextIndex}`);
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
        }, 500); // Increased from 300ms to 500ms for better stability
      }, 2000); // Increased from 1500ms to 2000ms to show the correct answer longer
      
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
