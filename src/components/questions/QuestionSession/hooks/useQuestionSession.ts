
import { usePackageSelection } from './usePackageSelection';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useAnswerHandling } from './useAnswerHandling';
import { useSessionState } from './useSessionState';
import { useSessionStartup } from './useSessionStartup';
import { useModalTransition } from './useModalTransition';
import { useCurrentQuestion } from './useCurrentQuestion';
import { useSessionCompletion } from './useSessionCompletion';
import { useEnhancedAnswerHandling } from './useEnhancedAnswerHandling';
import { useTimeoutHandling } from './useTimeoutHandling';
import { useDialogManagement } from './useDialogManagement';
import { useRelaxAnimation } from './useRelaxAnimation';
import { useQuestionDialog } from './useQuestionDialog';
import { useEffectsHandling } from './useEffectsHandling';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Use our new extracted hooks
  const { showRelaxAnimationState, setShowRelaxAnimation } = useRelaxAnimation();
  const { isModalOpen, setIsModalOpen, getEffectiveOpenState } = useQuestionDialog(onClose);

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
    kidAnswers,
    setKidAnswers
  } = useSessionState();

  // Use the extracted effects hook
  const { handleBoomEffectComplete } = useEffectsHandling(
    showWowEffect,
    showBoomEffect,
    setShowBoomEffect
  );

  const {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = usePackageSelection(kidId, kidName, onClose, toast);

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

  const selectedAnswerId = selectedAnswer;

  const { handleStartSession } = useSessionStartup(
    selectedPackageIds,
    loadQuestions,
    setIsConfiguring,
    setCurrentQuestionIndex
  );

  useModalTransition(
    isModalOpen,
    sessionComplete,
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete
  );

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

  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    async (answerId: string) => {
      handleAnswerSelect(answerId);
      return true;
    },
    setKidAnswers
  );

  const { handleDialogClose } = useDialogManagement(
    setIsModalOpen,
    onClose,
    showBoomEffect,
    sessionComplete,
    correctAnswers,
    questions
  );

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
