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
  answerOptions
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
    
    // Play incorrect sound
    playSound('incorrect');
    
    // Update UI states
    setIsTimeUp(true);
    setShowingTimeUpFeedback(false);
    setAnswerSubmitted(true);
    setIsCorrect(false);
    
    // Find and highlight the correct answer
    const correctAnswer = answerOptions.find(option => option.is_correct);
    if (correctAnswer) {
      console.log("Highlighting correct answer:", correctAnswer.id);
      setSelectedAnswerId(correctAnswer.id);
    }
    
    // Wait 5 seconds then go to next question
    console.log("Setting timeout to advance to next question in 5 seconds");
    timeoutRef.current = setTimeout(() => {
      console.log("Time's up timeout completed - advancing to next question");
      
      // Clean up states
      setIsTimeUp(false);
      setShowingTimeUpFeedback(false);
      setTimeUpTriggered(false);
      
      // Force-advance to next question
      goToNextQuestion();
      
      // Reset processing flag
      isProcessingTimeUpRef.current = false;
      timeoutRef.current = null;
      
    }, 5000); // 5 seconds delay
    
    return () => {
      // Clean up if component unmounts during timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
    answerOptions
  ]);

  const handleTimeUp = () => {
    console.log("handleTimeUp called explicitly");
    setTimeUpTriggered(true);
  };

  return { handleTimeUp };
};
