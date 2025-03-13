
import { useState } from 'react';
import { AnswerOption, Question } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

export const useAnswerHandling = (
  answerOptions: AnswerOption[],
  currentQuestion: Question | null,
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Handle answer selection
  const handleSelectAnswer = async (answerId: string) => {
    if (answerSubmitted) return;
    
    setSelectedAnswerId(answerId);
    setAnswerSubmitted(true);
    
    // Find if the selected answer is correct
    const selectedAnswer = answerOptions.find(option => option.id === answerId);
    const wasCorrect = selectedAnswer?.is_correct || false;
    setIsCorrect(wasCorrect);
    
    // Update scores
    if (wasCorrect && currentQuestion) {
      const points = currentQuestion.points;
      console.log(`Correct answer! Adding ${points} points to session total`);
      
      // Play correct sound effect
      playSound('correct');
      
      setCorrectAnswers(prev => prev + 1);
      setTotalPoints(prev => prev + points);
      setShowWowEffect(true);
      
      // Show celebration effect for a short duration
      setTimeout(() => {
        setShowWowEffect(false);
        // Move to next question immediately after celebration
        setCurrentQuestionIndex(prev => prev + 1);
        setIsModalOpen(true);
      }, 1500);
    } else {
      // Play incorrect sound effect
      playSound('incorrect');
      
      // For incorrect answers, move to next question after a shorter delay
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsModalOpen(true);
      }, 1000);
    }
    
    return wasCorrect;
  };

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    handleSelectAnswer
  };
};
