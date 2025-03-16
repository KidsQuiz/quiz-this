
import { useEffect, useCallback } from 'react';
import { Question } from '@/hooks/questionsTypes';

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
}

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
  setSelectedAnswerId
}: UseTimeUpHandlerProps) => {
  
  // Find the correct answer ID when time is up
  const findCorrectAnswerId = useCallback(() => {
    if (!currentQuestion) return null;
    
    // We can't access answerOptions directly from Question
    // We'll need to get the correct answer ID from another source
    // For now, return null as we'll get this information elsewhere
    return null;
  }, [currentQuestion]);
  
  // Handle the time up scenario
  const handleTimeUp = useCallback(() => {
    if (timeUpTriggered && !answerSubmitted) {
      console.log("Handling time-up event");
      
      // Mark the answer as submitted
      setAnswerSubmitted(true);
      
      // Mark answer as incorrect 
      setIsCorrect(false);
      
      // Mark that time is up
      setIsTimeUp(true);
      
      // We'll set the correct answer ID in the parent component after loading answer options
      // setSelectedAnswerId will be called there
      
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
    goToNextQuestion
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
