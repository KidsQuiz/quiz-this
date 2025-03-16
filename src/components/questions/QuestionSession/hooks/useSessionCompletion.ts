
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
        // Record session results in database using kid_answers table
        // We'll create a summary record by inserting a special answer record
        await supabase.from('kid_answers').insert({
          kid_id: kidId,
          question_id: questions.length > 0 ? questions[0].id : '00000000-0000-0000-0000-000000000000',
          answer_id: '00000000-0000-0000-0000-000000000000', // Special placeholder for session summary
          is_correct: true, // This is a summary record, not an actual answer
          points_earned: totalPoints,
          created_at: new Date().toISOString()
        });
        
        console.log('Session results recorded in database');
        
        // Check for a perfect score
        if (correctAnswers === questions.length && questions.length > 0) {
          console.log('Perfect score achieved! Recording milestone.');
          
          // Record this milestone using the milestones table
          await supabase.from('milestones').insert({
            kid_id: kidId,
            name: 'Perfect Score', // Using name field for milestone type
            points_required: 0, // Not relevant for this usage
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
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
