
import { useState } from 'react';

export const useSessionUIState = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);

  return {
    isModalOpen,
    setIsModalOpen,
    showRelaxAnimation,
    setShowRelaxAnimation
  };
};
