
import { useState } from 'react';

export const useAnswerStateManagement = () => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [showBoomEffect, setShowBoomEffect] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showingTimeUpFeedback, setShowingTimeUpFeedback] = useState(false);
  const [timeUpTriggered, setTimeUpTriggered] = useState(false);

  return {
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
    setTimeUpTriggered
  };
};
