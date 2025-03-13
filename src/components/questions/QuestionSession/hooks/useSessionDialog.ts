
import { useEffect } from 'react';

export const useSessionDialog = (
  onClose: () => void,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Handle dialog close and terminate the session
  const handleDialogClose = () => {
    // Clean up any styles applied to the body
    document.body.style.removeProperty('pointer-events');
    
    // Close the dialog and call the onClose callback
    setIsModalOpen(false);
    onClose();
  };

  // Clean up effect for when component unmounts
  useEffect(() => {
    return () => {
      // Remove any global styles
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  return {
    handleDialogClose
  };
};
