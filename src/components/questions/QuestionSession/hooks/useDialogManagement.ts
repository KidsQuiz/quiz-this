
import { useCallback } from 'react';

export const useDialogManagement = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  onClose: () => void,
  showBoomEffect: boolean,
  sessionComplete: boolean,
  correctAnswers: number,
  questions: any[]
) => {
  // Handle dialog closing
  const handleDialogClose = useCallback(() => {
    // Always clean up any styles applied to the body
    document.body.style.removeProperty('pointer-events');
    
    // If we have a perfect score and the session is complete, keep the boom effect visible
    // when closing the dialog
    const isPerfectScore = correctAnswers === questions.length && questions.length > 0;
    
    if (isPerfectScore && sessionComplete && !showBoomEffect) {
      console.log("Perfect score detected when closing dialog");
    }
    
    // Close the dialog and call the onClose callback
    setIsModalOpen(false);
    onClose();
  }, [setIsModalOpen, onClose, showBoomEffect, sessionComplete, correctAnswers, questions]);

  return {
    handleDialogClose
  };
};
