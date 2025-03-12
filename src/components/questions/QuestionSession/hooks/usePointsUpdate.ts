
import { supabase } from '@/integrations/supabase/client';

export const updateKidPoints = async (
  kidId: string, 
  kidName: string, 
  earnedPoints: number,
  toast: any
) => {
  if (earnedPoints <= 0) return;
  
  try {
    const { data: kidData, error: kidError } = await supabase
      .from('kids')
      .select('points')
      .eq('id', kidId)
      .single();
      
    if (kidError) throw kidError;
    
    const currentPoints = kidData?.points || 0;
    const newTotalPoints = currentPoints + earnedPoints;
    
    const { error: updateError } = await supabase
      .from('kids')
      .update({ points: newTotalPoints })
      .eq('id', kidId);
      
    if (updateError) throw updateError;
    
    toast({
      title: "Points updated!",
      description: `${kidName} now has ${newTotalPoints} points!`,
    });
    
    return newTotalPoints;
  } catch (error) {
    console.error('Error updating points:', error);
    return null;
  }
};
