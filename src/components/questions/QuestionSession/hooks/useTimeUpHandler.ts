
import { useEffect, useCallback } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

interface UseTimeUpHandlerProps {
  timeUpTriggered: boolean;
  setTimeUpTriggered: (value: boolean) => void;
  answerSubmitted: boolean;
  setAnswerSubmitted: (value: boolean) => void;
  setIsCorrect: (value: boolean) => void;
  setIsTimeUp: (value: boolean) => void;
  setShowingTimeUpFeedback: (value: boolean) => void;
  currentQuestion: Question | null;
  goToNextQuestion: () => void;
  setSelectedAnswerId: (value: string | null) => void;
  answerOptions: AnswerOption[]; // Add answerOptions to props
}

export const useTimeUpHandler = (props: UseTimeUpHandlerProps) => {
  const {
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
    answerOptions
  } = props;
  
  // Find the correct answer ID when time is up
  const findCorrectAnswerId = useCallback(() => {
    if (!answerOptions || answerOptions.length === 0) return null;
    
    // Find the correct answer from answer options
    const correctAnswer = answerOptions.find(option => option.is_correct);
    return correctAnswer ? correctAnswer.id : null;
  }, [answerOptions]);
  
  // Handle the time up scenario
  const handleTimeUp = useCallback(() => {
    if (timeUpTriggered && !answerSubmitted) {
      console.log("Handling time-up event");
      
      // Play 'incorrect' sound
      playSound('incorrect');
      
      // Mark the answer as submitted
      setAnswerSubmitted(true);
      
      // Mark answer as incorrect 
      setIsCorrect(false);
      
      // Mark that time is up
      setIsTimeUp(true);
      
      // Find and highlight the correct answer
      const correctAnswerId = findCorrectAnswerId();
      if (correctAnswerId) {
        console.log("Time's up - highlighting correct answer:", correctAnswerId);
        setSelectedAnswerId(correctAnswerId);
      } else {
        console.warn("Could not find correct answer to highlight");
      }
      
      // Show the time-up feedback
      setShowingTimeUpFeedback(true);
      
      // Reset the time up triggered flag
      setTimeUpTriggered(false);
      
      // After 5 seconds, move to the next question
      setTimeout(() => {
        console.log("Time's up - moving to next question after delay");
        setAnswerSubmitted(false);
        setIsTimeUp(false);
        setShowingTimeUpFeedback(false);
        setSelectedAnswerId(null);
        goToNextQuestion();
      }, 5000);
    }
  }, [
    timeUpTriggered, 
    answerSubmitted, 
    setAnswerSubmitted, 
    setIsCorrect, 
    setIsTimeUp, 
    setSelectedAnswerId, 
    setShowingTimeUpFeedback, 
    setTimeUpTriggered, 
    goToNextQuestion,
    findCorrectAnswerId
  ]);
  
  // Run the time up handler when needed
  useEffect(() => {
    if (timeUpTriggered) {
      handleTimeUp();
    }
  }, [timeUpTriggered, handleTimeUp]);
  
  return {
    handleTimeUp
  };
};
