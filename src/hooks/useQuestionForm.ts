
import { useQuestionData } from './questions/useQuestionData';
import { useFormState } from './questions/useFormState';
import { useSubmitQuestion } from './questions/useSubmitQuestion';
import { AnswerFormOption } from '@/components/questions/AnswerOptionsList';

export const useQuestionForm = (
  questionId: string | undefined,
  packageId: string,
  onSave: () => void,
  onClose: () => void
) => {
  const {
    content,
    setContent,
    timeLimit,
    setTimeLimit,
    points,
    setPoints,
    answers,
    setAnswers,
    isLoading,
    isEditMode
  } = useQuestionData(questionId);

  const { handleAnswerChange: changeHandler, validateForm } = useFormState();
  const { isSubmitting, saveQuestion } = useSubmitQuestion();

  // Create a simpler interface for answer changes
  const handleAnswerChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
    changeHandler(answers, setAnswers, index, field, value);
  };
  
  const handleSubmit = async (e: React.FormEvent, userId: string | undefined) => {
    e.preventDefault();
    
    if (!validateForm(content, answers)) return;
    
    await saveQuestion({
      userId,
      questionId,
      packageId,
      content,
      timeLimit,
      points,
      answers,
      isEditMode,
      onSuccess: onSave,
      onClose
    });
  };
  
  return {
    content,
    setContent,
    timeLimit,
    setTimeLimit,
    points,
    setPoints,
    answers,
    isLoading: isLoading || isSubmitting,
    isEditMode,
    handleAnswerChange,
    handleSubmit
  };
};
