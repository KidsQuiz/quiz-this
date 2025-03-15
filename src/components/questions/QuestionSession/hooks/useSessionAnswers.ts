
import { useState } from 'react';
import { useAnswerHandling } from './useAnswerHandling';
import { useAnswerDelegation } from './useAnswerDelegation';
import { Question } from '@/hooks/questionsTypes';

export const useSessionAnswers = (
  kidId: string,
  questions: Question[],
  currentQuestion: Question | null,
  answerOptions: any[],
  setSessionComplete: (isComplete: boolean) => void,
  setShowRelaxAnimation: (show: boolean) => void,
  setKidAnswers: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // Get answer handling logic
  const {
    selectedAnswer,
    answerSubmitted,
    isCorrect,
    currentQuestionIndex: answerQuestionIndex,
    currentQuestion: answerCurrentQuestion,
    correctAnswers: answerCorrectCount,
    totalPoints: answerTotalPoints,
    handleAnswerSelect,
    checkAnswer,
    goToNextQuestion
  } = useAnswerHandling(
    questions,
    kidId,
    setSessionComplete,
    setShowRelaxAnimation
  );

  // Get enhanced answer handling delegation
  const { handleSelectAnswer } = useAnswerDelegation(
    kidId,
    currentQuestion,
    answerOptions,
    handleAnswerSelect,
    setKidAnswers
  );

  return {
    selectedAnswer,
    answerSubmitted,
    isCorrect,
    answerQuestionIndex,
    answerCurrentQuestion,
    answerCorrectCount,
    answerTotalPoints,
    handleSelectAnswer,
    checkAnswer,
    goToNextQuestion
  };
};
