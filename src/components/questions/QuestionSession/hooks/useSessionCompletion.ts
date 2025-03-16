
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { supabase } from '@/integrations/supabase/client';
import { updateKidPoints } from './usePointsUpdate';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Handle session completion
  useEffect(() => {
    if (!sessionComplete) return;
    
    const completeSession = async () => {
      console.log(`===== SESSION COMPLETION =====`);
      console.log(`Session completed for ${kidName}. Score: ${correctAnswers}/${questions.length}`);
      console.log(`Total points earned: ${totalPoints}`);
      
      try {
        // Update kid's points in the database
        if (totalPoints > 0) {
          console.log(`CRITICAL: Updating points for kid ${kidName}: Adding ${totalPoints} points`);
          const newTotalPoints = await updateKidPoints(kidId, kidName, totalPoints, toast);
          console.log(`Points update complete. New total: ${newTotalPoints}`);
          
          // Double-check that points were actually updated
          const { data: verifyData, error: verifyError } = await supabase
            .from('kids')
            .select('points')
            .eq('id', kidId)
            .single();
            
          if (verifyError) {
            console.error('Error verifying points update:', verifyError);
          } else {
            console.log(`Verification - Kid points after update: ${verifyData.points}`);
          }
        } else {
          console.log(`No points to add for kid ${kidName}`);
        }
        
        // Record session results in database using kid_answers table
        // We'll create a summary record by inserting a special answer record
        const { error: sessionError } = await supabase.from('kid_answers').insert({
          kid_id: kidId,
          question_id: questions.length > 0 ? questions[0].id : '00000000-0000-0000-0000-000000000000',
          answer_id: '00000000-0000-0000-0000-000000000000', // Special placeholder for session summary
          is_correct: true, // This is a summary record, not an actual answer
          points_earned: totalPoints,
          created_at: new Date().toISOString()
        });
        
        if (sessionError) {
          console.error('Error recording session results:', sessionError);
        } else {
          console.log('Session results recorded in database');
        }
        
        // Check for a perfect score
        if (correctAnswers === questions.length && questions.length > 0) {
          console.log('Perfect score achieved! Recording milestone.');
          
          // Record this milestone using the milestones table
          const { error: milestoneError } = await supabase.from('milestones').insert({
            kid_id: kidId,
            name: 'Perfect Score', // Using name field for milestone type
            points_required: 0, // Not relevant for this usage
            image_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
          if (milestoneError) {
            console.error('Error recording perfect score milestone:', milestoneError);
          } else {
            console.log('Perfect score milestone recorded');
          }
        }
        
        console.log(`===== SESSION COMPLETION FINISHED =====`);
      } catch (error) {
        console.error('Error recording session results:', error);
        toast({
          variant: "destructive",
          title: "Error saving results",
          description: "There was a problem saving your results. Your points may not have been updated."
        });
      }
    };
    
    completeSession();
  }, [
    sessionComplete, 
    kidId, 
    kidName, 
    questions.length, 
    correctAnswers, 
    totalPoints,
    toast
  ]);
  
  return {
    checkForCompletion: () => {
      if (currentQuestionIndex >= questions.length && questions.length > 0) {
        console.log(`Completion check: currentQuestionIndex (${currentQuestionIndex}) >= questions.length (${questions.length})`);
        setSessionComplete(true);
      }
    }
  };
};
