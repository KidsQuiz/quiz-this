
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Package } from './types';

export const usePackagesFetch = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Add a ref to track if there's a fetch in progress
  const fetchInProgress = useRef(false);
  const fetchTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPackages = async (userId?: string) => {
    if (!userId) return [];
    
    // Prevent concurrent fetches for the same user
    if (fetchInProgress.current) return [];
    
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
      fetchInProgress.current = true;
      setIsLoading(true);
      
      // Set up a timeout to abort the request if it takes too long
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 15000); // 15-second timeout
      
      // First, get all packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false })
        .abortSignal(abortControllerRef.current.signal);
        
      clearTimeout(timeoutId);
        
      if (packagesError) throw packagesError;
      
      if (!packagesData || packagesData.length === 0) {
        return [];
      }
      
      // Create a new abort controller for batch question counts
      abortControllerRef.current = new AbortController();
      
      // Then, get question counts for each package individually
      const packagesWithCounts = await Promise.all(
        packagesData.map(async (pkg) => {
          // Cast presentation_order to the correct type
          const typedPresentationOrder = (pkg.presentation_order || 'shuffle') as 'sequential' | 'shuffle';
          
          try {
            // Count questions for this package
            const { count, error: countError } = await supabase
              .from('questions')
              .select('*', { count: 'exact', head: true })
              .eq('package_id', pkg.id)
              .abortSignal(abortControllerRef.current?.signal || undefined);
            
            if (countError) {
              console.error('Error counting questions:', countError.message);
              return { 
                ...pkg, 
                question_count: 0,
                presentation_order: typedPresentationOrder
              } as Package;
            }
            
            return { 
              ...pkg, 
              question_count: count || 0,
              presentation_order: typedPresentationOrder
            } as Package;
          } catch (error) {
            console.error(`Error counting questions for package ${pkg.id}:`, error);
            return { 
              ...pkg, 
              question_count: 0,
              presentation_order: typedPresentationOrder
            } as Package;
          }
        })
      );
      
      return packagesWithCounts;
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Package fetch request timed out or was aborted');
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Request timed out. Please try again later."
        });
      } else {
        console.error('Error fetching packages:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load packages"
        });
      }
      return [];
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      
      // Use a timeout to reset the fetch in progress flag after a small delay
      // This prevents immediate subsequent fetch attempts
      fetchTimeoutId.current = setTimeout(() => {
        fetchInProgress.current = false;
      }, 500);
    }
  };

  return {
    isLoading,
    fetchPackages
  };
};
