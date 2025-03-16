
import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

export const useQuestionCache = () => {
  // Caches for questions and answers
  const questionsCacheRef = useRef<Record<string, Question[]>>({});
  const answersCacheRef = useRef<Record<string, AnswerOption[]>>({});
  
  // Initialize cache from session storage if available
  useEffect(() => {
    try {
      const cachedQuestions = sessionStorage.getItem('questionsCache');
      const cachedAnswers = sessionStorage.getItem('answersCache');
      
      if (cachedQuestions) {
        questionsCacheRef.current = JSON.parse(cachedQuestions);
        console.log('Loaded questions cache from session storage');
      }
      
      if (cachedAnswers) {
        answersCacheRef.current = JSON.parse(cachedAnswers);
        console.log('Loaded answers cache from session storage');
      }
    } catch (error) {
      console.warn('Error loading cache from session storage:', error);
      // Continue without cached data
    }
    
    // Update session storage when component unmounts
    return () => {
      try {
        if (Object.keys(questionsCacheRef.current).length > 0) {
          sessionStorage.setItem('questionsCache', JSON.stringify(questionsCacheRef.current));
        }
        
        if (Object.keys(answersCacheRef.current).length > 0) {
          sessionStorage.setItem('answersCache', JSON.stringify(answersCacheRef.current));
        }
      } catch (error) {
        console.warn('Error saving cache to session storage:', error);
      }
    };
  }, []);

  // Functions to get, set and check cache
  const getCachedQuestions = (cacheKey: string): Question[] | null => {
    return questionsCacheRef.current[cacheKey] || null;
  };

  const setCachedQuestions = (cacheKey: string, questions: Question[]) => {
    questionsCacheRef.current[cacheKey] = questions;
  };

  const getCachedAnswerOptions = (questionId: string): AnswerOption[] | null => {
    return answersCacheRef.current[questionId] || null;
  };

  const setCachedAnswerOptions = (questionId: string, options: AnswerOption[]) => {
    answersCacheRef.current[questionId] = options;
  };

  return {
    getCachedQuestions,
    setCachedQuestions,
    getCachedAnswerOptions,
    setCachedAnswerOptions
  };
};
