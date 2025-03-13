
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Question } from '../questionsTypes';

export const useQuestionsManagement = () => {
  const deleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return false;
    
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Question deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete question"
      });
      return false;
    }
  };

  const deleteAllQuestions = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete ALL questions in this package? This action cannot be undone.')) return false;
    
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('package_id', packageId);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All questions deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting all questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete questions"
      });
      return false;
    }
  };

  return {
    deleteQuestion,
    deleteAllQuestions
  };
};
