
import { useEffect, useState } from 'react';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useSessionState } from './useSessionState';
import { useDialogManagement } from './useDialogManagement';
import { useToastAndLanguage } from './useToastAndLanguage';
import { useSessionEffects } from './useSessionEffects';
import { useAnswerProcessing } from './useAnswerProcessing';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/hooks/questionsTypes';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast, t } = useToastAndLanguage();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
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
        setIsConfiguring(false);
        
        console.log(`Starting to fetch packages for kid ${kidId}`);
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
        
        // Move to the first question if we have questions
        if (questions.length > 0) {
          setCurrentQuestionIndex(0);
          
          // Force set the first question
          if (questions[0]) {
            setCurrentQuestion(questions[0] as Question);
            await loadAnswerOptions(questions[0].id);
          }
        }
        
        setInitialLoadComplete(true);
        
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

  // Additional effect to ensure currentQuestion is set when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= 0 && !currentQuestion) {
      const question = questions[currentQuestionIndex];
      if (question) {
        console.log(`Setting current question to index ${currentQuestionIndex}:`, question);
        setCurrentQuestion(question);
        loadAnswerOptions(question.id);
      }
    }
  }, [questions, currentQuestionIndex, currentQuestion, setCurrentQuestion, loadAnswerOptions]);

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
