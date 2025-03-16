
import { useState, useEffect } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useAnswerHandling } from './useAnswerHandling';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast, t } = useToastAndLanguage();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
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

  // Use our answer handling hook
  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
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

  // Initial setup - fetch questions
  useEffect(() => {
    const setup = async () => {
      console.log("Setting up question session for kid:", kidId);
      
      try {
        await loadQuestions(kidId);
        setCurrentQuestionIndex(0);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          variant: "destructive",
          title: t('errorLoadingQuestions'),
          description: t('tryAgainLater')
        });
        
        // Close the session on error
        onClose();
      }
    };
    
    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  // Update current question when index changes
  useEffect(() => {
    if (!questions.length || !initialLoadComplete) return;
    
    if (currentQuestionIndex >= questions.length) {
      // We've reached the end
      setSessionComplete(true);
      return;
    }
    
    const question = questions[currentQuestionIndex];
    console.log("Setting current question:", question?.content);
    setCurrentQuestion(question);
    
    // Reset answer state when question changes
    resetAnswerState();
    setAnswerSubmitted(false);
    setSelectedAnswerId(null);
    setIsCorrect(false);
    
    // Load answer options for the new question
    loadAnswerOptions(question.id);
    
    // Set the timer based on the question's time limit
    if (question.time_limit && !sessionComplete) {
      setTimeRemaining(question.time_limit);
      // Start the timer after a short delay to allow the UI to update
      setTimeout(() => {
        setTimerActive(true);
      }, 500);
    }
  }, [
    currentQuestionIndex,
    initialLoadComplete,
    loadAnswerOptions,
    questions,
    resetAnswerState,
    sessionComplete,
    setAnswerSubmitted,
    setCurrentQuestion,
    setIsCorrect,
    setSelectedAnswerId,
    setSessionComplete,
    setTimeRemaining,
    setTimerActive
  ]);

  // Handle time up - automatically move to next question
  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted && currentQuestion && timerActive) {
      console.log("Time's up for question:", currentQuestion.content);
      
      // Show incorrect feedback
      setAnswerSubmitted(true);
      setIsCorrect(false);
      setTimerActive(false);
      
      // Play wrong sound
      // We can't use playWrongSound() here as it would create a circular dependency
      const audio = new Audio('/sounds/wrong.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Error playing sound:", e));
      
      // Show relax animation
      setShowRelaxAnimation(true);
      
      // Move to next question after delay
      setTimeout(() => {
        // Reset state
        resetAnswerState();
        setShowRelaxAnimation(false);
        
        // Move to next question
        setCurrentQuestionIndex(prev => {
          const next = prev + 1;
          if (next >= questions.length) {
            setSessionComplete(true);
            setShowBoomEffect(true);
            return prev;
          }
          return next;
        });
        
        // Restart timer for next question if not the last
        setTimeout(() => {
          const isLastQuestion = currentQuestionIndex + 1 >= questions.length;
          if (!isLastQuestion) {
            setTimerActive(true);
          }
        }, 500);
      }, 2500);
    }
  }, [
    answerSubmitted,
    currentQuestion,
    currentQuestionIndex,
    questions.length,
    resetAnswerState,
    setAnswerSubmitted,
    setCurrentQuestionIndex,
    setIsCorrect,
    setSessionComplete,
    setShowBoomEffect,
    setShowRelaxAnimation,
    setTimeRemaining,
    setTimerActive,
    timeRemaining,
    timerActive
  ]);

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
