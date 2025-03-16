
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';

export const useAnswerOptionLoading = (
  getCachedAnswerOptions: (questionId: string) => AnswerOption[] | null,
  setCachedAnswerOptions: (questionId: string, options: AnswerOption[]) => void,
  prefetchNextAnswerOptions: (questions: Question[], currentIndex: number) => Promise<void>,
  questions: Question[]
) => {
  const { toast } = useToast();
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  
  // Add refs to track loading states and prevent duplicate requests
  const loadingAnswersRef = useRef(false);
  const loadingAnswersForQuestionId = useRef<string | null>(null);
  
  // Load answer options for the current question - more efficient implementation
  const loadAnswerOptions = useCallback(async (questionId: string) => {
    // Prevent duplicate/concurrent requests for the same question
    if (loadingAnswersRef.current && loadingAnswersForQuestionId.current === questionId) {
      console.log(`Already loading answer options for question ${questionId}, skipping duplicate request`);
      return;
    }
    
    // Check if we have answers for this question cached
    const cachedOptions = getCachedAnswerOptions(questionId);
    if (cachedOptions) {
      console.log(`Using cached answer options for question ${questionId}`);
      setAnswerOptions(cachedOptions);
      
      // Find current question index to prefetch next questions
      const currentIndex = questions.findIndex(q => q.id === questionId);
      if (currentIndex !== -1) {
        prefetchNextAnswerOptions(questions, currentIndex);
      }
      return;
    }
    
    try {
      loadingAnswersRef.current = true;
      loadingAnswersForQuestionId.current = questionId;
      
      console.log(`Loading answer options for question ID: ${questionId}`);
      
      // Improved query with indexing optimization
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.warn(`No answer options found for question ${questionId}`);
        setAnswerOptions([]);
      } else {
        console.log(`Loaded ${data.length} answer options for question ${questionId}`);
        
        // Randomize the order of answers
        const shuffledAnswers = [...data].sort(() => Math.random() - 0.5);
        
        // Cache the results
        setCachedAnswerOptions(questionId, shuffledAnswers);
        
        setAnswerOptions(shuffledAnswers);
        
        // Find current question index to prefetch next questions
        const currentIndex = questions.findIndex(q => q.id === questionId);
        if (currentIndex !== -1) {
          prefetchNextAnswerOptions(questions, currentIndex);
        }
      }
      
    } catch (error: any) {
      console.error('Error loading answer options:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load answer options"
      });
    } finally {
      loadingAnswersRef.current = false;
      if (loadingAnswersForQuestionId.current === questionId) {
        loadingAnswersForQuestionId.current = null;
      }
    }
  }, [toast, questions, prefetchNextAnswerOptions, getCachedAnswerOptions, setCachedAnswerOptions]);

  return {
    answerOptions,
    loadAnswerOptions
  };
};
