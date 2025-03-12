
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { useToast } from '@/hooks/use-toast';

export const useQuestionLoading = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

  // Load questions when packages are selected
  const loadQuestions = useCallback(async (selectedPackageIds: string[]) => {
    if (!selectedPackageIds.length) return;
    
    try {
      setIsLoading(true);
      
      let allQuestions: Question[] = [];
      
      // Get questions for all selected packages
      for (const packageId of selectedPackageIds) {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('package_id', packageId)
          .order('created_at');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          allQuestions = [...allQuestions, ...data];
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
      
      // Convert back to array and randomize the order
      const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
      const shuffledQuestions = [...uniqueQuestions].sort(() => Math.random() - 0.5);
      
      setQuestions(shuffledQuestions);
      
    } catch (error: any) {
      console.error('Error loading questions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load questions"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load answer options for the current question
  const loadAnswerOptions = useCallback(async (questionId: string) => {
    try {
      const { data, error } = await supabase
        .from('answer_options')
        .select('*')
        .eq('question_id', questionId)
        .order('id');
        
      if (error) throw error;
      
      // Randomize the order of answers
      const shuffledAnswers = [...(data || [])].sort(() => Math.random() - 0.5);
      setAnswerOptions(shuffledAnswers);
      
    } catch (error: any) {
      console.error('Error loading answer options:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load answer options"
      });
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
