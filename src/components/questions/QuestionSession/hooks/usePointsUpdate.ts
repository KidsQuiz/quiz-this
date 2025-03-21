
import { supabase } from '@/integrations/supabase/client';
import { toast as toastFunction } from '@/hooks/use-toast';

export const updateKidPoints = async (
  kidId: string, 
  kidName: string, 
  earnedPoints: number,
  toast: any = toastFunction
) => {
  if (earnedPoints <= 0) return;
  
  try {
    console.log(`Updating points for kid ${kidName} (${kidId}): +${earnedPoints} points`);
    
    // First fetch the current points
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
    const newTotalPoints = currentPoints + earnedPoints;
    
    console.log(`Current points: ${currentPoints}, New total: ${newTotalPoints}`);
    
    // Now update with the new total
    const { error: updateError } = await supabase
      .from('kids')
      .update({ points: newTotalPoints })
      .eq('id', kidId);
      
    if (updateError) {
      console.error('Error updating kid points:', updateError);
      throw updateError;
    }
    
    console.log(`Points updated successfully. ${kidName} now has ${newTotalPoints} points`);
    
    toast({
      title: "Points updated!",
      description: `${kidName} now has ${newTotalPoints} points!`,
    });
    
    return newTotalPoints;
  } catch (error) {
    console.error('Error updating points:', error);
    toast({
      variant: "destructive",
      title: "Error updating points",
      description: "There was a problem updating the points. Please try again.",
    });
    return null;
  }
};
