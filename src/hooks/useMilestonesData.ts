
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Milestone } from './packages/types';

export const useMilestonesData = (kidId?: string) => {
  const { user } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  const fetchMilestones = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('milestones')
        .select('*')
        .order('points_required', { ascending: true });
      
      if (kidId) {
        query = query.eq('kid_id', kidId);
      }
        
      const { data, error } = await query;
        
      if (error) throw error;
      
      setMilestones(data || []);
    } catch (error: any) {
      console.error('Error fetching milestones:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load milestones"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert({
          name: milestone.name,
          image_url: milestone.image_url,
          points_required: milestone.points_required,
          kid_id: milestone.kid_id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setMilestones(prev => [...prev, data]);
      
      toast({
        title: "Success",
        description: "Milestone added successfully"
      });
      
      return data;
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
      const { data, error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      setMilestones(prev => prev.map(m => m.id === id ? data : m));
      
      toast({
        title: "Success",
        description: "Milestone updated successfully"
      });
      
      return data;
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
      const { error } = await supabase
        .from('milestones')
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
    fetchMilestones();
  }, [user, kidId]);

  return {
    milestones,
    isLoading,
    fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    getCurrentMilestone,
    getNextMilestone,
    getMilestoneProgress
  };
};
