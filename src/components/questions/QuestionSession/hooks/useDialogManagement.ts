
import { useCallback } from 'react';

interface DialogManagementProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  showBoomEffect: boolean;
  sessionComplete: boolean;
  correctAnswers: number;
  questions: { id: string }[];
}

export const useDialogManagement = ({
  setIsModalOpen,
  onClose,
  showBoomEffect,
  sessionComplete,
  correctAnswers,
  questions
}: DialogManagementProps) => {
  // Handle dialog closing
  const handleDialogClose = useCallback(() => {
    // Always make sure pointer events are restored when closing the dialog
    document.body.style.removeProperty('pointer-events');
    
    // Close the modal
    setIsModalOpen(false);
    
    // Give a small delay before calling the parent's onClose to ensure clean state transitions
    setTimeout(() => {
      // Call the parent onClose to fully clean up
      onClose();
    }, 100);
  }, [onClose, setIsModalOpen]);

  return {
    handleDialogClose
  };
};
