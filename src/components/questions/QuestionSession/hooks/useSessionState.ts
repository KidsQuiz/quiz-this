
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
    setShowBoomEffect,
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered,
    resetAllAnswerState
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

  const resetSessionState = () => {
    setIsConfiguring(false);
    setSessionComplete(false);
    setCorrectAnswers(0);
    setTotalPoints(0);
    resetAllAnswerState();
    setIsModalOpen(true);
    setShowRelaxAnimation(false);
    setKidAnswers([]);
  };

  return {
    // Session progress state
    isConfiguring,
    setIsConfiguring,
    sessionComplete,
    setSessionComplete,
    correctAnswers,
    setCorrectAnswers,
    totalPoints,
    setTotalPoints,
    
    // Answer state
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    
    // Visual effects
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    showRelaxAnimation,
    setShowRelaxAnimation,
    
    // UI state
    isModalOpen,
    setIsModalOpen,
    
    // Kid answers
    kidAnswers,
    setKidAnswers,
    
    // Time-up related state
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered,
    
    // Reset functions
    resetSessionState
  };
};

export type { KidAnswer };
