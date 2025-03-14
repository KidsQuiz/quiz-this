
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Milestone } from './types';

export const useMilestonesManagement = (setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>) => {
  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Type assertion for the from() method
      const { data, error } = await supabase
        .from('milestones' as any)
        .insert({
          name: milestone.name,
          image_url: milestone.image_url,
          points_required: milestone.points_required,
          kid_id: milestone.kid_id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Cast the result to Milestone type
      setMilestones(prev => [...prev, data as unknown as Milestone]);
      
      toast({
        title: "Success",
        description: "Milestone added successfully"
      });
      
      return data as unknown as Milestone;
    } catch (error: any) {
      console.error('Error adding milestone:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add milestone"
      });
      return null;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Omit<Milestone, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      // Type assertion for the from() method
      const { data, error } = await supabase
        .from('milestones' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Cast the result and update state with type assertion
      setMilestones(prev => prev.map(m => m.id === id ? (data as unknown as Milestone) : m));
      
      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
      
      return data as unknown as Milestone;
    } catch (error: any) {
      console.error('Error updating milestone:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update milestone"
      });
      return null;
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      // Type assertion for the from() method
      const { error } = await supabase
        .from('milestones' as any)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMilestones(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting milestone:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete milestone"
      });
      return false;
    }
  };

  return {
    addMilestone,
    updateMilestone,
    deleteMilestone,
  };
};
