
import { useState } from 'react';
import { AnswerOption, Question } from '@/hooks/questionsTypes';

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
      setCorrectAnswers(prev => prev + 1);
      setTotalPoints(prev => prev + currentQuestion.points);
      setShowWowEffect(true);
      
      // Show celebration effect for a short duration
      setTimeout(() => {
        setShowWowEffect(false);
      }, 1500);
    }
    
    // Close the modal after a short delay to show the result
    // The duration depends on whether the answer was correct (with celebration) or not
    setTimeout(() => {
      setIsModalOpen(false);
    }, wasCorrect ? 1500 : 1000);
    
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
