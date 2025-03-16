
import { useState } from 'react';

export const useAnswerState = () => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const resetAnswerSelectionState = () => {
    setSelectedAnswerId(null);
    setAnswerSubmitted(false);
    setIsCorrect(false);
  };

  return {
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    resetAnswerSelectionState
  };
};
