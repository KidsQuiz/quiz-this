
import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

/**
 * Simplified hook for handling timeout effects when time runs out
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
  // Single timeout ref
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingTimeoutRef = useRef(false);
  const lastProcessedIndexRef = useRef(-1);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Handle time running out
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Skip if inactive or already processing
    if (!currentQuestion || isConfiguring || sessionComplete || 
        answerSubmitted || processingTimeoutRef.current) {
      return;
    }
    
    // Skip if already processed this index
    if (lastProcessedIndexRef.current === currentQuestionIndex) {
      return;
    }
    
    // Only process when timer reaches zero
    if (timeRemaining === 0) {
      console.log('Time ran out, processing timeout');
      
      // Mark as processing
      processingTimeoutRef.current = true;
      lastProcessedIndexRef.current = currentQuestionIndex;
      
      // Play timeout sound
      playSound('incorrect');
      
      // Update state to show feedback
      setAnswerSubmitted(true);
      setIsCorrect(false);
      
      // Find and highlight correct answer
      const correctAnswer = answerOptions.find(option => option.is_correct);
      if (correctAnswer) {
        setSelectedAnswerId(correctAnswer.id);
      }
      
      // Advance after delay
      timeoutRef.current = setTimeout(() => {
        console.log('Advancing after timeout');
        
        // Disable interaction
        document.body.style.pointerEvents = 'none';
        
        if (currentQuestionIndex < questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // End session
          setSessionComplete(true);
        }
        
        // Re-enable interaction after delay
        setTimeout(() => {
          document.body.style.removeProperty('pointer-events');
          processingTimeoutRef.current = false;
          timeoutRef.current = null;
        }, 500);
      }, 2000);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        processingTimeoutRef.current = false;
        document.body.style.removeProperty('pointer-events');
      };
    }
  }, [
    timeRemaining,
    currentQuestion,
    isConfiguring,
    sessionComplete,
    answerSubmitted,
    currentQuestionIndex,
    questions.length,
    answerOptions,
    setAnswerSubmitted,
    setSessionComplete,
    setIsCorrect,
    setSelectedAnswerId,
    setCurrentQuestionIndex
  ]);
};
