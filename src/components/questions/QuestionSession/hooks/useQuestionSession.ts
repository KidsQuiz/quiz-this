
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useAnswerHandling } from './useAnswerHandling';
import { useSessionState } from './useSessionState';
import { useSessionStartup } from './useSessionStartup';
import { useModalTransition } from './useModalTransition';
import { useCurrentQuestion } from './useCurrentQuestion';
import { useSessionCompletion } from './useSessionCompletion';
import { useTimeoutHandling } from './useTimeoutHandling';
import { useDialogManagement } from './useDialogManagement';
import { useRelaxAnimation } from './useRelaxAnimation';
import { useQuestionDialog } from './useQuestionDialog';
import { useEffectsHandling } from './useEffectsHandling';
import { useSessionConfig } from './useSessionConfig';
import { usePerfectScoreHandling } from './usePerfectScoreHandling';
import { useAnswerDelegation } from './useAnswerDelegation';

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
  
  // Use our extracted dialog and animation hooks
  const { showRelaxAnimationState, setShowRelaxAnimation } = useRelaxAnimation();
  const { isModalOpen, setIsModalOpen, getEffectiveOpenState } = useQuestionDialog(onClose);

  // Use session state management
  const {
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
    kidAnswers,
    setKidAnswers
  } = useSessionState();

  // Use the extracted effects hook
  const { handleBoomEffectComplete } = useEffectsHandling(
    showWowEffect,
    showBoomEffect,
    setShowBoomEffect
  );

  // Use question loading hook
  const {
    questions,
    currentQuestion,
    setCurrentQuestion,
    answerOptions,
    loadQuestions,
    loadAnswerOptions
  } = useQuestionLoading();

  // Use question navigation hook
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

  // Use answer handling hook
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

  // Get selected answer ID
  const selectedAnswerId = selectedAnswer;

  // Use session startup hook
  const { handleStartSession } = useSessionStartup(
    selectedPackageIds,
    loadQuestions,
    setIsConfiguring,
    setCurrentQuestionIndex
  );

  // Use modal transition hook
  useModalTransition(
    isModalOpen,
    sessionComplete,
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete
  );

  // Use current question hook
  useCurrentQuestion(
    isConfiguring,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    setTimeRemaining,
    answerSubmitted,
    selectedAnswer,
    isCorrect,
    setShowWowEffect,
    setTimerActive,
    loadAnswerOptions
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

  // Use perfect score handling
  usePerfectScoreHandling(
    sessionComplete,
    correctAnswers,
    questions,
    setIsModalOpen,
    setShowBoomEffect
  );

  // Use enhanced answer handling delegation
  const { handleSelectAnswer } = useAnswerDelegation(
    kidId,
    currentQuestion,
    answerOptions,
    handleAnswerSelect,
    setKidAnswers
  );

  // Use dialog management hook
  const { handleDialogClose } = useDialogManagement(
    setIsModalOpen,
    onClose,
    showBoomEffect,
    sessionComplete,
    correctAnswers,
    questions
  );

  // Use timeout handling hook
  useTimeoutHandling(
    timeRemaining,
    currentQuestion,
    isConfiguring,
    sessionComplete,
    answerSubmitted,
    currentQuestionIndex,
    questions,
    null,
    setSessionComplete,
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
    selectedAnswerId, 
    answerSubmitted,
    isCorrect,
    showWowEffect,
    showBoomEffect,
    setShowBoomEffect: handleBoomEffectComplete,
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
