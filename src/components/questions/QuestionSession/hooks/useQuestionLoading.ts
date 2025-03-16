
import { useState, useCallback, useRef } from 'react';
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
  const questionsCacheRef = useRef<Record<string, Question[]>>({});
  const answersCacheRef = useRef<Record<string, AnswerOption[]>>({});

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
      return;
    }
    
    try {
      setIsLoading(true);
      loadingQuestionsRef.current = true;
      console.log(`Loading questions for package IDs:`, selectedPackageIds);
      
      let allQuestions: Question[] = [];
      let packagePresentationOrders: Record<string, 'sequential' | 'shuffle'> = {};
      
      // Use Promise.all to fetch package presentation orders in parallel
      const packageOrderPromises = selectedPackageIds.map(async (packageId) => {
        const { data: packageData, error: packageError } = await supabase
          .from('packages')
          .select('id, presentation_order')
          .eq('id', packageId)
          .single();
          
        if (packageError) {
          console.error('Error fetching package presentation order:', packageError.message);
          // Default to shuffle if there's an error
          return { packageId, order: 'shuffle' as const };
        } else if (packageData) {
          // Make sure we cast the presentation_order to the correct type
          return { 
            packageId, 
            order: (packageData.presentation_order as 'sequential' | 'shuffle') || 'shuffle'
          };
        }
        return { packageId, order: 'shuffle' as const };
      });
      
      const packageOrderResults = await Promise.all(packageOrderPromises);
      packageOrderResults.forEach(result => {
        packagePresentationOrders[result.packageId] = result.order;
      });
      
      // Batch questions fetching by using a single query with IN operator
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .in('package_id', selectedPackageIds);
        
      if (questionsError) throw questionsError;
      
      if (questionsData && questionsData.length > 0) {
        console.log(`Loaded ${questionsData.length} total questions from all packages`);
        
        // Group questions by package_id
        const questionsByPackage: Record<string, Question[]> = {};
        questionsData.forEach(question => {
          if (!questionsByPackage[question.package_id]) {
            questionsByPackage[question.package_id] = [];
          }
          questionsByPackage[question.package_id].push(question);
        });
        
        // Process each package's questions according to its presentation_order
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
      }
      
      if (allQuestions.length === 0) {
        toast({
          title: "No questions found",
          description: "The selected packages don't have any questions.",
          variant: "destructive"
        });
        return;
      }
      
      // Deduplicate questions by ID to ensure each question appears only once
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
      // This ensures that questions from different packages are mixed
      // but the order within each package respects its configuration
      const finalQuestions = [...uniqueQuestions].sort(() => Math.random() - 0.5);
      
      // Cache the results for future use
      questionsCacheRef.current[cacheKey] = finalQuestions;
      
      setQuestions(finalQuestions);
      
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
  }, [toast]);

  // Load answer options for the current question
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
      return;
    }
    
    try {
      loadingAnswersRef.current = true;
      loadingAnswersForQuestionId.current = questionId;
      
      console.log(`Loading answer options for question ID: ${questionId}`);
      
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.warn(`No answer options found for question ${questionId}`);
      } else {
        console.log(`Loaded ${data.length} answer options for question ${questionId}`);
      }
      
      // Randomize the order of answers
      const shuffledAnswers = [...(data || [])].sort(() => Math.random() - 0.5);
      
      // Cache the results
      answersCacheRef.current[questionId] = shuffledAnswers;
      
      setAnswerOptions(shuffledAnswers);
      
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
  }, [toast]);

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
