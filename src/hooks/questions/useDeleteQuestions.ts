
import { useQuestionsData } from '../useQuestionsData';

export const useDeleteQuestions = (
  deleteQuestion: (id: string, showConfirm?: boolean) => Promise<boolean>,
  fetchQuestions: () => Promise<void>
) => {
  const handleDeleteSelectedQuestions = async (selectedQuestions: Set<string>) => {
    if (selectedQuestions.size === 0) return false;
    
    let success = true;
    for (const id of selectedQuestions) {
      const result = await deleteQuestion(id, false);
      if (!result) {
        success = false;
      }
    }
    
    if (success) {
      fetchQuestions();
    }
    
    return success;
  };
  
  return { handleDeleteSelectedQuestions };
};
