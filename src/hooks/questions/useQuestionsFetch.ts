
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Question, AnswerOption } from '../questionsTypes';

export const useQuestionsFetch = (packageId?: string) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async (userId?: string) => {
    if (!userId) return [];
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('questions')
        .select('*');
      
      if (packageId) {
        query = query.eq('package_id', packageId);
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnswerOptions = async (questionId: string): Promise<AnswerOption[]> => {
    try {
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId)
        .order('id');
        
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching answer options:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load answer options"
      });
      return [];
    }
  };

  return {
    isLoading,
    fetchQuestions,
    fetchAnswerOptions
  };
};
