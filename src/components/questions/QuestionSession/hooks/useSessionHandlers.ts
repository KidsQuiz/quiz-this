
import { useDialogManagement } from './useDialogManagement';
import { useQuestionNavigationHandler } from './useQuestionNavigationHandler';
import { useTimeUpHandler } from './useTimeUpHandler';
import { useAnswerHandling } from './useAnswerHandling';

/**
 * Centralizes all event handlers for the question session
 */
export const useSessionHandlers = (props: {
  // From session data
  currentQuestion: any;
  answerOptions: any[];
  isCorrect: boolean;
  questions: any[];
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
  // From props
  onClose: () => void;
  kidId: string;
}) => {
  // Use dialog management
  const { handleDialogClose } = useDialogManagement({
    setIsModalOpen: props.setIsModalOpen,
    onClose: props.onClose,
    showBoomEffect: props.showBoomEffect,
    sessionComplete: props.sessionComplete,
    correctAnswers: props.correctAnswers,
    questions: props.questions
  });

  // Use navigation handler
  const { goToNextQuestion } = useQuestionNavigationHandler({
    currentQuestionIndex: props.currentQuestionIndex,
    questions: props.questions,
    setCurrentQuestionIndex: props.setCurrentQuestionIndex,
    resetAnswerState: props.resetAnswerState,
    setAnswerSubmitted: props.setAnswerSubmitted,
    setSelectedAnswerId: props.setSelectedAnswerId,
    setIsCorrect: props.setIsCorrect,
    setIsTimeUp: props.setIsTimeUp,
    setShowingTimeUpFeedback: props.setShowingTimeUpFeedback,
    setTimeUpTriggered: props.setTimeUpTriggered,
    setIsModalOpen: props.setIsModalOpen,
    setSessionComplete: props.setSessionComplete
  });

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
    answerOptions: props.answerOptions,
    setTimerActive: props.setTimerActive // Pass the required setTimerActive prop
  });

  // Use answer handling
  const { handleSelectAnswer } = useAnswerHandling({
    answerOptions: props.answerOptions,
    currentQuestion: props.currentQuestion,
    setCorrectAnswers: props.setCorrectAnswers,
    setTotalPoints: props.setTotalPoints,
    setShowWowEffect: props.setShowWowEffect,
    setCurrentQuestionIndex: props.setCurrentQuestionIndex,
    setIsModalOpen: props.setIsModalOpen,
    questions: props.questions,
    setShowBoomEffect: props.setShowBoomEffect,
    setSessionComplete: props.setSessionComplete,
    setTimerActive: props.setTimerActive,
    resetAnswerState: props.resetAnswerState,
    setAnswerSubmitted: props.setAnswerSubmitted,
    setSelectedAnswerId: props.setSelectedAnswerId,
    setIsCorrect: props.setIsCorrect
  });

  return {
    handleDialogClose,
    handleSelectAnswer,
    handleTimeUp,
    goToNextQuestion,
  };
};
