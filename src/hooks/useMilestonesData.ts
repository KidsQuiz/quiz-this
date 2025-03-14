import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Milestone } from './packages/types';

export const useMilestonesData = (kidId?: string) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const hasAttemptedFetch = useRef(false);

  const fetchMilestones = async () => {
    if (!user || isFetchingRef.current) return;
    
    // Mark that we've attempted a fetch for this session
    hasAttemptedFetch.current = true;
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      
      // Type assertion for the from() method since milestones isn't in the types
      const query = supabase
        .from('milestones' as any)
        .select('*')
        .order('points_required', { ascending: true });
      
      if (kidId) {
        query.eq('kid_id', kidId);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      // Cast the result to Milestone[] type
      setMilestones(data as unknown as Milestone[]);
    } catch (error: any) {
      console.error('Error fetching milestones:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load milestones"
      });
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
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

  const getCurrentMilestone = (points: number) => {
    const achieved = milestones.filter(m => m.points_required <= points);
    return achieved.length > 0 ? achieved[achieved.length - 1] : null;
  };

  const getNextMilestone = (points: number) => {
    const next = milestones.find(m => m.points_required > points);
    return next || null;
  };

  // Calculate progress towards next milestone (as percentage)
  const getMilestoneProgress = (points: number) => {
    const current = getCurrentMilestone(points);
    const next = getNextMilestone(points);
    
    if (!next) return 100; // Already reached highest milestone
    
    const currentPoints = current ? current.points_required : 0;
    const nextPoints = next.points_required;
    
    const range = nextPoints - currentPoints;
    const progress = points - currentPoints;
    
    return Math.min(Math.floor((progress / range) * 100), 100);
  };

  useEffect(() => {
    if (user && kidId && !hasAttemptedFetch.current) {
      fetchMilestones();
    }
    
    // Clean up function will run when the component unmounts or when dependencies change
    return () => {
      hasAttemptedFetch.current = false;
    };
  }, [user, kidId]);

  return {
    milestones,
    isLoading,
    fetchMilestones,
    addMilestone,
    updateMilestone: async (id, updates) => null,
    deleteMilestone: async (id) => false,
    getCurrentMilestone,
    getNextMilestone,
    getMilestoneProgress
  };
};
