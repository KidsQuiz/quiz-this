
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePackagesManagement = () => {
  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package? All questions within this package will also be deleted.')) return false;
    
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Package deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting package:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete package"
      });
      return false;
    }
  };

  const clonePackage = async (id: string) => {
    try {
      // 1. Get the original package data
      const { data: originalPackage, error: packageError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
        
      if (packageError) throw packageError;
      
      // 2. Create a new package with the same data (plus "copy" in the name)
      const { data: newPackage, error: createError } = await supabase
        .from('packages')
        .insert({
          name: `${originalPackage.name} (copy)`,
          description: originalPackage.description,
          parent_id: originalPackage.parent_id,
          presentation_order: originalPackage.presentation_order
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      // 3. Get all questions from the original package
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('package_id', id);
        
      if (questionsError) throw questionsError;
      
      // 4. If there are questions, clone them for the new package
      if (questions && questions.length > 0) {
        // First, create all the new questions
        const newQuestions = [];
        
        for (const question of questions) {
          const { data: newQuestion, error: createQuestionError } = await supabase
            .from('questions')
            .insert({
              content: question.content,
              time_limit: question.time_limit,
              points: question.points,
              package_id: newPackage.id
            })
            .select()
            .single();
            
          if (createQuestionError) throw createQuestionError;
          
          newQuestions.push(newQuestion);
          
          // Get answer options for this question
          const { data: answerOptions, error: answerError } = await supabase
            .from('answer_options')
            .select('*')
            .eq('question_id', question.id);
            
          if (answerError) throw answerError;
          
          // Create new answer options for the cloned question
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
        }
      }
      
      toast({
        title: "Success",
        description: "Package cloned successfully with all questions"
      });
      
      return newPackage;
    } catch (error: any) {
      console.error('Error cloning package:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clone package"
      });
      return null;
    }
  };

  return {
    deletePackage,
    clonePackage
  };
};
