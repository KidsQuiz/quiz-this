
import { useState } from 'react';
import { AnswerOption } from '@/hooks/questionsTypes';
import { Question } from '@/hooks/questionsTypes';

export const useAnswerHandling = (
  answerOptions: AnswerOption[],
  currentQuestion: Question | null,
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  timeBetweenQuestions: number,
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
      
      // Extended the wow effect to 3 seconds to enjoy the animations
      setTimeout(() => {
        setShowWowEffect(false);
      }, 3000);
    }
    
    // Close the modal after a delay to show the result
    // Added extra time to allow for the enhanced celebration animation
    setTimeout(() => {
      setIsModalOpen(false);
    }, wasCorrect ? 3500 : 2000);
    
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
