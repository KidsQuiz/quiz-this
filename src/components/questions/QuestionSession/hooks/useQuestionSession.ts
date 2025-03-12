import { useState, useEffect, useCallback } from 'react';
import { usePackageSelection } from './usePackageSelection';
import { useQuestionLoading } from './useQuestionLoading';
import { useQuestionNavigation } from './useQuestionNavigation';
import { useAnswerHandling } from './useAnswerHandling';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useQuestionSession = (kidId: string, kidName: string, onClose: () => void) => {
  const { toast } = useToast();
  const [timeBetweenQuestions, setTimeBetweenQuestions] = useState(5);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [kidAnswers, setKidAnswers] = useState<Array<{
    questionId: string,
    answerId: string,
    isCorrect: boolean,
    points: number,
    timestamp: Date
  }>>([]);

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
  } = useQuestionLoading(toast);

  // Handle question navigation and timers
  const {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setTimerActive,
    setCurrentQuestionIndex,
    setTimeRemaining,
    handleTimeUp
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
    timeBetweenQuestions,
    setCurrentQuestionIndex,
    setIsModalOpen
  );

  // Start the session with the selected packages
  const handleStartSession = useCallback(async () => {
    if (selectedPackageIds.length === 0) {
      toast({
        title: "No packages selected",
        description: "Please select at least one question package to start.",
        variant: "destructive"
      });
      return;
    }
    
    await loadQuestions(selectedPackageIds);
    setIsConfiguring(false);
    setCurrentQuestionIndex(0);
  }, [loadQuestions, selectedPackageIds, setCurrentQuestionIndex, toast]);

  // Modified handleSelectAnswer to record answers
  const handleSelectAnswer = async (answerId: string) => {
    // Call the original handler which processes the answer
    await originalHandleSelectAnswer(answerId);
    
    // Record this answer
    if (currentQuestion) {
      const selectedAnswer = answerOptions.find(opt => opt.id === answerId);
      const isCorrectAnswer = selectedAnswer?.is_correct || false;
      const pointsEarned = isCorrectAnswer ? currentQuestion.points : 0;
      
      const answerRecord = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: isCorrectAnswer,
        points: pointsEarned,
        timestamp: new Date()
      };
      
      setKidAnswers(prev => [...prev, answerRecord]);
      
      try {
        // Store the answer in the database for future reference
        await supabase
          .from('kid_answers')
          .insert({
            kid_id: kidId,
            question_id: currentQuestion.id,
            answer_id: answerId,
            is_correct: isCorrectAnswer,
            points_earned: pointsEarned
          });
      } catch (error) {
        console.error('Error recording answer:', error);
      }
    }
  };

  // Advance to the next question when modal is closed
  useEffect(() => {
    if (!isModalOpen && !sessionComplete && currentQuestionIndex < questions.length) {
      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex >= questions.length) {
        // If we've reached the end, mark session as complete
        setSessionComplete(true);
      } else {
        // Otherwise, set up a timer to show the next question
        const timer = setTimeout(() => {
          setCurrentQuestionIndex(nextQuestionIndex);
          setIsModalOpen(true);
        }, timeBetweenQuestions * 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, timeBetweenQuestions, setCurrentQuestionIndex]);

  // Display the current question
  useEffect(() => {
    if (isConfiguring || questions.length === 0) return;
    
    const loadCurrentQuestion = async () => {
      // Check if we've reached the end of questions
      if (currentQuestionIndex >= questions.length) {
        setSessionComplete(true);
        
        // Update kid's points in the database
        if (totalPoints > 0) {
          try {
            const { data: kidData, error: kidError } = await supabase
              .from('kids')
              .select('points')
              .eq('id', kidId)
              .single();
              
            if (kidError) throw kidError;
            
            const currentPoints = kidData?.points || 0;
            const newTotalPoints = currentPoints + totalPoints;
            
            const { error: updateError } = await supabase
              .from('kids')
              .update({ points: newTotalPoints })
              .eq('id', kidId);
              
            if (updateError) throw updateError;
            
            toast({
              title: "Points updated!",
              description: `${kidName} now has ${newTotalPoints} points!`,
            });
          } catch (error) {
            console.error('Error updating points:', error);
          }
        }
        return;
      }
      
      const question = questions[currentQuestionIndex];
      setCurrentQuestion(question);
      setTimeRemaining(question.time_limit);
      setAnswerSubmitted(false);
      setSelectedAnswerId(null);
      setIsCorrect(false);
      setShowWowEffect(false);
      
      await loadAnswerOptions(question.id);
      
      // Start the timer for this question
      setTimerActive(true);
    };
    
    loadCurrentQuestion();
  }, [currentQuestionIndex, isConfiguring, questions, kidId, kidName, loadAnswerOptions, setAnswerSubmitted, setCurrentQuestion, setIsCorrect, setSelectedAnswerId, setShowWowEffect, setTimeRemaining, setTimerActive, toast, totalPoints]);

  return {
    timeBetweenQuestions,
    setTimeBetweenQuestions,
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
    handleSelectAnswer
  };
};
