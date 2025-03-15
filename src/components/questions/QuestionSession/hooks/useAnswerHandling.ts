
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/hooks/questionsTypes';
import { useLanguage } from '@/contexts/LanguageContext';

export const useAnswerHandling = (
  questions: Question[],
  kidId: string,
  setIsSessionOver: (isOver: boolean) => void,
  setShowRelaxAnimation: (show: boolean) => void
) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const { t } = useLanguage();

  const currentQuestion = questions[currentQuestionIndex];
  
  const resetAnswer = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAnswerSubmitted(false);
  }, []);
  
  const handleAnswerSelect = useCallback((answerId: string) => {
    if (answerSubmitted) return;
    setSelectedAnswer(answerId);
  }, [answerSubmitted]);
  
  const checkAnswer = useCallback(async () => {
    if (!selectedAnswer || !currentQuestion || answerSubmitted) return;
    
    const correctAnswerId = currentQuestion.answers.find(a => a.is_correct)?.id;
    const isAnswerCorrect = selectedAnswer === correctAnswerId;
    
    setIsCorrect(isAnswerCorrect);
    setAnswerSubmitted(true);
    
    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setTotalPoints(prev => prev + (currentQuestion.points || 0));
    } else {
      // Show relaxation animation for wrong answers
      setTimeout(() => {
        setShowRelaxAnimation(true);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setShowRelaxAnimation(false);
        }, 4000);
      }, 1000);
    }
    
    try {
      await supabase.from('kid_answers').insert({
        kid_id: kidId,
        question_id: currentQuestion.id,
        answer_id: selectedAnswer,
        is_correct: isAnswerCorrect,
        points_earned: isAnswerCorrect ? currentQuestion.points : 0
      });
      
      if (isAnswerCorrect) {
        await supabase.rpc('update_kid_points', { 
          kid_id: kidId, 
          points_to_add: currentQuestion.points || 0 
        });
      }
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  }, [selectedAnswer, currentQuestion, answerSubmitted, kidId, setShowRelaxAnimation]);
  
  const goToNextQuestion = useCallback(() => {
    // Fix: Convert the callback to a numeric value
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      resetAnswer();
      setCurrentQuestionIndex(nextIndex);
    } else {
      setIsSessionOver(true);
    }
  }, [currentQuestionIndex, questions.length, resetAnswer, setIsSessionOver]);
  
  return {
    selectedAnswer,
    isCorrect,
    answerSubmitted,
    currentQuestionIndex,
    currentQuestion,
    correctAnswers,
    totalPoints,
    handleAnswerSelect,
    checkAnswer,
    goToNextQuestion
  };
};
