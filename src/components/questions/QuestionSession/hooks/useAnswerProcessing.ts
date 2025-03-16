
import { useAnswerHandling } from './useAnswerHandling';
import { useEnhancedAnswerHandling } from './useEnhancedAnswerHandling';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

export const useAnswerProcessing = (
  kidId: string,
  currentQuestion: Question | null,
  answerOptions: AnswerOption[],
  questions: Question[],
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setKidAnswers: React.Dispatch<React.SetStateAction<any[]>>
) => {
  // Handle answer submission and scoring
  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setShowRelaxAnimation,
    handleSelectAnswer: originalHandleSelectAnswer
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
    setSessionComplete
  );

  // Enhanced answer handling with database recording
  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    originalHandleSelectAnswer,
    setKidAnswers
  );

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setShowRelaxAnimation,
    handleSelectAnswer
  };
};
