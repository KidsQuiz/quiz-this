
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuestionsFetch } from './questions/useQuestionsFetch';
import { useQuestionsManagement } from './questions/useQuestionsManagement';
import { Question } from './questionsTypes';

export type { Question, AnswerOption } from './questionsTypes';

export const useQuestionsData = (packageId?: string) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const { isLoading, fetchQuestions, fetchAnswerOptions } = useQuestionsFetch(packageId);
  const { deleteQuestion: deleteQuestionAction, deleteAllQuestions: deleteAllQuestionsAction } = useQuestionsManagement();
  
  const loadQuestions = async () => {
    const data = await fetchQuestions(user?.id);
    setQuestions(data);
  };

  useEffect(() => {
    loadQuestions();
  }, [user, packageId]);

  const deleteQuestion = async (id: string, showConfirm = true) => {
    const success = await deleteQuestionAction(id, showConfirm);
    if (success) {
      setQuestions(questions.filter(question => question.id !== id));
    }
    return success;
  };

  const deleteAllQuestions = async () => {
    if (!packageId) return false;
    
    const success = await deleteAllQuestionsAction(packageId);
    if (success) {
      setQuestions([]);
    }
    return success;
  };

  return {
    questions,
    isLoading,
    fetchQuestions: loadQuestions,
    fetchAnswerOptions,
    deleteQuestion,
    deleteAllQuestions
  };
};
