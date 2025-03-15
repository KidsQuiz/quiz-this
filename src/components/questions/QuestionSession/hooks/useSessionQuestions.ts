
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useCurrentQuestion } from './useCurrentQuestion';
import { useModalTransition } from './useModalTransition';
import { useTimeoutHandling } from './useTimeoutHandling';
import { Question } from '@/hooks/questionsTypes';

export const useSessionQuestions = (
  isConfiguring: boolean,
  isModalOpen: boolean,
  sessionComplete: boolean,
  answerSubmitted: boolean,
  selectedAnswer: string | null,
  isCorrect: boolean | null,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Use question loading hook
  const {
    questions,
    currentQuestion,
    setCurrentQuestion,
    answerOptions,
    loadQuestions,
    loadAnswerOptions
  } = useQuestionLoading();

  // Use question navigation hook
  const {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setTimerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    handleTimeUp,
    handleTerminateSession
  } = useQuestionNavigation();

  // Use current question hook
  useCurrentQuestion(
    isConfiguring,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    setTimeRemaining,
    answerSubmitted,
    selectedAnswer,
    isCorrect,
    setShowWowEffect,
    setTimerActive,
    loadAnswerOptions
  );

  // Use modal transition hook
  useModalTransition(
    isModalOpen,
    sessionComplete,
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete
  );

  // Use timeout handling hook
  useTimeoutHandling(
    timeRemaining,
    currentQuestion,
    isConfiguring,
    sessionComplete,
    answerSubmitted,
    currentQuestionIndex,
    questions,
    null,
    setSessionComplete,
    setIsModalOpen
  );

  return {
    questions,
    currentQuestion,
    answerOptions,
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    loadQuestions,
    setCurrentQuestionIndex
  };
};
