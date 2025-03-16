
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

export const usePrefetchOptions = (
  setCachedAnswerOptions: (questionId: string, options: AnswerOption[]) => void
) => {
  const prefetchNextAnswerOptions = useCallback(async (questions: Question[], currentIndex: number) => {
    const prefetchCount = 2; // Number of questions to prefetch ahead
    const questionsToFetch = [];
    
    for (let i = currentIndex + 1; i < currentIndex + 1 + prefetchCount && i < questions.length; i++) {
      const questionId = questions[i]?.id;
      if (questionId) {
        questionsToFetch.push(questionId);
      }
    }
    
    if (questionsToFetch.length === 0) return;
    
    try {
      console.log(`Prefetching answer options for ${questionsToFetch.length} upcoming questions`);
      
      // Use a single batch query to fetch all needed answer options
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .in('question_id', questionsToFetch);
        
      if (error) throw error;
      
      // Organize results by question_id and update cache
      if (data && data.length > 0) {
        const groupedByQuestion: Record<string, AnswerOption[]> = {};
        
        data.forEach(option => {
          if (!groupedByQuestion[option.question_id]) {
            groupedByQuestion[option.question_id] = [];
          }
          groupedByQuestion[option.question_id].push(option);
        });
        
        // Add to cache
        Object.entries(groupedByQuestion).forEach(([questionId, options]) => {
          // Shuffle the options for each question
          const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
          setCachedAnswerOptions(questionId, shuffledOptions);
        });
        
        console.log(`Successfully prefetched and cached answer options for ${Object.keys(groupedByQuestion).length} questions`);
      }
    } catch (error: any) {
      console.error('Error prefetching answer options:', error.message);
    }
  }, [setCachedAnswerOptions]);

  return { prefetchNextAnswerOptions };
};
