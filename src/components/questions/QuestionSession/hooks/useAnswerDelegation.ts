
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
  const { handleSelectAnswer } = useEnhancedAnswerHandling(
    kidId,
    currentQuestion,
    answerOptions,
    async (answerId: string) => {
      handleAnswerSelect(answerId);
      return true;
    },
    setKidAnswers
  );
  
  return {
    handleSelectAnswer
  };
};
