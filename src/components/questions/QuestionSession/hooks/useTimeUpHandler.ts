
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
}: {
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
  setTimerActive?: React.Dispatch<React.SetStateAction<boolean>>; // Optional timer active state setter
}) => {
  // Track when processing is happening to prevent duplicate handling
  const processingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedTimeUpRef = useRef<boolean>(false);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Handle time up sequence with improved race condition protection
  useEffect(() => {
    // Skip if already processed this exact time-up event
    if (lastProcessedTimeUpRef.current === timeUpTriggered) {
      return;
    }
    
    // Skip if not triggered, already submitted, or already processing
    if (!timeUpTriggered || answerSubmitted || processingRef.current || !currentQuestion) {
      return;
    }

    console.log("Processing time up event");
    processingRef.current = true;
    lastProcessedTimeUpRef.current = timeUpTriggered;
    
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
    
    // Use a longer timeout (3 seconds) to ensure feedback is visible
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
      }, 500);
    }, 3000); // Increased from 1500ms to 3000ms
    
    return () => {
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
    answerOptions,
    setTimerActive
  ]);

  const handleTimeUp = () => {
    console.log("Time up handler called explicitly");
    if (!processingRef.current) {
      setTimeUpTriggered(true);
    }
  };

  return { handleTimeUp };
};
