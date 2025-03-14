
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Milestone } from './types';

export const useMilestonesFetch = (kidId?: string) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false);
  const hasAttemptedFetch = useRef(false);
  const fetchTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const fetchMilestones = async () => {
    if (isFetchingRef.current) return [];
    
    // Mark that we've attempted a fetch for this session
    hasAttemptedFetch.current = true;
    
    // Clear any existing timeout
    if (fetchTimeoutId.current) {
      clearTimeout(fetchTimeoutId.current);
      fetchTimeoutId.current = null;
    }
    
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
      return data as unknown as Milestone[];
    } catch (error: any) {
      console.error('Error fetching milestones:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load milestones"
      });
      return [];
    } finally {
      setIsLoading(false);
      // Use a timeout to reset the fetch in progress flag after a delay
      // This prevents immediate subsequent fetch attempts
      fetchTimeoutId.current = setTimeout(() => {
        isFetchingRef.current = false;
      }, 500);
    }
  };

  // Initial fetch effect
  useEffect(() => {
    if (kidId && !hasAttemptedFetch.current) {
      fetchMilestones();
    }
    
    // Clean up function will run when the component unmounts or when dependencies change
    return () => {
      if (fetchTimeoutId.current) {
        clearTimeout(fetchTimeoutId.current);
      }
    };
  }, [kidId]);

  return {
    milestones,
    isLoading,
    fetchMilestones,
    setMilestones,
  };
};
