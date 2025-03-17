import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

interface TimeUpHandlerProps {
  timeUpTriggered: boolean;
  setTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  answerSubmitted: boolean;
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimeUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingTimeUpFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuestion: Question | null;
  goToNextQuestion: () => void;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>;
  answerOptions: AnswerOption[];
  setTimerActive?: React.Dispatch<React.SetStateAction<boolean>>;
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
  setSelectedAnswerId,
  answerOptions,
  setTimerActive
}: TimeUpHandlerProps) => {
  // Keep a ref to track ongoing time-up processing
  const isProcessingTimeUpRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Handle time up sequence
  useEffect(() => {
    // Skip if already processing, if answer already submitted, or if no trigger
    if (isProcessingTimeUpRef.current || answerSubmitted || !timeUpTriggered || !currentQuestion) {
      return;
    }

    console.log("TIME UP HANDLER: Processing time up event", {
      timeUpTriggered,
      answerSubmitted,
      isProcessing: isProcessingTimeUpRef.current
    });

    // Set processing flag
    isProcessingTimeUpRef.current = true;
    
    // Stop the timer first
    if (setTimerActive) {
      setTimerActive(false);
    }
    
    // Play incorrect sound
    playSound('incorrect');
    
    // Update UI states - CRITICAL: Force these to execute synchronously
    setIsTimeUp(true);
    setAnswerSubmitted(true);
    setIsCorrect(false);
    setShowingTimeUpFeedback(true);
    
    // Find and highlight the correct answer
    const correctAnswer = answerOptions.find(option => option.is_correct);
    if (correctAnswer) {
      console.log("Highlighting correct answer:", correctAnswer.id);
      setSelectedAnswerId(correctAnswer.id);
    }
    
    // Briefly pause to show the correct answer (just long enough for the UI to update)
    console.log("Briefly highlighting correct answer before advancing");
    timeoutRef.current = setTimeout(() => {
      console.log("Timeout completed - now advancing to next question");
      
      // Clean up states
      setIsTimeUp(false);
      setShowingTimeUpFeedback(false);
      setTimeUpTriggered(false);
      
      // Force re-enable pointer events before navigation
      document.body.style.pointerEvents = '';
      
      // Force-advance to next question with a slightly longer delay
      // to ensure all state updates are completed
      goToNextQuestion();
      
      // Reset processing flag after question advancement
      setTimeout(() => {
        isProcessingTimeUpRef.current = false;
        timeoutRef.current = null;
        console.log("Time up processing cycle complete");
      }, 100);
      
    }, 1500); // Longer delay to ensure the correct answer is visible
    
    return () => {
      // Clean up if component unmounts during timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isProcessingTimeUpRef.current = false;
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
    console.log("handleTimeUp called explicitly");
    setTimeUpTriggered(true);
  };

  return { handleTimeUp };
};
