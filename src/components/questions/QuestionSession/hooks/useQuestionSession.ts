
import { useState } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useAnswerHandling } from './useAnswerHandling';
import { useSessionInitialization } from './useSessionInitialization';
import { useQuestionChangeEffects } from './useQuestionChangeEffects';
import { useTimeUpHandler } from './useTimeUpHandler';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast, t } = useToastAndLanguage();
  
  const {
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
    setShowRelaxAnimation
  } = useSessionState();

  const {
    isLoading,
    questions,
    currentQuestion,
    setCurrentQuestion,
    answerOptions,
    loadQuestions,
    loadAnswerOptions
  } = useQuestionLoading();

  const {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setTimerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    updateTimeLimit,
    handleTimeUp,
    handleTerminateSession
  } = useQuestionNavigation();

  // Use initialization hook
  const { initialLoadComplete } = useSessionInitialization(
    kidId,
    loadQuestions,
    setCurrentQuestionIndex,
    onClose
  );

  // Use our answer handling hook
  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    resetAnswerState,
    handleSelectAnswer
  } = useAnswerHandling(
    answerOptions,
    currentQuestion,
    setCorrectAnswers,
    setTotalPoints,
    setShowWowEffect,
    setCurrentQuestionIndex,
    setIsModalOpen,
    questions,
    setShowBoomEffect,
    setSessionComplete,
    setTimerActive
  );

  // Use question change effects hook
  useQuestionChangeEffects(
    currentQuestionIndex,
    initialLoadComplete,
    questions,
    sessionComplete,
    setCurrentQuestion,
    resetAnswerState,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    loadAnswerOptions,
    setTimeRemaining,
    setTimerActive,
    updateTimeLimit
  );

  // Use time up handler hook
  useTimeUpHandler(
    timeRemaining,
    answerSubmitted,
    currentQuestion,
    timerActive,
    questions,
    currentQuestionIndex,
    setAnswerSubmitted,
    setIsCorrect,
    setTimerActive,
    setShowRelaxAnimation,
    resetAnswerState,
    setCurrentQuestionIndex,
    setSessionComplete,
    setShowBoomEffect
  );

  const { handleDialogClose } = useDialogManagement(
    setIsModalOpen,
    onClose,
    showBoomEffect,
    sessionComplete,
    correctAnswers,
    questions
  );

  return {
    isLoading: isLoading || !initialLoadComplete,
    currentQuestion,
    answerOptions,
    questions,
    currentQuestionIndex,
    timeRemaining,
    sessionComplete,
    correctAnswers,
    totalPoints,
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showWowEffect,
    showRelaxAnimation,
    showBoomEffect,
    setShowBoomEffect,
    isModalOpen,
    kidAnswers,
    handleSelectAnswer,
    handleDialogClose,
    loadQuestions
  };
};
