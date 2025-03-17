
import { useState, useCallback } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useRequestController } from './useRequestController';
import { usePackageOrderFetching } from './usePackageOrderFetching';
import { useQuestionsDataFetching } from './useQuestionsDataFetching';
import { useQuestionsProcessing } from './useQuestionsProcessing';

export const useQuestionFetching = (
  getCachedQuestions: (cacheKey: string) => Question[] | null,
  setCachedQuestions: (cacheKey: string, questions: Question[]) => void,
  prefetchNextAnswerOptions: (questions: Question[], currentIndex: number) => Promise<void>
) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Use our new hooks
  const { loadingRef, abortControllerRef, createAbortController, cleanup } = useRequestController();
  const { fetchPackageOrders } = usePackageOrderFetching();
  const { fetchQuestionsData } = useQuestionsDataFetching();
  const { processQuestions } = useQuestionsProcessing();
  
  // Load questions when packages are selected
  const loadQuestions = useCallback(async (selectedPackageIds: string[]) => {
    console.log("loadQuestions called with packages:", selectedPackageIds);
    
    if (!selectedPackageIds.length) {
      console.warn("No package IDs provided to loadQuestions");
      setQuestions([]);
      setIsLoading(false);
      return;
    }
    
    // Prevent multiple concurrent loading operations
    if (loadingRef.current) {
      console.log('Already loading questions, skipping duplicate request');
      return;
    }
    
    // Create a consistent cache key regardless of package ID order
    const cacheKey = selectedPackageIds.slice().sort().join('_');
    console.log('Using cache key:', cacheKey);
    
    const cachedQuestions = getCachedQuestions(cacheKey);
    
    if (cachedQuestions) {
      console.log('Using cached questions for packages:', selectedPackageIds);
      setQuestions(cachedQuestions);
      setIsLoading(false);
      
      // Preload answer options for the first few questions
      prefetchNextAnswerOptions(cachedQuestions, 0);
      return;
    }
    
    // Create a new abort controller and set up timeout
    const { abortController, signal, timeoutId } = createAbortController();
    
    try {
      setIsLoading(true);
      loadingRef.current = true;
      console.log(`Loading questions for package IDs:`, selectedPackageIds);
      
      // Execute two promises concurrently:
      // 1. Fetch package presentation orders
      // 2. Fetch all questions for the selected packages
      const [packageOrderResults, questionsData] = await Promise.all([
        fetchPackageOrders(selectedPackageIds, signal),
        fetchQuestionsData(selectedPackageIds, signal)
      ]);
      
      clearTimeout(timeoutId);
      
      if (questionsData.length === 0) {
        console.warn("No questions found for the selected packages");
        setQuestions([]);
        setIsLoading(false);
        loadingRef.current = false;
        return;
      }
      
      console.log('Package orders before processing:', packageOrderResults);
      
      // Process the question data
      const finalQuestions = processQuestions(
        questionsData, 
        selectedPackageIds, 
        packageOrderResults
      );
      
      console.log(`Processed ${finalQuestions.length} questions successfully`);
      
      // Cache the results
      setCachedQuestions(cacheKey, finalQuestions);
      setQuestions(finalQuestions);
      
      // Preload answer options for the first few questions
      prefetchNextAnswerOptions(finalQuestions, 0);
      
    } catch (error: any) {
      if (error.name === 'AbortError' || error.message === 'signal timed out') {
        console.error('Question fetch request timed out or was aborted');
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("requestTimedOut")
        });
      } else {
        console.error('Error loading questions:', error.message);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("somethingWentWrong")
        });
      }
    } finally {
      setIsLoading(false);
      if (abortControllerRef.current === abortController) {
        loadingRef.current = false;
      }
    }
  }, [
    toast, t, prefetchNextAnswerOptions, 
    getCachedQuestions, setCachedQuestions,
    fetchPackageOrders, fetchQuestionsData, 
    processQuestions, createAbortController, abortControllerRef
  ]);

  return {
    isLoading,
    questions,
    loadQuestions,
    cleanup
  };
};
