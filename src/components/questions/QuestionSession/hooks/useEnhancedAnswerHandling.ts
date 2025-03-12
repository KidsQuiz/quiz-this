
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedAnswerHandling = (
  kidId: string,
  currentQuestion: any,
  answerOptions: any[],
  originalHandleSelectAnswer: (answerId: string) => Promise<boolean | undefined>,
  setKidAnswers: React.Dispatch<React.SetStateAction<Array<{
    questionId: string,
    answerId: string,
    isCorrect: boolean,
    points: number,
    timestamp: Date
  }>>>
) => {
  // Modified handleSelectAnswer to record answers
  const handleSelectAnswer = async (answerId: string) => {
    // Call the original handler which processes the answer
    await originalHandleSelectAnswer(answerId);
    
    // Record this answer
    if (currentQuestion) {
      const selectedAnswer = answerOptions.find(opt => opt.id === answerId);
      const isCorrectAnswer = selectedAnswer?.is_correct || false;
      const pointsEarned = isCorrectAnswer ? currentQuestion.points : 0;
      
      const answerRecord = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: isCorrectAnswer,
        points: pointsEarned,
        timestamp: new Date()
      };
      
      setKidAnswers(prev => [...prev, answerRecord]);
      
      try {
        // Store the answer in the database for future reference
        await supabase
          .from('kid_answers')
          .insert({
            kid_id: kidId,
            question_id: currentQuestion.id,
            answer_id: answerId,
            is_correct: isCorrectAnswer,
            points_earned: pointsEarned
          });
      } catch (error) {
        console.error('Error recording answer:', error);
      }
    }
  };

  return { handleSelectAnswer };
};
