
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Question {
  id: string;
  content: string;
  time_limit: number;
  points: number;
  package_id: string;
  created_at: string;
  updated_at: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  content: string;
  is_correct: boolean;
}

export const useQuestionsData = (packageId?: string) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    if (!user) return;
    
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
      
      setQuestions(data || []);
    } catch (error: any) {
      console.error('Error fetching questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user, packageId]);

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

  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setQuestions(questions.filter(question => question.id !== id));
      
      toast({
        title: "Success",
        description: "Question deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete question"
      });
    }
  };

  return {
    questions,
    isLoading,
    fetchQuestions,
    fetchAnswerOptions,
    deleteQuestion
  };
};
