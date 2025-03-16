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

  useEffect(() => {
    const fetchPackagesAndStartSession = async () => {
      try {
        setIsConfiguring(false);
        
        console.log(`Starting to fetch packages for kid ${kidId}`);
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
        
        const packageIds = assignedPackages.map(p => p.package_id);
        await loadQuestions(packageIds);
        
        if (questions.length > 0) {
          setCurrentQuestionIndex(0);
          
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
