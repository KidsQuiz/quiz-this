
import { useState } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useSessionEffects } from './useSessionEffects';
import { useAnswerProcessing } from './useAnswerProcessing';
import { useSessionSetup } from './useSessionSetup';
import { Question } from '@/hooks/questionsTypes';

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

  // Use our new session setup hook
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

  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    handleSelectAnswer
  } = useAnswerProcessing(
    kidId,
    currentQuestion,
    answerOptions,
    questions,
    setCorrectAnswers,
    setTotalPoints,
    setShowWowEffect,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setShowBoomEffect,
    setSessionComplete,
    setKidAnswers
  );

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
