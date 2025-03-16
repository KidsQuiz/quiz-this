
import { useState } from 'react';

export const useVisualEffectsState = () => {
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [showBoomEffect, setShowBoomEffect] = useState(false);
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);

  const resetVisualEffects = () => {
    setShowWowEffect(false);
    setShowBoomEffect(false);
    setShowRelaxAnimation(false);
  };

  return {
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect,
    showRelaxAnimation,
    setShowRelaxAnimation,
    resetVisualEffects
  };
};
