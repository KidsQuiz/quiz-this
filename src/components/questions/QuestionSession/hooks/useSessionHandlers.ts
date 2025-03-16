
import { useCallback } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useDialogManagement } from './useDialogManagement';
import { useAnswerHandling } from './useAnswerHandling';
import { useQuestionNavigationHandler } from './useQuestionNavigationHandler';
import { useTimeUpHandler } from './useTimeUpHandler';

/**
 * Centralizes all event handlers for the question session
 */
export const useSessionHandlers = (props: {
  // Session state
  currentQuestion: Question | null;
  answerOptions: any[];
  isCorrect: boolean;
  questions: Question[];
  currentQuestionIndex: number;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  resetAnswerState: () => void;
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTimeUp: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingTimeUpFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  showBoomEffect: boolean;
  sessionComplete: boolean;
  correctAnswers: number;
  timeUpTriggered: boolean;
  answerSubmitted: boolean;
  onClose: () => void;
  kidId: string;
}) => {
  // Use dialog management
  const { handleDialogClose } = useDialogManagement(
    props.setIsModalOpen,
    props.onClose,
    props.showBoomEffect,
    props.sessionComplete,
    props.correctAnswers,
    props.questions
  );

  // Use navigation handler
  const { goToNextQuestion } = useQuestionNavigationHandler(
    props.currentQuestionIndex,
    props.questions,
    props.setCurrentQuestionIndex,
    props.resetAnswerState,
    props.setAnswerSubmitted,
    props.setSelectedAnswerId,
    props.setIsCorrect,
    props.setIsTimeUp,
    props.setShowingTimeUpFeedback,
    props.setTimeUpTriggered,
    props.setIsModalOpen,
    props.setSessionComplete
  );

  // Use time up handler
  const { handleTimeUp } = useTimeUpHandler({
    timeUpTriggered: props.timeUpTriggered,
    setTimeUpTriggered: props.setTimeUpTriggered,
    answerSubmitted: props.answerSubmitted,
    setAnswerSubmitted: props.setAnswerSubmitted,
    setIsCorrect: props.setIsCorrect,
    setIsTimeUp: props.setIsTimeUp,
    setShowingTimeUpFeedback: props.setShowingTimeUpFeedback,
    currentQuestion: props.currentQuestion,
    goToNextQuestion,
    setSelectedAnswerId: props.setSelectedAnswerId,
    answerOptions: props.answerOptions
  });

  // Use answer handling
  const { handleSelectAnswer } = useAnswerHandling(
    props.answerOptions,
    props.currentQuestion,
    props.setCorrectAnswers,
    props.setTotalPoints,
    props.setShowWowEffect,
    props.setCurrentQuestionIndex,
    props.setIsModalOpen,
    props.questions,
    props.setShowBoomEffect,
    props.setSessionComplete,
    props.setTimerActive
  );

  return {
    handleDialogClose,
    handleSelectAnswer,
    handleTimeUp,
    goToNextQuestion,
  };
};
