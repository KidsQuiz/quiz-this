
import { useState } from 'react';
import { useQuestionsData } from '../useQuestionsData';

export const useDeleteQuestions = (
  deleteQuestion: (id: string, showConfirm?: boolean) => Promise<boolean>,
  fetchQuestions: () => Promise<void>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteSelectedQuestions = async (selectedQuestions: Set<string>) => {
    if (selectedQuestions.size === 0) return false;
    
    setIsDeleting(true);
    let success = true;
    
    try {
      for (const id of selectedQuestions) {
        const result = await deleteQuestion(id, false);
        if (!result) {
          success = false;
        }
      }
      
      if (success) {
        await fetchQuestions();
      }
      
      return success;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return { handleDeleteSelectedQuestions, isDeleting };
};
