
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AnswerFormOption } from '@/components/questions/AnswerOptionsList';

export const useQuestionForm = (
  questionId: string | undefined,
  packageId: string,
  onSave: () => void,
  onClose: () => void
) => {
  const [content, setContent] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [points, setPoints] = useState('10');
  const [answers, setAnswers] = useState<AnswerFormOption[]>([
    { id: 'temp-1', content: '', isCorrect: false },
    { id: 'temp-2', content: '', isCorrect: false },
    { id: 'temp-3', content: '', isCorrect: false },
    { id: 'temp-4', content: '', isCorrect: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!questionId;
  
  useEffect(() => {
    const loadQuestionData = async () => {
      if (!questionId) return;
      
      try {
        setIsLoading(true);
        // Fetch question data
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', questionId)
          .single();
          
        if (questionError) throw questionError;
        
        if (questionData) {
          setContent(questionData.content);
          setTimeLimit(questionData.time_limit.toString());
          setPoints(questionData.points.toString());
          
          // Fetch answer options
          const { data: answerOptions, error: answersError } = await supabase
            .from('answer_options')
            .select('*')
            .eq('question_id', questionId)
            .order('id');
            
          if (answersError) throw answersError;
          
          if (answerOptions && answerOptions.length > 0) {
            const formattedAnswers = answerOptions.map(option => ({
              id: option.id,
              content: option.content,
              isCorrect: option.is_correct
            }));
            
            // If less than 4 answers, fill the rest with empty answers
            while (formattedAnswers.length < 4) {
              formattedAnswers.push({ 
                id: `temp-${formattedAnswers.length + 1}`, 
                content: '', 
                isCorrect: false 
              });
            }
            
            setAnswers(formattedAnswers);
          }
        }
      } catch (error: any) {
        console.error('Error fetching question:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load question information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestionData();
    
    // Reset form when closing and reopening
    return () => {
      if (!isEditMode) {
        setContent('');
        setTimeLimit('30');
        setPoints('10');
        setAnswers([
          { id: 'temp-1', content: '', isCorrect: false },
          { id: 'temp-2', content: '', isCorrect: false },
          { id: 'temp-3', content: '', isCorrect: false },
          { id: 'temp-4', content: '', isCorrect: false }
        ]);
      }
    };
  }, [questionId, isEditMode]);
  
  const handleAnswerChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value
    };
    setAnswers(updatedAnswers);
  };
  
  const validateForm = () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide the question content."
      });
      return false;
    }
    
    // Check if at least one answer is marked as correct
    if (!answers.some(answer => answer.isCorrect)) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please mark at least one answer as correct."
      });
      return false;
    }
    
    // Check if all answers have content
    const filledAnswers = answers.filter(answer => answer.content.trim() !== '');
    if (filledAnswers.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please provide at least two answer options."
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent, userId: string | undefined) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save questions."
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
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
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving question:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save question information."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    content,
    setContent,
    timeLimit,
    setTimeLimit,
    points,
    setPoints,
    answers,
    isLoading,
    isEditMode,
    handleAnswerChange,
    handleSubmit
  };
};
