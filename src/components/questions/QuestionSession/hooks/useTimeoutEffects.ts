
import { useEffect } from 'react';
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
  // Handle when time runs out for a question
  useEffect(() => {
    // Skip if any of these conditions are met
    if (!currentQuestion || isConfiguring || sessionComplete) return;
    
    // Only process if timer reaches zero and answer is not already submitted
    if (timeRemaining === 0 && !answerSubmitted) {
      console.log('Time ran out for current question - preparing to advance');
      
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
        
        // CRITICAL FIX: Force advancement regardless of answer state
        if (currentQuestionIndex < questions.length - 1) {
          console.log('Advancing to next question after timeout, from index', currentQuestionIndex, 'to', currentQuestionIndex + 1);
          // Use the functional update to ensure we're working with the latest state
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Last question, complete the session
          console.log('Last question timed out, completing session');
          setSessionComplete(true);
        }
      }, 5000); // 5 seconds delay
      
      return () => {
        console.log('Clearing timeout for question advancement');
        clearTimeout(timeoutId);
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
