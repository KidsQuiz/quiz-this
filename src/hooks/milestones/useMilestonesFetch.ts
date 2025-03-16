
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchMilestones = async () => {
    if (isFetchingRef.current) return [];
    
    // Mark that we've attempted a fetch for this session
    hasAttemptedFetch.current = true;
    
    // Clear any existing timeout
    if (fetchTimeoutId.current) {
      clearTimeout(fetchTimeoutId.current);
      fetchTimeoutId.current = null;
    }

    // Abort any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      
      // Set up a timeout to abort the request if it takes too long
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 15000); // 15-second timeout
      
      // Type assertion for the from() method since milestones isn't in the types
      const query = supabase
        .from('milestones' as any)
        .select('*')
        .order('points_required', { ascending: true })
        .abortSignal(abortControllerRef.current.signal);
      
      if (kidId) {
        query.eq('kid_id', kidId);
      }
        
      const { data, error } = await query;
        
      clearTimeout(timeoutId);
      
      if (error) throw error;
      
      // Cast the result to Milestone[] type
      setMilestones(data as unknown as Milestone[]);
      return data as unknown as Milestone[];
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Milestone fetch request timed out or was aborted');
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Request timed out. Please try again later."
        });
      } else {
        console.error('Error fetching milestones:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load milestones"
        });
      }
      return [];
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      
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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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
