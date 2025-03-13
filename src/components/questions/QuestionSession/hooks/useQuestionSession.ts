
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
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast } = useToast();
  
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
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    handleSelectAnswer: originalHandleSelectAnswer
  } = useAnswerHandling(
    answerOptions,
    currentQuestion,
    setCorrectAnswers,
    setTotalPoints,
    setShowWowEffect,
    setCurrentQuestionIndex,
    setIsModalOpen
  );

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

  // Handle current question loading and setup
  useCurrentQuestion(
    isConfiguring,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    setTimeRemaining,
    setAnswerSubmitted,
    setSelectedAnswerId,
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
    setSessionComplete
  );

  // Enhanced answer handling with database recording
  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    originalHandleSelectAnswer,
    setKidAnswers
  );

  // Handle dialog close and terminate the session
  const handleDialogClose = () => {
    // Clean up any styles applied to the body
    document.body.style.removeProperty('pointer-events');
    
    // Use the navigation hook's terminate session method
    handleTerminateSession(onClose);
    
    // Additionally, ensure we reset the modal state
    setIsModalOpen(false);
  };

  // Monitor time remaining and close the question dialog when time elapses
  useEffect(() => {
    if (!currentQuestion || isConfiguring || sessionComplete || answerSubmitted) return;
    
    if (timeRemaining === 0) {
      // Mark as submitted with no selection
      setAnswerSubmitted(true);
      
      // Wait 2 seconds to show the timeout state, then move to next question
      setTimeout(() => {
        if (currentQuestionIndex >= questions.length - 1) {
          // Last question, will complete the session
          setSessionComplete(true);
        } else {
          // Close current question dialog to trigger opening the next one
          setIsModalOpen(false);
        }
      }, 2000);
    }
  }, [
    timeRemaining, 
    currentQuestion, 
    isConfiguring, 
    sessionComplete, 
    answerSubmitted, 
    setAnswerSubmitted, 
    currentQuestionIndex, 
    questions.length, 
    setSessionComplete,
    setIsModalOpen
  ]);

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
