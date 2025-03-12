
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AnswerFormOption } from '@/components/questions/AnswerOptionsList';

export const useSubmitQuestion = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const saveQuestion = async (
    params: {
      userId: string | undefined;
      questionId: string | undefined;
      packageId: string;
      content: string;
      timeLimit: string;
      points: string;
      answers: AnswerFormOption[];
      isEditMode: boolean;
      onSuccess: () => void;
      onClose: () => void;
    }
  ) => {
    const { 
      userId, 
      questionId, 
      packageId, 
      content, 
      timeLimit, 
      points, 
      answers, 
      isEditMode,
      onSuccess,
      onClose
    } = params;
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save questions."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filter out empty answers
      const filledAnswers = answers.filter(answer => answer.content.trim() !== '');
      
      if (isEditMode) {
        // Update the question
        const { data: updatedQuestion, error: questionError } = await supabase
          .from('questions')
          .update({
            content,
            time_limit: parseInt(timeLimit),
            points: parseInt(points),
            updated_at: new Date().toISOString()
          })
          .eq('id', questionId)
          .select()
          .single();
          
        if (questionError) throw questionError;
        
        // Handle answer options - first delete existing ones
        const { error: deleteError } = await supabase
          .from('answer_options')
          .delete()
          .eq('question_id', questionId);
          
        if (deleteError) throw deleteError;
        
        // Then insert new ones
        const { error: answersError } = await supabase
          .from('answer_options')
          .insert(filledAnswers.map(answer => ({
            question_id: questionId,
            content: answer.content,
            is_correct: answer.isCorrect
          })));
          
        if (answersError) throw answersError;
        
        toast({
          title: "Success",
          description: "Question updated successfully"
        });
      } else {
        // Create new question
        const { data: newQuestion, error: questionError } = await supabase
          .from('questions')
          .insert({
            package_id: packageId,
            content,
            time_limit: parseInt(timeLimit),
            points: parseInt(points)
          })
          .select()
          .single();
          
        if (questionError) throw questionError;
        
        // Create answer options
        const { error: answersError } = await supabase
          .from('answer_options')
          .insert(filledAnswers.map(answer => ({
            question_id: newQuestion.id,
            content: answer.content,
            is_correct: answer.isCorrect
          })));
          
        if (answersError) throw answersError;
        
        toast({
          title: "Success",
          description: "Question created successfully"
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save question information."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    saveQuestion
  };
};
