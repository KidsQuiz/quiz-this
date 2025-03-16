
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
  const { loadingRef, createAbortController, cleanup } = useRequestController();
  const { fetchPackageOrders } = usePackageOrderFetching();
  const { fetchQuestionsData } = useQuestionsDataFetching();
  const { processQuestions } = useQuestionsProcessing();
  
  // Load questions when packages are selected
  const loadQuestions = useCallback(async (selectedPackageIds: string[]) => {
    if (!selectedPackageIds.length) return;
    
    // Prevent multiple concurrent loading operations
    if (loadingRef.current) {
      console.log('Already loading questions, skipping duplicate request');
      return;
    }
    
    // Check if we have this combination of packages cached
    const cacheKey = selectedPackageIds.sort().join('_');
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
        toast({
          title: t("noQuestionsFound"),
          description: t("selectedPackagesNoQuestions"),
          variant: "destructive"
        });
        setIsLoading(false);
        loadingRef.current = false;
        return;
      }
      
      // Process the question data
      const finalQuestions = processQuestions(
        questionsData, 
        selectedPackageIds, 
        packageOrderResults
      );
      
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
          title: t("connectionIssue"),
          description: t("requestTimedOut")
        });
      } else {
        console.error('Error loading questions:', error.message);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("failedToLoadQuestions")
        });
      }
    } finally {
      setIsLoading(false);
      if (abortController === loadingRef.current) {
        loadingRef.current = false;
      }
    }
  }, [
    toast, t, prefetchNextAnswerOptions, 
    getCachedQuestions, setCachedQuestions,
    fetchPackageOrders, fetchQuestionsData, 
    processQuestions, createAbortController
  ]);

  return {
    isLoading,
    questions,
    loadQuestions,
    cleanup
  };
};
