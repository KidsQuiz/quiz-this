
import { useState } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useSessionEffects } from './useSessionEffects';
import { useAnswerHandling } from './useAnswerHandling';
import { useSessionSetup } from './useSessionSetup';

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
    handleTimeUp,
    handleTerminateSession
  } = useQuestionNavigation();

  // Use our session setup hook
  const { initialLoadComplete } = useSessionSetup(
    kidId,
    loadQuestions,
    setCurrentQuestionIndex,
    setCurrentQuestion,
    loadAnswerOptions,
    questions,
    currentQuestionIndex,
    currentQuestion,
    toast,
    t,
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

  // Connect all session effects
  useSessionEffects(
    kidId,
    kidName,
    isConfiguring,
    sessionComplete,
    currentQuestionIndex,
    questions,
    isModalOpen,
    correctAnswers,
    totalPoints,
    answerSubmitted,
    timeRemaining,
    currentQuestion,
    showBoomEffect,
    answerOptions,
    setCurrentQuestion,
    setTimeRemaining,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setShowWowEffect,
    setTimerActive,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete,
    setShowBoomEffect,
    loadAnswerOptions
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
    handleDialogClose
  };
};
