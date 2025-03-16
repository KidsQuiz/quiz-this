
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Milestone } from './types';
import { useRef } from 'react';

export const useMilestonesManagement = (setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper function to create a new AbortController and set up timeout
  const setupRequest = () => {
    // Abort any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    // Set up a timeout to abort the request if it takes too long
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, 15000); // 15-second timeout
    
    return { controller: abortControllerRef.current, timeoutId };
  };

  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    const { controller, timeoutId } = setupRequest();
    
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
        .abortSignal(controller.signal)
        .single();
        
      clearTimeout(timeoutId);
        
      if (error) throw error;
      
      // Cast the result to Milestone type
      setMilestones(prev => [...prev, data as unknown as Milestone]);
      
      toast({
        title: "Success",
        description: "Milestone added successfully"
      });
      
      return data as unknown as Milestone;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Add milestone request timed out or was aborted');
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Request timed out. Please try again."
        });
      } else {
        console.error('Error adding milestone:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add milestone"
        });
      }
      return null;
    } finally {
      abortControllerRef.current = null;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Omit<Milestone, 'id' | 'created_at' | 'updated_at'>>) => {
    const { controller, timeoutId } = setupRequest();
    
    try {
      // Type assertion for the from() method
      const { data, error } = await supabase
        .from('milestones' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .abortSignal(controller.signal)
        .single();
        
      clearTimeout(timeoutId);
        
      if (error) throw error;
      
      // Cast the result and update state with type assertion
      setMilestones(prev => prev.map(m => m.id === id ? (data as unknown as Milestone) : m));
      
      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
      
      return data as unknown as Milestone;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Update milestone request timed out or was aborted');
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Request timed out. Please try again."
        });
      } else {
        console.error('Error updating milestone:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update milestone"
        });
      }
      return null;
    } finally {
      abortControllerRef.current = null;
    }
  };

  const deleteMilestone = async (id: string) => {
    const { controller, timeoutId } = setupRequest();
    
    try {
      // Type assertion for the from() method
      const { error } = await supabase
        .from('milestones' as any)
        .delete()
        .eq('id', id)
        .abortSignal(controller.signal);
        
      clearTimeout(timeoutId);
        
      if (error) throw error;
      
      setMilestones(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Delete milestone request timed out or was aborted');
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Request timed out. Please try again."
        });
      } else {
        console.error('Error deleting milestone:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete milestone"
        });
      }
      return false;
    } finally {
      abortControllerRef.current = null;
    }
  };

  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    addMilestone,
    updateMilestone,
    deleteMilestone,
    cleanup
  };
};
