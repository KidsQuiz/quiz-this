
import { useState } from 'react';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useKidAnswersState = () => {
  const [kidAnswers, setKidAnswers] = useState<KidAnswer[]>([]);

  return {
    kidAnswers,
    setKidAnswers
  };
};

export type { KidAnswer };
