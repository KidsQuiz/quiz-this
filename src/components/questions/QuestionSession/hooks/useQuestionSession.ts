
import { useSessionState } from './useSessionState';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useAnswerHandling } from './useAnswerHandling';
import { useSessionInitialization } from './useSessionInitialization';
import { useQuestionChangeEffects } from './useQuestionChangeEffects';
import { useTimeUpHandler } from './useTimeUpHandler';
import { useSessionTimeManagement } from './useSessionTimeManagement';
import { useQuestionNavigationHandler } from './useQuestionNavigationHandler';
import { usePackageAutoLoader } from './usePackageAutoLoader';

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
    setShowRelaxAnimation,
    selectedAnswerId,
    setSelectedAnswerId,
    answerSubmitted,
    setAnswerSubmitted,
    isCorrect,
    setIsCorrect,
    isTimeUp,
    setIsTimeUp,
    showingTimeUpFeedback,
    setShowingTimeUpFeedback,
    timeUpTriggered,
    setTimeUpTriggered
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
    resetAndStartTimer,
    handleTimeUp: triggerTimeUp,
    handleTerminateSession,
    timeUpTriggered: navigationTimeUpTriggered,
    setTimeUpTriggered: setNavigationTimeUpTriggered
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

  // Use the new navigation handler hook
  const { goToNextQuestion, prepareForNavigation } = useQuestionNavigationHandler(
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    resetAnswerState,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setIsTimeUp,
    setShowingTimeUpFeedback,
    setTimeUpTriggered,
    setIsModalOpen,
    setSessionComplete
  );

  // Use time up handler hook with proper props
  const { handleTimeUp } = useTimeUpHandler({
    timeUpTriggered,
    setTimeUpTriggered,
    answerSubmitted,
    setAnswerSubmitted,
    setIsCorrect,
    setIsTimeUp,
    setShowingTimeUpFeedback,
    currentQuestion,
    goToNextQuestion,
    setSelectedAnswerId,
    answerOptions
  });

  // Use session time management hook
  useSessionTimeManagement({
    timeUpTriggered,
    navigationTimeUpTriggered,
    timeRemaining,
    answerSubmitted,
    timerActive,
    setTimeUpTriggered,
    setNavigationTimeUpTriggered,
    setTimerActive
  });

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
    updateTimeLimit,
    resetAndStartTimer
  );

  // Use package auto loader hook
  usePackageAutoLoader(kidId, loadQuestions);

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
    loadQuestions,
    isTimeUp,
    showingTimeUpFeedback
  };
};
