
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/hooks/questionsTypes';

export const useQuestionsDataFetching = () => {
  const fetchQuestionsData = useCallback(async (
    selectedPackageIds: string[],
    abortSignal?: AbortSignal
  ): Promise<Question[]> => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .in('package_id', selectedPackageIds)
        .abortSignal(abortSignal);
        
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching questions data:', error.message);
      return [];
    }
  }, []);

  return { fetchQuestionsData };
};
