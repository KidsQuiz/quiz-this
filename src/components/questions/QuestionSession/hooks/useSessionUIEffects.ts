
import { useEffect } from 'react';

/**
 * Handles UI effects like animations, transitions, etc.
 */
export const useSessionUIEffects = (props: {
  showBoomEffect: boolean;
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>;
  isTimeUp: boolean;
  showingTimeUpFeedback: boolean;
}) => {
  // Clean up boom effect after a delay
  useEffect(() => {
    if (props.showBoomEffect) {
      const timer = setTimeout(() => {
        console.log("Auto-hiding boom effect after timeout");
        props.setShowBoomEffect(false);
      }, 6000); // Auto-hide after 6 seconds
      
      return () => clearTimeout(timer);
    }
  }, [props.showBoomEffect, props.setShowBoomEffect]);

  // Additional UI effects can be added here
};
