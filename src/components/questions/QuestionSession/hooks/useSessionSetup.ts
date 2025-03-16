
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/hooks/questionsTypes';

export const useSessionSetup = (
  kidId: string,
  loadQuestions: (packageIds: string[]) => Promise<void>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>,
  loadAnswerOptions: (questionId: string) => Promise<void>,
  questions: Question[],
  currentQuestionIndex: number,
  currentQuestion: Question | null,
  toast: any,
  t: (key: string) => string,
  onClose: () => void
) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);

  // Initial setup effect
  useEffect(() => {
    const fetchPackagesAndStartSession = async () => {
      try {
        console.log(`Starting to fetch packages for kid ${kidId}`);
        const { data: assignedPackages, error: assignmentsError } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (assignmentsError) throw assignmentsError;
        
        console.log(`Assigned packages for kid ${kidId}:`, assignedPackages);
        
        if (!assignedPackages || assignedPackages.length === 0) {
          // No need to show toast here if there are no packages
          // We'll just close the session quietly
          onClose();
          return;
        }
        
        const packageIds = assignedPackages.map(p => p.package_id);
        await loadQuestions(packageIds);
        
        if (questions.length > 0) {
          setCurrentQuestionIndex(0);
          
          if (questions[0]) {
            setCurrentQuestion(questions[0] as Question);
            await loadAnswerOptions(questions[0].id);
          }
        }
        
        setInitialLoadComplete(true);
        
      } catch (error: any) {
        console.error('Error loading assigned packages:', error.message);
        // Only show one error toast
        if (!hasShownError) {
          setHasShownError(true);
          toast({
            variant: "destructive",
            title: t("error"),
            description: t("somethingWentWrong")
          });
          onClose();
        }
      }
    };
    
    fetchPackagesAndStartSession();
  }, [kidId, loadQuestions, onClose, toast, t, setCurrentQuestionIndex, questions, setCurrentQuestion, loadAnswerOptions, hasShownError]);

  // Handle loading current question when index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= 0 && !currentQuestion) {
      const question = questions[currentQuestionIndex];
      if (question) {
        console.log(`Setting current question to index ${currentQuestionIndex}:`, question);
        setCurrentQuestion(question);
        loadAnswerOptions(question.id);
      }
    }
  }, [questions, currentQuestionIndex, currentQuestion, setCurrentQuestion, loadAnswerOptions]);

  return { initialLoadComplete };
};
