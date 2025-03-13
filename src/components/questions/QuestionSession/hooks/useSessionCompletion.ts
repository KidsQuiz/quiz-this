
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Question } from '@/hooks/questionsTypes';

export const useSessionCompletion = (
  kidId: string,
  kidName: string,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  totalPoints: number,
  correctAnswers: number,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  // Handle session completion
  useEffect(() => {
    if (sessionComplete) return;
    
    // Check if we've reached the end of questions
    if (currentQuestionIndex >= questions.length && questions.length > 0) {
      console.log(`Session complete: correctAnswers=${correctAnswers}, totalQuestions=${questions.length}`);
      setSessionComplete(true);
      
      // We'll trigger the boom effect in the useQuestionSession component when dialog closes
      // instead of here, so we can ensure it appears after the dialog is closed
      
      // Update kid's points in the database
      const updateKidPoints = async () => {
        if (totalPoints <= 0) return;
        
        try {
          console.log(`Updating points for kid ${kidId} - adding ${totalPoints} points`);
          
          // First, get the current points
          const { data: kidData, error: kidError } = await supabase
            .from('kids')
            .select('points')
            .eq('id', kidId)
            .single();
            
          if (kidError) {
            console.error('Error fetching kid points:', kidError);
            throw kidError;
          }
          
          const currentPoints = kidData?.points || 0;
          const newTotalPoints = currentPoints + totalPoints;
          
          console.log(`Current points: ${currentPoints}, new total: ${newTotalPoints}`);
          
          // Then update with the new total
          const { error: updateError } = await supabase
            .from('kids')
            .update({ points: newTotalPoints })
            .eq('id', kidId);
            
          if (updateError) {
            console.error('Error updating points:', updateError);
            throw updateError;
          }
          
          toast({
            title: "Points updated!",
            description: `${kidName} now has ${newTotalPoints} points!`,
          });
        } catch (error) {
          console.error('Error updating points:', error);
          toast({
            variant: "destructive",
            title: "Error updating points",
            description: "There was a problem updating the points total."
          });
        }
      };
      
      // Call the update function immediately when session completes
      updateKidPoints();
    }
  }, [currentQuestionIndex, questions.length, sessionComplete, kidId, kidName, totalPoints, correctAnswers, toast, setSessionComplete, setShowBoomEffect]);
};
