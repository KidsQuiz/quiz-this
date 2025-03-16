
import { useAnswerStateManagement } from './useAnswerStateManagement';
import { useSessionProgressState } from './useSessionProgressState';
import { useSessionUIState } from './useSessionUIState';
import { useKidAnswersState, KidAnswer } from './useKidAnswersState';

export const useSessionState = () => {
  const {
    isConfiguring,
    setIsConfiguring,
    sessionComplete,
    setSessionComplete,
    correctAnswers,
    setCorrectAnswers,
    totalPoints,
    setTotalPoints
  } = useSessionProgressState();

  const {
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect
  } = useAnswerStateManagement();

  const {
    isModalOpen,
    setIsModalOpen,
    showRelaxAnimation,
    setShowRelaxAnimation
  } = useSessionUIState();

  const {
    kidAnswers,
    setKidAnswers
  } = useKidAnswersState();

  return {
    isConfiguring,
    setIsConfiguring,
    sessionComplete,
    setSessionComplete,
    correctAnswers,
    setCorrectAnswers,
    totalPoints,
    setTotalPoints,
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    isModalOpen,
    setIsModalOpen,
    kidAnswers,
    setKidAnswers,
    showRelaxAnimation,
    setShowRelaxAnimation,
    // Add these to maintain API compatibility with existing code
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect
  };
};

export type { KidAnswer };
