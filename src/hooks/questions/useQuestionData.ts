
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AnswerFormOption } from '@/components/questions/AnswerOptionsList';

export const useQuestionData = (questionId: string | undefined) => {
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
  
  return {
    content,
    setContent,
    timeLimit,
    setTimeLimit,
    points,
    setPoints,
    answers,
    setAnswers,
    isLoading,
    setIsLoading,
    isEditMode
  };
};
