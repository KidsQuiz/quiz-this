
import { useEffect } from 'react';
import { usePackageSelection } from './usePackageSelection';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useSessionConfig } from './useSessionConfig';
import { useSessionEffects } from './useSessionEffects';
import { useAnswerProcessing } from './useAnswerProcessing';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast, t } = useToastAndLanguage();
  
  // Use session state hook for state management
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

  // Load packages and get session configuration
  const {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    initializeSessionFunctions
  } = useSessionConfig(kidId, kidName, onClose);

  // Load questions and answer options
  const {
    isLoading,
    questions,
    currentQuestion,
    setCurrentQuestion,
    answerOptions,
    loadQuestions,
    loadAnswerOptions
  } = useQuestionLoading();

  // Handle question navigation and timers
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

  // Initialize session config functions
  useEffect(() => {
    initializeSessionFunctions(
      loadQuestions,
      setIsConfiguring,
      setCurrentQuestionIndex
    );
  }, [initializeSessionFunctions, loadQuestions, setIsConfiguring, setCurrentQuestionIndex]);

  // Process answers and handle submissions
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

  // Apply session effects (modal transitions, current question, completion, timeouts)
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

  // Handle dialog closing
  const { handleDialogClose } = useDialogManagement(
    setIsModalOpen,
    onClose,
    showBoomEffect,
    sessionComplete,
    correctAnswers,
    questions
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
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showWowEffect,
    showRelaxAnimation,
    showBoomEffect,
    setShowBoomEffect,
    isModalOpen,
    kidAnswers,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    handleSelectAnswer,
    handleDialogClose
  };
};
