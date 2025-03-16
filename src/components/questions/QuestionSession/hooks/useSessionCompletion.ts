
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { supabase } from '@/integrations/supabase/client';

/**
 * Manages the session completion logic and recording final results
 */
export const useSessionCompletion = (
  kidId: string,
  kidName: string,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  totalPoints: number,
  correctAnswers: number,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle session completion
  useEffect(() => {
    if (!sessionComplete) return;
    
    const completeSession = async () => {
      console.log(`Session completed for ${kidName}. Score: ${correctAnswers}/${questions.length}`);
      
      try {
        // Record session results in database
        await supabase.from('question_sessions').insert({
          kid_id: kidId,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          total_points: totalPoints,
          created_at: new Date().toISOString()
        });
        
        console.log('Session results recorded in database');
        
        // Check for a perfect score
        if (correctAnswers === questions.length && questions.length > 0) {
          console.log('Perfect score achieved! Recording milestone.');
          
          // Record this milestone
          await supabase.from('kid_milestones').insert({
            kid_id: kidId,
            milestone_type: 'perfect_score',
            description: `Got all ${questions.length} questions right!`,
            points: totalPoints,
            created_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error recording session results:', error);
      }
    };
    
    completeSession();
  }, [
    sessionComplete, 
    kidId, 
    kidName, 
    questions.length, 
    correctAnswers, 
    totalPoints
  ]);
  
  return {
    checkForCompletion: () => {
      if (currentQuestionIndex >= questions.length && questions.length > 0) {
        setSessionComplete(true);
      }
    }
  };
};
