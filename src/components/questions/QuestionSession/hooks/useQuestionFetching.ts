
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';

export const useQuestionFetching = (
  getCachedQuestions: (cacheKey: string) => Question[] | null,
  setCachedQuestions: (cacheKey: string, questions: Question[]) => void,
  prefetchNextAnswerOptions: (questions: Question[], currentIndex: number) => Promise<void>
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Add ref to track loading state and prevent duplicate requests
  const loadingQuestionsRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Load questions when packages are selected
  const loadQuestions = useCallback(async (selectedPackageIds: string[]) => {
    if (!selectedPackageIds.length) return;
    
    // Prevent multiple concurrent loading operations
    if (loadingQuestionsRef.current) {
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
    
    // Abort any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      loadingQuestionsRef.current = true;
      console.log(`Loading questions for package IDs:`, selectedPackageIds);
      
      // Set up a timeout to abort the request if it takes too long
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 20000); // 20-second timeout for this complex operation
      
      // Execute two promises concurrently:
      // 1. Fetch package presentation orders
      // 2. Fetch all questions for the selected packages
      const [packageOrderResults, questionsData] = await Promise.all([
        // 1. Fetch package presentation orders
        (async () => {
          const { data, error } = await supabase
            .from('packages')
            .select('id, presentation_order')
            .in('id', selectedPackageIds)
            .abortSignal(abortControllerRef.current?.signal || undefined);
            
          if (error) {
            console.error('Error fetching package presentation orders:', error.message);
            // Default all to shuffle if there's an error
            return selectedPackageIds.map(id => ({ packageId: id, order: 'shuffle' as const }));
          }
          
          return data.map(pkg => ({
            packageId: pkg.id,
            order: (pkg.presentation_order as 'sequential' | 'shuffle') || 'shuffle'
          }));
        })(),
        
        // 2. Fetch all questions simultaneously
        (async () => {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .in('package_id', selectedPackageIds)
            .abortSignal(abortControllerRef.current?.signal || undefined);
            
          if (error) throw error;
          return data || [];
        })()
      ]);
      
      clearTimeout(timeoutId);
      
      const packagePresentationOrders: Record<string, 'sequential' | 'shuffle'> = {};
      packageOrderResults.forEach(result => {
        packagePresentationOrders[result.packageId] = result.order;
      });
      
      if (questionsData.length === 0) {
        toast({
          title: "No questions found",
          description: "The selected packages don't have any questions.",
          variant: "destructive"
        });
        setIsLoading(false);
        loadingQuestionsRef.current = false;
        return;
      }
      
      console.log(`Loaded ${questionsData.length} total questions from all packages`);
      
      // Group questions by package_id
      const questionsByPackage: Record<string, Question[]> = {};
      questionsData.forEach(question => {
        if (!questionsByPackage[question.package_id]) {
          questionsByPackage[question.package_id] = [];
        }
        questionsByPackage[question.package_id].push(question);
      });
      
      // Process and order questions by package
      let allQuestions: Question[] = [];
      
      for (const packageId of selectedPackageIds) {
        const packageQuestions = questionsByPackage[packageId] || [];
        
        // If this package is set to shuffle, randomize its questions
        if (packagePresentationOrders[packageId] === 'shuffle') {
          packageQuestions.sort(() => Math.random() - 0.5);
        } else {
          // For sequential packages, sort by created_at
          packageQuestions.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        }
        
        allQuestions = [...allQuestions, ...packageQuestions];
      }
      
      // Deduplicate questions by ID
      const uniqueQuestionsMap = new Map<string, Question>();
      allQuestions.forEach(question => {
        if (!uniqueQuestionsMap.has(question.id)) {
          uniqueQuestionsMap.set(question.id, question);
        }
      });
      
      // Convert back to array
      const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
      
      console.log(`Loaded ${uniqueQuestions.length} unique questions across all packages`);
      
      // Always shuffle questions across different packages
      const finalQuestions = [...uniqueQuestions].sort(() => Math.random() - 0.5);
      
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
          title: "Connection Issue",
          description: "Request timed out. Please try again."
        });
      } else {
        console.error('Error loading questions:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load questions"
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      loadingQuestionsRef.current = false;
    }
  }, [toast, prefetchNextAnswerOptions, getCachedQuestions, setCachedQuestions]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    isLoading,
    questions,
    loadQuestions,
    cleanup
  };
};
