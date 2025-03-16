
import { useModalTransition } from './useModalTransition';
import { useCurrentQuestion } from './useCurrentQuestion';
import { useSessionCompletion } from './useSessionCompletion';
import { useTimeoutHandling } from './useTimeoutHandling';
import { Question } from '@/hooks/questionsTypes';

export const useSessionEffects = (
  kidId: string,
  kidName: string,
  isConfiguring: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  isModalOpen: boolean,
  correctAnswers: number,
  totalPoints: number,
  answerSubmitted: boolean,
  timeRemaining: number,
  currentQuestion: Question | null,
  showBoomEffect: boolean,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>,
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>,
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  loadAnswerOptions: (questionId: string) => Promise<void>
) => {
  // Handle modal transitions between questions
  useModalTransition(
    isModalOpen,
    sessionComplete,
    currentQuestionIndex,
    questions,
    setCurrentQuestionIndex,
    setIsModalOpen,
    setSessionComplete
  );

  // Handle current question loading and setup
  useCurrentQuestion(
    isConfiguring,
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    setTimeRemaining,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    setShowWowEffect,
    setTimerActive,
    loadAnswerOptions
  );

  // Handle session completion
  useSessionCompletion(
    kidId,
    kidName,
    sessionComplete,
    currentQuestionIndex,
    questions,
    totalPoints,
    correctAnswers,
    setSessionComplete,
    setShowBoomEffect,
    setIsModalOpen
  );

  // Handle timeouts
  useTimeoutHandling(
    timeRemaining,
    currentQuestion,
    isConfiguring,
    sessionComplete,
    answerSubmitted,
    currentQuestionIndex,
    questions,
    setAnswerSubmitted,
    setSessionComplete,
    setIsModalOpen
  );
};
