
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Package } from './types';

export const usePackagesFetch = () => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async (userId?: string) => {
    if (!userId) return [];
    
    try {
      setIsLoading(true);
      
      // First, get all packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false });
        
      if (packagesError) throw packagesError;
      
      if (!packagesData || packagesData.length === 0) {
        return [];
      }
      
      // Then, get question counts for each package individually
      const packagesWithCounts = await Promise.all(
        packagesData.map(async (pkg) => {
          // Cast presentation_order to the correct type
          const typedPresentationOrder = (pkg.presentation_order || 'shuffle') as 'sequential' | 'shuffle';
          
          // Count questions for this package
          const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('package_id', pkg.id);
          
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
        })
      );
      
      return packagesWithCounts;
    } catch (error: any) {
      console.error('Error fetching packages:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load packages"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchPackages
  };
};
