
import { useState } from 'react';

export const useTimeUpState = () => {
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showingTimeUpFeedback, setShowingTimeUpFeedback] = useState(false);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);

  const resetTimeUpState = () => {
    setIsTimeUp(false);
    setShowingTimeUpFeedback(false);
    setTimeUpTriggered(false);
  };

  return {
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered,
    resetTimeUpState
  };
};
