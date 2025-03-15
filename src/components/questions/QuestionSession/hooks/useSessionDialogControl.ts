
import { useQuestionDialog } from './useQuestionDialog';
import { useDialogManagement } from './useDialogManagement';
import { Question } from '@/hooks/questionsTypes';

export const useSessionDialogControl = (
  onClose: () => void,
  showBoomEffect: boolean,
  sessionComplete: boolean,
  correctAnswers: number,
  questions: Question[]
) => {
  // Use dialog state management
  const { isModalOpen, setIsModalOpen, getEffectiveOpenState } = useQuestionDialog(onClose);

  // Use dialog management hook
  const { handleDialogClose } = useDialogManagement(
    setIsModalOpen,
    onClose,
    showBoomEffect,
    sessionComplete,
    correctAnswers,
    questions
  );

  return {
    isModalOpen,
    setIsModalOpen,
    getEffectiveOpenState,
    handleDialogClose
  };
};
