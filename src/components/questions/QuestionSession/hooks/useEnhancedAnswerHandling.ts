
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useEnhancedAnswerHandling = (
  kidId: string,
  currentQuestion: Question | null,
  answerOptions: AnswerOption[],
  originalHandleSelectAnswer: (answerId: string) => void,
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  const { toast } = useToast();

  // Modified handleSelectAnswer to record answers
  const handleSelectAnswer = async (answerId: string) => {
    console.log(`Enhanced answer handling: processing answer ${answerId}`);
    
    // Call the original handler which processes the answer
    // Don't await it here - the original handler will handle its own flow
    originalHandleSelectAnswer(answerId);
    
    // Record this answer for our internal state tracking
    // This is separate from the database recording in the original handler
    if (currentQuestion) {
      const selectedAnswer = answerOptions.find(opt => opt.id === answerId);
      const isCorrect = selectedAnswer?.is_correct || false;
      const pointsEarned = isCorrect ? currentQuestion.points : 0;
      
      console.log(`Recording answer in enhanced handler for question ${currentQuestion.id}: ${isCorrect ? 'Correct' : 'Incorrect'}, points: ${pointsEarned}`);
      
      const answerRecord = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: isCorrect,
        points: pointsEarned,
        timestamp: new Date()
      };
      
      setKidAnswers(prev => [...prev, answerRecord]);
    }
  };

  return { handleSelectAnswer };
};
