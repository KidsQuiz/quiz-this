
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
        
        // Update existing answers or insert new ones instead of delete and recreate
        for (const answer of filledAnswers) {
          if (answer.id.startsWith('temp-')) {
            // This is a new answer, insert it
            const { error: insertError } = await supabase
              .from('answer_options')
              .insert({
                question_id: questionId,
                content: answer.content,
                is_correct: answer.isCorrect
              });
              
            if (insertError) throw insertError;
          } else {
            // This is an existing answer, update it
            const { error: updateError } = await supabase
              .from('answer_options')
              .update({
                content: answer.content,
                is_correct: answer.isCorrect
              })
              .eq('id', answer.id);
              
            if (updateError) throw updateError;
          }
        }
        
        // Find answers that were removed (not in filledAnswers)
        // Get existing answer IDs for this question
        const { data: existingAnswers, error: fetchError } = await supabase
          .from('answer_options')
          .select('id')
          .eq('question_id', questionId);
          
        if (fetchError) throw fetchError;
        
        // Find IDs that are in existingAnswers but not in filledAnswers
        const existingIds = existingAnswers.map(a => a.id);
        const currentIds = filledAnswers
          .filter(a => !a.id.startsWith('temp-'))
          .map(a => a.id);
        
        const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
        
        // Check if any answer options are referenced in kid_wrong_answers
        if (idsToDelete.length > 0) {
          const { data: referencedAnswers, error: checkError } = await supabase
            .from('kid_wrong_answers')
            .select('answer_id')
            .in('answer_id', idsToDelete);
            
          if (checkError) throw checkError;
          
          // Only delete answers that are not referenced
          const safeToDeleteIds = idsToDelete.filter(
            id => !referencedAnswers?.some(ref => ref.answer_id === id)
          );
          
          if (safeToDeleteIds.length > 0) {
            const { error: deleteError } = await supabase
              .from('answer_options')
              .delete()
              .in('id', safeToDeleteIds);
              
            if (deleteError) throw deleteError;
          }
        }
        
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
