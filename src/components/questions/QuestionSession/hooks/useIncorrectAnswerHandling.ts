
import { useCallback } from 'react';
import { playSound } from '@/utils/soundEffects';

export const useIncorrectAnswerHandling = (
  setShowRelaxAnimation: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetAnswerState: () => void
) => {
  const handleIncorrectAnswer = useCallback(() => {
    console.log("Incorrect answer. Showing relaxation animation.");
    
    // Play incorrect sound effect
    playSound('incorrect');
    
    // Show relaxation animation
    setShowRelaxAnimation(true);
    
    // Wait a moment to show the relaxation animation, then move to next question
    setTimeout(() => {
      console.log("Relaxation animation timeout complete, resetting state");
      setShowRelaxAnimation(false);
      
      // Reset answer state before transitioning
      resetAnswerState();
      
      // Force multiple resets for redundancy
      setTimeout(() => resetAnswerState(), 50);
      
      // Wait a moment after the animation before closing the modal to advance
      setTimeout(() => {
        console.log("Closing question dialog after incorrect answer");
        setIsModalOpen(false); // This will trigger the modal transition to the next question
      }, 100);
    }, 2000);
  }, [setShowRelaxAnimation, setIsModalOpen, resetAnswerState]);
  
  return { handleIncorrectAnswer };
};
