
import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

/**
 * Simplified hook to handle time-up scenario
 */
export const useTimeUpHandler = ({
  timeUpTriggered,
  setTimeUpTriggered,
  answerSubmitted,
  setAnswerSubmitted,
  setIsCorrect,
  setIsTimeUp,
  setShowingTimeUpFeedback,
  currentQuestion,
  goToNextQuestion,
  setSelectedAnswerId,
  answerOptions,
  setTimerActive
}) => {
  // Single processing lock
  const processingRef = useRef(false);
  const timeoutRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle time up sequence with simplified logic
  useEffect(() => {
    // Skip if not triggered, already submitted, or already processing
    if (!timeUpTriggered || answerSubmitted || processingRef.current || !currentQuestion) {
      return;
    }

    console.log("Processing time up event");
    processingRef.current = true;
    
    // Stop timer
    if (setTimerActive) {
      setTimerActive(false);
    }
    
    // Play incorrect sound
    playSound('incorrect');
    
    // Update UI states
    setIsTimeUp(true);
    setAnswerSubmitted(true);
    setIsCorrect(false);
    setShowingTimeUpFeedback(true);
    
    // Highlight correct answer
    const correctAnswer = answerOptions.find(option => option.is_correct);
    if (correctAnswer) {
      setSelectedAnswerId(correctAnswer.id);
    }
    
    // Wait before advancing to next question
    timeoutRef.current = setTimeout(() => {
      console.log("Time's up sequence complete, advancing");
      
      // Reset states
      setIsTimeUp(false);
      setShowingTimeUpFeedback(false);
      setTimeUpTriggered(false);
      
      // Advance to next question
      goToNextQuestion();
      
      // Reset processing flag
      setTimeout(() => {
        processingRef.current = false;
        timeoutRef.current = null;
      }, 100);
    }, 1500);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      processingRef.current = false;
    };
  }, [
    timeUpTriggered,
    answerSubmitted,
    currentQuestion,
    setAnswerSubmitted,
    setIsCorrect,
    setIsTimeUp,
    setShowingTimeUpFeedback,
    setSelectedAnswerId,
    setTimeUpTriggered,
    goToNextQuestion,
    answerOptions,
    setTimerActive
  ]);

  const handleTimeUp = () => {
    console.log("Time up handler called explicitly");
    setTimeUpTriggered(true);
  };

  return { handleTimeUp };
};
