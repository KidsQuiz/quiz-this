
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
    
    // Immediately disable pointer events to prevent further interaction
    document.body.style.pointerEvents = 'none';
    
    // Show relaxation animation
    setShowRelaxAnimation(true);
    
    // Wait a moment to show the relaxation animation, then move to next question
    setTimeout(() => {
      console.log("Relaxation animation timeout complete, resetting state");
      setShowRelaxAnimation(false);
      
      // Reset answer state before transitioning
      resetAnswerState();
      
      // Force multiple resets for redundancy
      setTimeout(() => resetAnswerState(), 100);
      
      // Wait a moment after the animation before closing the modal to advance
      setTimeout(() => {
        console.log("Closing question dialog after incorrect answer");
        
        // Set a flag to prevent race conditions
        const transitionTime = Date.now();
        console.log(`Starting transition at time: ${transitionTime}`);
        
        // This will trigger the modal transition to the next question
        setIsModalOpen(false);
        
        // Re-enable pointer events after transition
        setTimeout(() => {
          document.body.style.removeProperty('pointer-events');
          console.log(`Re-enabled pointer events at ${Date.now() - transitionTime}ms after transition start`);
        }, 400);
      }, 300);
    }, 2000);
  }, [setShowRelaxAnimation, setIsModalOpen, resetAnswerState]);
  
  return { handleIncorrectAnswer };
};
