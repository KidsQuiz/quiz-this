
import { useState, useEffect } from 'react';

export const useQuestionDialog = (onClose: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  
  // Clean up effect for when component unmounts
  useEffect(() => {
    return () => {
      // Remove any global styles or event listeners
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  // Determine effective open state as a combination of parent control and internal state
  const getEffectiveOpenState = (isOpen: boolean) => {
    return isOpen && isModalOpen;
  };

  return {
    isModalOpen,
    setIsModalOpen,
    getEffectiveOpenState
  };
};
