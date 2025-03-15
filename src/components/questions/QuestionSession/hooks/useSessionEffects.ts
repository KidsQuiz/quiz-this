
import { useState } from 'react';
import { useEffectsHandling } from './useEffectsHandling';
import { useRelaxAnimation } from './useRelaxAnimation';
import { usePerfectScoreHandling } from './usePerfectScoreHandling';
import { Question } from '@/hooks/questionsTypes';

export const useSessionEffects = (
  sessionComplete: boolean,
  correctAnswers: number,
  questions: Question[],
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [showBoomEffect, setShowBoomEffect] = useState(false);
  
  // Use our extracted relaxation animation hook
  const { showRelaxAnimationState, setShowRelaxAnimation } = useRelaxAnimation();

  // Use the extracted effects handling hook
  const { handleBoomEffectComplete } = useEffectsHandling(
    showWowEffect,
    showBoomEffect,
    setShowBoomEffect
  );

  // Use perfect score handling
  usePerfectScoreHandling(
    sessionComplete,
    correctAnswers,
    questions,
    setIsModalOpen,
    setShowBoomEffect
  );

  return {
    showWowEffect,
    setShowWowEffect,
    showBoomEffect,
    setShowBoomEffect: handleBoomEffectComplete,
    showRelaxAnimationState,
    setShowRelaxAnimation
  };
};
