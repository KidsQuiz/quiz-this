
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
  originalHandleSelectAnswer: (answerId: string) => Promise<boolean | undefined>,
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  const { toast } = useToast();

  // Modified handleSelectAnswer to record answers
  const handleSelectAnswer = async (answerId: string) => {
    console.log(`Enhanced answer handling: processing answer ${answerId}`);
    
    // Call the original handler which processes the answer
    const isCorrectAnswer = await originalHandleSelectAnswer(answerId);
    
    // Record this answer
    if (currentQuestion) {
      const selectedAnswer = answerOptions.find(opt => opt.id === answerId);
      const isCorrect = selectedAnswer?.is_correct || false;
      const pointsEarned = isCorrect ? currentQuestion.points : 0;
      
      console.log(`Recording answer for question ${currentQuestion.id}: ${isCorrect ? 'Correct' : 'Incorrect'}, points: ${pointsEarned}`);
      
      const answerRecord = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: isCorrect,
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
            is_correct: isCorrect,
            points_earned: pointsEarned
          });
          
        // If the answer is incorrect, also store it in the wrong_answers table
        if (!isCorrect) {
          // Get the correct answer content
          const correctAnswer = answerOptions.find(opt => opt.is_correct);
          
          if (correctAnswer && selectedAnswer) {
            console.log('Storing wrong answer in database:', {
              kidId,
              questionId: currentQuestion.id,
              answerId,
              questionContent: currentQuestion.content,
              answerContent: selectedAnswer.content,
              correctAnswerContent: correctAnswer.content
            });
            
            try {
              const { error } = await supabase
                .from('kid_wrong_answers')
                .insert({
                  kid_id: kidId,
                  question_id: currentQuestion.id,
                  answer_id: answerId,
                  question_content: currentQuestion.content,
                  answer_content: selectedAnswer.content,
                  correct_answer_content: correctAnswer.content
                });
                
              if (error) {
                console.error('Error recording wrong answer:', error);
                // Don't show toast for this error to avoid distracting the user
              } else {
                console.log(`Wrong answer recorded for kid ${kidId}`);
              }
            } catch (insertError) {
              console.error('Exception when recording wrong answer:', insertError);
            }
          }
        }
          
        console.log(`Answer recorded in database for kid ${kidId}`);
      } catch (error) {
        console.error('Error recording answer:', error);
        toast({
          variant: "destructive",
          title: "Error recording answer",
          description: "There was a problem saving the answer."
        });
      }
    }
    
    return isCorrectAnswer;
  };

  return { handleSelectAnswer };
};
