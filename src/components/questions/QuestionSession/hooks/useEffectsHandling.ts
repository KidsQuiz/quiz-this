
import { useCallback } from 'react';

export const useEffectsHandling = (
  showWowEffect: boolean,
  showBoomEffect: boolean,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  // Log boom effect state for debugging
  const handleBoomEffectComplete = useCallback(() => {
    console.log("🎉 BoomEffect onComplete called, hiding effect");
    setShowBoomEffect(false);
  }, [setShowBoomEffect]);

  return {
    handleBoomEffectComplete,
    showWowEffect,
    showBoomEffect
  };
};
