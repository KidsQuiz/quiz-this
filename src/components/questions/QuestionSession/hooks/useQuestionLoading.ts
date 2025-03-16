
import { useState } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useQuestionCache } from './useQuestionCache';
import { usePrefetchOptions } from './usePrefetchOptions';
import { useQuestionFetching } from './useQuestionFetching';
import { useAnswerOptionLoading } from './useAnswerOptionLoading';

export const useQuestionLoading = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  
  // Use our new hooks
  const { 
    getCachedQuestions, 
    setCachedQuestions, 
    getCachedAnswerOptions, 
    setCachedAnswerOptions 
  } = useQuestionCache();
  
  const { prefetchNextAnswerOptions } = usePrefetchOptions(setCachedAnswerOptions);
  
  const { 
    isLoading, 
    questions,

    loadQuestions 
  } = useQuestionFetching(
    getCachedQuestions,
    setCachedQuestions,
    prefetchNextAnswerOptions
  );
  
  const { 
    answerOptions, 
    loadAnswerOptions 
  } = useAnswerOptionLoading(
    getCachedAnswerOptions,
    setCachedAnswerOptions,
    prefetchNextAnswerOptions,
    questions
  );

  return {
    isLoading,
    questions,
    currentQuestion,
    setCurrentQuestion,
    answerOptions,
    loadQuestions,
    loadAnswerOptions
  };
};
