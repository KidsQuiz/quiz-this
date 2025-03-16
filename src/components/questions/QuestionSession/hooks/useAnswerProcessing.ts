
import { useCallback } from 'react';
import { AnswerOption, Question } from '@/hooks/questionsTypes';
import { useAnswerState } from './useAnswerState';
import { useAnswerRecording } from './useAnswerRecording';
import { useCorrectAnswerHandling } from './useCorrectAnswerHandling';
import { useIncorrectAnswerHandling } from './useIncorrectAnswerHandling';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

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
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  // Use the answer state hook
  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    setShowRelaxAnimation,
    resetAnswerState,
    isMountedRef
  } = useAnswerState();

  // Use the answer recording hook
  const { recordAnswer } = useAnswerRecording(kidId, setKidAnswers);

  // Use the correct answer handling hook
  const { handleCorrectAnswer } = useCorrectAnswerHandling(
    questions,
    setCorrectAnswers,
    setTotalPoints,
    setShowWowEffect,
    setCurrentQuestionIndex,
    setSessionComplete,
    setShowBoomEffect,
    setIsModalOpen,
    resetAnswerState
  );

  // Use the incorrect answer handling hook
  const { handleIncorrectAnswer } = useIncorrectAnswerHandling(
    setShowRelaxAnimation,
    setIsModalOpen,
    resetAnswerState,
    setCurrentQuestionIndex
  );

  // Handle answer selection
  const handleSelectAnswer = useCallback(async (answerId: string) => {
    if (answerSubmitted || !currentQuestion) return;
    
    console.log(`Answer selected: ${answerId}`);
    setSelectedAnswerId(answerId);
    setAnswerSubmitted(true);
    
    // Find if the selected answer is correct
    const selectedAnswer = answerOptions.find(option => option.id === answerId);
    const wasCorrect = selectedAnswer?.is_correct || false;
    setIsCorrect(wasCorrect);
    
    // Record the answer in the database
    await recordAnswer(currentQuestion, answerId, wasCorrect, selectedAnswer, answerOptions);
    
    // Handle correct or incorrect answer
    if (wasCorrect && currentQuestion) {
      handleCorrectAnswer(currentQuestion);
    } else {
      handleIncorrectAnswer();
    }
    
    return wasCorrect;
  }, [
    answerSubmitted,
    currentQuestion,
    answerOptions,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    recordAnswer,
    handleCorrectAnswer,
    handleIncorrectAnswer
  ]);

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    handleSelectAnswer,
    resetAnswerState
  };
};
