
import { useAnswerState } from './useAnswerState';
import { useTimeUpState } from './useTimeUpState';
import { useVisualEffectsState } from './useVisualEffectsState';

export const useAnswerStateManagement = () => {
  const {
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    resetAnswerSelectionState
  } = useAnswerState();

  const {
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    resetVisualEffects
  } = useVisualEffectsState();

  const {
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered,
    resetTimeUpState
  } = useTimeUpState();

  const resetAllAnswerState = () => {
    resetAnswerSelectionState();
    resetVisualEffects();
    resetTimeUpState();
  };

  return {
    // Answer selection state
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    
    // Visual effects state
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    
    // Time up state
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered,
    
    // Reset functions
    resetAllAnswerState
  };
};
