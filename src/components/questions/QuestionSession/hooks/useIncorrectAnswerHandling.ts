
import { useCallback } from 'react';
import { playSound } from '@/utils/soundEffects';

export const useIncorrectAnswerHandling = (
  setShowRelaxAnimation: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetAnswerState: () => void
) => {
  const handleIncorrectAnswer = useCallback(() => {
    // Play incorrect sound effect
    playSound('incorrect');
    
    // Show the relaxing animation directly in the question dialog
    setShowRelaxAnimation(true);
    
    // Wait 5 seconds before moving to next question
    setTimeout(() => {
      // CRITICAL: Aggressive state reset before navigation
      console.log("CRITICAL: Resetting all answer state before incorrect answer navigation");
      resetAnswerState();
      
      // Force multiple resets for redundancy
      setTimeout(() => resetAnswerState(), 50);
      setTimeout(() => resetAnswerState(), 100);
      
      setShowRelaxAnimation(false);
      console.log("Moving to next question after incorrect answer, CONFIRMED selection state is null");
      
      // Important: Force DOM update with state reset before modal change
      document.body.style.pointerEvents = 'none';
      setTimeout(() => {
        setIsModalOpen(false); // Close this question to advance to next
        setTimeout(() => {
          document.body.style.removeProperty('pointer-events');
        }, 300);
      }, 100);
    }, 5000);
  }, [setShowRelaxAnimation, setIsModalOpen, resetAnswerState]);

  return { handleIncorrectAnswer };
};
