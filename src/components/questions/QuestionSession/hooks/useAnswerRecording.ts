
import { AnswerOption, Question } from '@/hooks/questionsTypes';
import { supabase } from '@/integrations/supabase/client';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useAnswerRecording = (
  kidId: string,
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  const recordAnswer = async (
    currentQuestion: Question | null,
    answerId: string,
    wasCorrect: boolean,
    selectedAnswer: AnswerOption | undefined,
    answerOptions: AnswerOption[]
  ) => {
    if (!currentQuestion) return;
    
    try {
      // Create a new answer record
      const newAnswer: KidAnswer = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: wasCorrect,
        points: wasCorrect ? currentQuestion.points : 0,
        timestamp: new Date()
      };
      
      // Add to local state
      setKidAnswers(prev => [...prev, newAnswer]);
      
      // Record in database if not correct (for analytics of wrong answers)
      if (!wasCorrect) {
        const selectedAnswerContent = selectedAnswer?.content || "";
        const correctAnswer = answerOptions.find(a => a.is_correct)?.content || "";
        
        await supabase.from('kid_wrong_answers').insert({
          kid_id: kidId,
          question_id: currentQuestion.id,
          answer_id: answerId,
          question_content: currentQuestion.content,
          answer_content: selectedAnswerContent,
          correct_answer_content: correctAnswer,
          created_at: new Date().toISOString()
        });
      } else {
        // Log correct answer for debugging
        console.log(`Recording answer for question ${currentQuestion.id}: Correct, points: ${currentQuestion.points}`);
      }
      
      console.log(`Answer recorded in database for kid ${kidId}`);
    } catch (error) {
      console.error('Error recording answer:', error);
    }
  };

  return { recordAnswer };
};
