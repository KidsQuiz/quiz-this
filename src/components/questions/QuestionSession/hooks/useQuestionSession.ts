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
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
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
    setKidAnswers
  } = useSessionState();

  // Load packages and handle selection
  const {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = usePackageSelection(kidId, kidName, onClose, toast);

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

  // Handle answer submission and scoring
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

  // Map return values to expected props
  const selectedAnswerId = selectedAnswer;

  // Handle session startup
  const { handleStartSession } = useSessionStartup(
    selectedPackageIds,
    loadQuestions,
    setIsConfiguring,
    setCurrentQuestionIndex
  );

  // Handle modal transitions between questions
  useModalTransition(
    isModalOpen,
    sessionComplete,
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete
  );

  // We need to define this function to keep it outside the useCurrentQuestion hook
  const setShowRelaxAnimation = (show: boolean) => {
    // This is intentionally empty as the relaxation animation
    // is handled directly by the QuestionDisplay component
    // and the animation state is managed there
  };

  // Handle current question loading and setup
  useCurrentQuestion(
    isConfiguring,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    setTimeRemaining,
    setAnswerSubmitted,
    setSelectedAnswer,
    setIsCorrect,
    setShowWowEffect,
    setTimerActive,
    loadAnswerOptions
  );

  // Handle session completion
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

  // Enhanced answer handling with database recording
  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    handleAnswerSelect,
    setKidAnswers
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

  // Handle timeouts
  useTimeoutHandling(
    timeRemaining,
    currentQuestion,
    isConfiguring,
    sessionComplete,
    answerSubmitted,
    currentQuestionIndex,
    questions,
    setAnswerSubmitted,
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
