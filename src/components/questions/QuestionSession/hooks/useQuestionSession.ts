
import { useState, useEffect } from 'react';
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
    setShowRelaxAnimation,
    // Include these from useSessionState
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

  // Use question change effects hook with our new resetAndStartTimer function
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

  // Create a function to go to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSessionComplete(true);
    }
  };

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
    setSelectedAnswerId
  });

  // React to triggerTimeUp by setting timeUpTriggered
  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted && timerActive) {
      console.log("Time ran out, triggering time up handler");
      setTimeUpTriggered(true);
    }
  }, [timeRemaining, answerSubmitted, timerActive, setTimeUpTriggered]);

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
