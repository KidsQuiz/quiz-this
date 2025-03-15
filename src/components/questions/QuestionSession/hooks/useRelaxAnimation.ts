
import { useState } from 'react';

export const useRelaxAnimation = () => {
  const [showRelaxAnimationState, setShowRelaxAnimationState] = useState(false);
  
  const setShowRelaxAnimation = (show: boolean) => {
    setShowRelaxAnimationState(show);
  };

  return {
    showRelaxAnimationState,
    setShowRelaxAnimation
  };
};
