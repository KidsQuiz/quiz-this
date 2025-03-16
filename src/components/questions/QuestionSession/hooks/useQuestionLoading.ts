
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';

export const useQuestionLoading = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  
  // Add refs to track loading states and prevent duplicate requests
  const loadingQuestionsRef = useRef(false);
  const loadingAnswersRef = useRef(false);
  const loadingAnswersForQuestionId = useRef<string | null>(null);
  
  // Enhanced caching with session storage backup
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

  // Prefetch answer options for the next few questions in advance
  const prefetchNextAnswerOptions = useCallback(async (questions: Question[], currentIndex: number) => {
    const prefetchCount = 2; // Number of questions to prefetch ahead
    const questionsToFetch = [];
    
    for (let i = currentIndex + 1; i < currentIndex + 1 + prefetchCount && i < questions.length; i++) {
      const questionId = questions[i]?.id;
      if (questionId && !answersCacheRef.current[questionId]) {
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
          answersCacheRef.current[questionId] = shuffledOptions;
        });
        
        console.log(`Successfully prefetched and cached answer options for ${Object.keys(groupedByQuestion).length} questions`);
      }
    } catch (error: any) {
      console.error('Error prefetching answer options:', error.message);
    }
  }, []);

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
    if (questionsCacheRef.current[cacheKey]) {
      console.log('Using cached questions for packages:', selectedPackageIds);
      setQuestions(questionsCacheRef.current[cacheKey]);
      setIsLoading(false);
      
      // Preload answer options for the first few questions
      prefetchNextAnswerOptions(questionsCacheRef.current[cacheKey], 0);
      return;
    }
    
    try {
      setIsLoading(true);
      loadingQuestionsRef.current = true;
      console.log(`Loading questions for package IDs:`, selectedPackageIds);
      
      // Execute two promises concurrently:
      // 1. Fetch package presentation orders
      // 2. Fetch all questions for the selected packages
      const [packageOrderResults, questionsData] = await Promise.all([
        // 1. Fetch package presentation orders
        (async () => {
          const { data, error } = await supabase
            .from('packages')
            .select('id, presentation_order')
            .in('id', selectedPackageIds);
            
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
            .in('package_id', selectedPackageIds);
            
          if (error) throw error;
          return data || [];
        })()
      ]);
      
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
      questionsCacheRef.current[cacheKey] = finalQuestions;
      
      setQuestions(finalQuestions);
      
      // Preload answer options for the first few questions
      prefetchNextAnswerOptions(finalQuestions, 0);
      
    } catch (error: any) {
      console.error('Error loading questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions"
      });
    } finally {
      setIsLoading(false);
      loadingQuestionsRef.current = false;
    }
  }, [toast, prefetchNextAnswerOptions]);

  // Load answer options for the current question - more efficient implementation
  const loadAnswerOptions = useCallback(async (questionId: string) => {
    // Prevent duplicate/concurrent requests for the same question
    if (loadingAnswersRef.current && loadingAnswersForQuestionId.current === questionId) {
      console.log(`Already loading answer options for question ${questionId}, skipping duplicate request`);
      return;
    }
    
    // Check if we have answers for this question cached
    if (answersCacheRef.current[questionId]) {
      console.log(`Using cached answer options for question ${questionId}`);
      setAnswerOptions(answersCacheRef.current[questionId]);
      
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
        answersCacheRef.current[questionId] = shuffledAnswers;
        
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
  }, [toast, questions, prefetchNextAnswerOptions]);

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
