
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateKidPoints } from './usePointsUpdate';

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
    
    console.log(`Answer selected: ${answerId}`);
    setSelectedAnswer(answerId);
    
    // Automatically check answer when selected
    checkAnswer(answerId);
  }, [answerSubmitted]);
  
  const checkAnswer = useCallback(async (answerId?: string) => {
    const idToCheck = answerId || selectedAnswer;
    if (!idToCheck || !currentQuestion || answerSubmitted) return;
    
    console.log(`Checking answer ${idToCheck} for question ${currentQuestion.id}`);
    
    // Get all the answer options for the current question from the database
    const { data: answerOptions, error } = await supabase
      .from('answer_options')
      .select('*')
      .eq('question_id', currentQuestion.id);
      
    if (error) {
      console.error('Error fetching answer options:', error);
      return;
    }
      
    if (!answerOptions || answerOptions.length === 0) {
      console.error('No answer options found for question:', currentQuestion.id);
      return;
    }
    
    const correctAnswerId = answerOptions.find(a => a.is_correct)?.id;
    const isAnswerCorrect = idToCheck === correctAnswerId;
    
    console.log(`Answer is ${isAnswerCorrect ? 'correct' : 'incorrect'}, correct answer ID: ${correctAnswerId}`);
    
    setIsCorrect(isAnswerCorrect);
    setAnswerSubmitted(true);
    
    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setTotalPoints(prev => prev + (currentQuestion.points || 0));
    } else {
      // Show relaxation animation for wrong answers immediately
      console.log('Showing relaxation animation for wrong answer');
      setShowRelaxAnimation(true);
    }
    
    try {
      // Record the answer in the database
      await supabase.from('kid_answers').insert({
        kid_id: kidId,
        question_id: currentQuestion.id,
        answer_id: idToCheck,
        is_correct: isAnswerCorrect,
        points_earned: isAnswerCorrect ? currentQuestion.points : 0
      });
      
      if (isAnswerCorrect) {
        // Get current kid points first
        const { data: kidData } = await supabase
          .from('kids')
          .select('points')
          .eq('id', kidId)
          .single();
        
        // Then update the points directly
        if (kidData) {
          const newPoints = (kidData.points || 0) + (currentQuestion.points || 0);
          await supabase
            .from('kids')
            .update({ points: newPoints })
            .eq('id', kidId);
        }
      }
    } catch (error) {
      console.error('Error recording answer:', error);
    }
    
    // Set different delays based on correct/incorrect:
    // - Correct: move to next question after 2.5 seconds (to show animation)
    // - Incorrect: move to next question after 5 seconds (to show the correct answer)
    const delayTime = isAnswerCorrect ? 2500 : 5000;
    
    // Add a delay before moving to the next question after answer
    setTimeout(() => {
      goToNextQuestion();
    }, delayTime);
    
    return isAnswerCorrect;
  }, [selectedAnswer, currentQuestion, answerSubmitted, kidId, setShowRelaxAnimation]);
  
  const goToNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      // Critical fix: Reset the answer state before changing the question index
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
