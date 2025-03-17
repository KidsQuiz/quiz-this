import { useEffect, useRef } from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

export const useQuestionCache = () => {
  // Caches for questions and answers
  const questionsCacheRef = useRef<Record<string, Question[]>>({});
  const answersCacheRef = useRef<Record<string, AnswerOption[]>>({});
  
  // Clear cache if it gets too large
  const cleanCache = () => {
    const maxCacheSize = 50; // Maximum number of question sets to keep in cache
    const questionKeys = Object.keys(questionsCacheRef.current);
    
    if (questionKeys.length > maxCacheSize) {
      console.log(`Cleaning questions cache (${questionKeys.length} entries)`);
      // Keep only the most recent entries
      const keysToRemove = questionKeys.slice(0, questionKeys.length - maxCacheSize);
      keysToRemove.forEach(key => {
        delete questionsCacheRef.current[key];
      });
    }
    
    const answerKeys = Object.keys(answersCacheRef.current);
    if (answerKeys.length > maxCacheSize * 10) { // Assuming ~10 questions per package
      console.log(`Cleaning answers cache (${answerKeys.length} entries)`);
      // Keep only the most recent entries
      const keysToRemove = answerKeys.slice(0, answerKeys.length - (maxCacheSize * 10));
      keysToRemove.forEach(key => {
        delete answersCacheRef.current[key];
      });
    }
  };
  
  // Initialize cache from session storage if available
  useEffect(() => {
    try {
      const cachedQuestions = sessionStorage.getItem('questionsCache');
      const cachedAnswers = sessionStorage.getItem('answersCache');
      
      if (cachedQuestions) {
        questionsCacheRef.current = JSON.parse(cachedQuestions);
        console.log('Loaded questions cache from session storage with keys:', Object.keys(questionsCacheRef.current));
      }
      
      if (cachedAnswers) {
        answersCacheRef.current = JSON.parse(cachedAnswers);
        console.log('Loaded answers cache from session storage');
      }
      
      // Clean the cache after loading
      cleanCache();
    } catch (error) {
      console.warn('Error loading cache from session storage:', error);
      // Continue without cached data
      questionsCacheRef.current = {};
      answersCacheRef.current = {};
    }
    
    // Update session storage when component unmounts
    return () => {
      try {
        if (Object.keys(questionsCacheRef.current).length > 0) {
          sessionStorage.setItem('questionsCache', JSON.stringify(questionsCacheRef.current));
          console.log('Saved questions cache to session storage');
        }
        
        if (Object.keys(answersCacheRef.current).length > 0) {
          sessionStorage.setItem('answersCache', JSON.stringify(answersCacheRef.current));
          console.log('Saved answers cache to session storage');
        }
      } catch (error) {
        console.warn('Error saving cache to session storage:', error);
      }
    };
  }, []);

  // Functions to get, set and check cache
  const getCachedQuestions = (cacheKey: string): Question[] | null => {
    const cached = questionsCacheRef.current[cacheKey];
    if (cached) {
      console.log(`Cache hit for questions with key: ${cacheKey}`);
      return cached;
    }
    console.log(`Cache miss for questions with key: ${cacheKey}`);
    return null;
  };

  const setCachedQuestions = (cacheKey: string, questions: Question[]) => {
    console.log(`Caching ${questions.length} questions with key: ${cacheKey}`);
    questionsCacheRef.current[cacheKey] = questions;
    cleanCache(); // Clean cache after adding new entries
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
