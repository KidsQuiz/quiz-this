
import { useState } from 'react';
import { Question } from '../questionsTypes';

export const useQuestionSelection = (questions: Question[]) => {
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  
  const handleSelectQuestion = (id: string, isSelected: boolean) => {
    const newSelected = new Set(selectedQuestions);
    if (isSelected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      const allQuestionIds = questions.map(q => q.id);
      setSelectedQuestions(new Set(allQuestionIds));
    }
  };

  const clearSelections = () => {
    setSelectedQuestions(new Set());
  };

  return {
    selectedQuestions,
    handleSelectQuestion,
    handleSelectAllQuestions,
    clearSelections
  };
};
