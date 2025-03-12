
import { AnswerFormOption } from '@/components/questions/AnswerOptionsList';
import { toast } from '@/hooks/use-toast';

export const useFormState = () => {
  const handleAnswerChange = (
    answers: AnswerFormOption[],
    setAnswers: React.Dispatch<React.SetStateAction<AnswerFormOption[]>>,
    index: number, 
    field: 'content' | 'isCorrect', 
    value: string | boolean
  ) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = {
      ...updatedAnswers[index],
      [field]: value
    };
    setAnswers(updatedAnswers);
  };
  
  const validateForm = (content: string, answers: AnswerFormOption[]) => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide the question content."
      });
      return false;
    }
    
    // Check if at least one answer is marked as correct
    if (!answers.some(answer => answer.isCorrect)) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please mark at least one answer as correct."
      });
      return false;
    }
    
    // Check if all answers have content
    const filledAnswers = answers.filter(answer => answer.content.trim() !== '');
    if (filledAnswers.length < 2) {
      toast({
        variant: "destructive",
        title: "Invalid Answers",
        description: "Please provide at least two answer options."
      });
      return false;
    }
    
    return true;
  };
  
  return {
    handleAnswerChange,
    validateForm
  };
};
