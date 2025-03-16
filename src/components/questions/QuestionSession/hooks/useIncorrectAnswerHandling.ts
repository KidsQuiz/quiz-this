
import { useCallback } from 'react';
import { playSound } from '@/utils/soundEffects';

export const useIncorrectAnswerHandling = (
  setShowRelaxAnimation: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetAnswerState: () => void,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>
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
      
      // Wait a moment after the animation before advancing to next question
      setTimeout(() => {
        console.log("TRANSITION: Advancing to next question after incorrect answer");
        
        // Re-enable pointer events
        document.body.style.removeProperty('pointer-events');
        
        // Force additional state reset to ensure clean state
        resetAnswerState();
        
        // Instead of closing the modal, just advance the question index
        // The currentQuestionIndex will be updated in the parent component
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        
      }, 500);
    }, 2000);
  }, [setShowRelaxAnimation, resetAnswerState, setCurrentQuestionIndex]);
  
  return { handleIncorrectAnswer };
};
