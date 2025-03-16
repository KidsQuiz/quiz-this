import { useState, useEffect, useCallback, useRef } from 'react';

export const useQuestionNavigation = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const advancementInProgressRef = useRef(false);
  const currentIndexRef = useRef(0);
  
  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex;
    console.log(`Navigation: currentQuestionIndex updated to ${currentQuestionIndex}`);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          console.log("Timer reached zero, stopping timer automatically");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const handleTimeUp = useCallback(() => {
    console.log('handleTimeUp called, current timer active state:', timerActive);
    if (timerActive) {
      console.log('Stopping timer due to time up');
      setTimerActive(false);
      return true; // Time up event processed
    }
    return false;
  }, [timerActive]);

  const handleTerminateSession = useCallback((onClose: () => void) => {
    setTimerActive(false);
    onClose();
  }, []);

  const safeSetCurrentQuestionIndex = useCallback((newIndex: number) => {
    console.log(`SAFE SETTER: Updating question index from ${currentIndexRef.current} to ${newIndex}`);
    
    currentIndexRef.current = newIndex;
    
    setCurrentQuestionIndex(newIndex);
    
    document.body.classList.toggle('force-reflow');
    document.body.classList.toggle('force-reflow');
    
    console.log(`SAFE SETTER: Index update completed to ${newIndex}`);
  }, []);

  const forceAdvanceQuestion = useCallback(() => {
    if (advancementInProgressRef.current) {
      console.log("Advancement already in progress, ignoring duplicate request");
      return;
    }
    
    advancementInProgressRef.current = true;
    
    document.body.style.pointerEvents = 'none';
    
    console.log("Forcing advancement to next question");
    const newIndex = currentIndexRef.current + 1;
    console.log(`DIRECT ADVANCEMENT: from question ${currentIndexRef.current + 1} to ${newIndex + 1}`);
    
    safeSetCurrentQuestionIndex(newIndex);
    
    setTimeout(() => {
      advancementInProgressRef.current = false;
      document.body.style.removeProperty('pointer-events');
    }, 100);
  }, [safeSetCurrentQuestionIndex]);

  return {
    currentQuestionIndex,
    timeRemaining,
    timerActive,
    setCurrentQuestionIndex: safeSetCurrentQuestionIndex,
    setTimeRemaining,
    setTimerActive,
    handleTimeUp,
    handleTerminateSession,
    forceAdvanceQuestion
  };
};
