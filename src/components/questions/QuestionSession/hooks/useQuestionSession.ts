
import { useEffect } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useSessionEffects } from './useSessionEffects';
import { useAnswerProcessing } from './useAnswerProcessing';
import { supabase } from '@/integrations/supabase/client';

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

  // Automatically load all assigned packages for this kid
  useEffect(() => {
    const fetchPackagesAndStartSession = async () => {
      try {
        // Get all packages assigned to this kid
        const { data: assignedPackages, error: assignmentsError } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (assignmentsError) throw assignmentsError;
        
        console.log(`Assigned packages for kid ${kidId}:`, assignedPackages);
        
        if (!assignedPackages || assignedPackages.length === 0) {
          toast({
            title: t("noPackages"),
            description: t("assignPackagesFirst"),
            variant: "destructive"
          });
          onClose();
          return;
        }
        
        // Extract package IDs and load questions
        const packageIds = assignedPackages.map(p => p.package_id);
        await loadQuestions(packageIds);
        
        // Move to the first question
        setCurrentQuestionIndex(0);
        
      } catch (error: any) {
        console.error('Error loading assigned packages:', error.message);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("somethingWentWrong")
        });
        onClose();
      }
    };
    
    fetchPackagesAndStartSession();
  }, [kidId, loadQuestions, onClose, toast, t, setCurrentQuestionIndex]);

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
    isLoading,
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
