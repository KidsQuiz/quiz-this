
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useEnhancedAnswerHandling } from './useEnhancedAnswerHandling';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useAnswerDelegation = (
  kidId: string,
  currentQuestion: Question | null,
  answerOptions: AnswerOption[],
  handleAnswerSelect: (answerId: string) => void,
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  // The key issue was here - we're not correctly passing through the answer selection
  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    handleAnswerSelect, // Pass the original handler directly without wrapping
    setKidAnswers
  );
  
  return {
    handleSelectAnswer
  };
};
