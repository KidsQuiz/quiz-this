
import { useState } from 'react';
import { useSessionState } from './useSessionState';
import { useSessionConfig } from './useSessionConfig';
import { useSessionStartup } from './useSessionStartup';
import { useSessionCompletion } from './useSessionCompletion';
import { useSessionDialogControl } from './useSessionDialogControl';
import { useSessionEffects } from './useSessionEffects';
import { useSessionQuestions } from './useSessionQuestions';
import { useSessionAnswers } from './useSessionAnswers';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  // Use session configuration hook
  const {
    isConfiguring,
    setIsConfiguring,
    isLoading,
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = useSessionConfig(kidId, kidName, onClose);
  
  // Use session state management
  const {
    sessionComplete,
    setSessionComplete,
    correctAnswers,
    setCorrectAnswers,
    totalPoints,
    setTotalPoints,
    kidAnswers,
    setKidAnswers
  } = useSessionState();

  // Use dialog control hook
  const {
    isModalOpen,
    setIsModalOpen,
    getEffectiveOpenState,
    handleDialogClose
  } = useSessionDialogControl(
    onClose,
    false, // Initial showBoomEffect value - will be updated by the effects hook
    sessionComplete,
    correctAnswers,
    [] // Initial questions value - will be updated later
  );

  // Use session effects hook
  const {
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    showRelaxAnimationState,
    setShowRelaxAnimation
  } = useSessionEffects(
    sessionComplete,
    correctAnswers,
    [], // Initial questions value - will be updated later
    setIsModalOpen
  );

  // Use session questions hook
  const {
    questions,
    currentQuestion,
    answerOptions,
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    loadQuestions,
    setCurrentQuestionIndex
  } = useSessionQuestions(
    isConfiguring,
    isModalOpen,
    sessionComplete,
    false, // Initial answerSubmitted value - will be updated by the answers hook
    null, // Initial selectedAnswer value - will be updated by the answers hook
    null, // Initial isCorrect value - will be updated by the answers hook
    setSessionComplete,
    setIsModalOpen,
    setShowWowEffect
  );

  // Use session answers hook
  const {
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
  } = useSessionAnswers(
    kidId,
    questions,
    currentQuestion,
    answerOptions,
    setSessionComplete,
    setShowRelaxAnimation,
    setKidAnswers
  );

  // Use session startup hook
  const { handleStartSession } = useSessionStartup(
    selectedPackageIds,
    loadQuestions,
    setIsConfiguring,
    setCurrentQuestionIndex
  );

  // Use session completion hook
  useSessionCompletion(
    kidId,
    kidName,
    sessionComplete,
    currentQuestionIndex,
    questions,
    totalPoints,
    correctAnswers,
    setSessionComplete,
    setShowBoomEffect,
    setIsModalOpen
  );

  return {
    isConfiguring,
    isLoading,
    currentQuestion,
    answerOptions,
    questionPackages,
    selectedPackageIds,
    questions,
    currentQuestionIndex,
    timeRemaining,
    sessionComplete,
    correctAnswers,
    totalPoints,
    selectedAnswerId: selectedAnswer, 
    answerSubmitted,
    isCorrect,
    showWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    isModalOpen,
    kidAnswers,
    showRelaxAnimationState,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    handleSelectAnswer,
    handleDialogClose,
    getEffectiveOpenState
  };
};
