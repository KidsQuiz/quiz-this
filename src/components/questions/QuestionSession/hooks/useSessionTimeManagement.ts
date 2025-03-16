
import { useEffect } from 'react';

interface UseSessionTimeManagementProps {
  timeUpTriggered: boolean;
  navigationTimeUpTriggered: boolean;
  timeRemaining: number;
  answerSubmitted: boolean;
  timerActive: boolean;
  setTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setNavigationTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSessionTimeManagement = ({
  timeUpTriggered,
  navigationTimeUpTriggered,
  timeRemaining,
  answerSubmitted,
  timerActive,
  setTimeUpTriggered,
  setNavigationTimeUpTriggered,
  setTimerActive
}: UseSessionTimeManagementProps) => {
  // Sync timeUpTriggered from navigation to the main state
  useEffect(() => {
    if (navigationTimeUpTriggered && !timeUpTriggered && !answerSubmitted) {
      console.log("Syncing time up trigger from navigation");
      setTimeUpTriggered(true);
      setNavigationTimeUpTriggered(false);
    }
  }, [navigationTimeUpTriggered, timeUpTriggered, answerSubmitted, setTimeUpTriggered, setNavigationTimeUpTriggered]);

  // React to timer reaching zero by setting timeUpTriggered
  useEffect(() => {
    if (timeRemaining === 0 && !answerSubmitted && timerActive) {
      console.log("Time ran out, triggering time up handler now");
      setTimerActive(false); // Stop the timer immediately
      setTimeUpTriggered(true); // Mark that time is up
    }
  }, [timeRemaining, answerSubmitted, timerActive, setTimeUpTriggered, setTimerActive]);
  
  // Ensure we're not stuck with an active timer that's at zero
  useEffect(() => {
    if (timeRemaining === 0 && timerActive) {
      console.log("Safety check: Timer at zero but still active, deactivating");
      setTimerActive(false);
    }
  }, [timeRemaining, timerActive, setTimerActive]);
  
  // Extra safety to ensure time up is processed when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0 && !timeUpTriggered && !answerSubmitted) {
      console.log("Extra safety: Timer at zero but timeUpTriggered not set");
      setTimeUpTriggered(true);
    }
  }, [timeRemaining, timeUpTriggered, answerSubmitted, setTimeUpTriggered]);
};
