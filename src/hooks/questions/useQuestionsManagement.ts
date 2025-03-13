import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Question } from '../questionsTypes';

export const useQuestionsManagement = () => {
  const deleteQuestion = async (id: string, showConfirm = true) => {
    if (showConfirm && !confirm('Are you sure you want to delete this question?')) return false;
    
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      if (showConfirm) {
        toast({
          title: "Success",
          description: "Question deleted successfully"
        });
      }
      
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

  const cloneQuestion = async (questionId: string) => {
    try {
      const { data: originalQuestion, error: questionError } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
        
      if (questionError) throw questionError;
      
      const { data: answerOptions, error: answerError } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId);
        
      if (answerError) throw answerError;
      
      const { data: newQuestion, error: createError } = await supabase
        .from('questions')
        .insert({
          content: `${originalQuestion.content} (copy)`,
          time_limit: originalQuestion.time_limit,
          points: originalQuestion.points,
          package_id: originalQuestion.package_id
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      if (answerOptions && answerOptions.length > 0) {
        const newAnswerOptions = answerOptions.map(option => ({
          question_id: newQuestion.id,
          content: option.content,
          is_correct: option.is_correct
        }));
        
        const { error: createAnswersError } = await supabase
          .from('answer_options')
          .insert(newAnswerOptions);
          
        if (createAnswersError) throw createAnswersError;
      }
      
      toast({
        title: "Success",
        description: "Question cloned successfully"
      });
      
      return newQuestion;
    } catch (error: any) {
      console.error('Error cloning question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone question"
      });
      return null;
    }
  };

  return {
    deleteQuestion,
    deleteAllQuestions,
    cloneQuestion
  };
};
