
import { useEffect, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';

export const useModalTransition = (
  isModalOpen: boolean,
  sessionComplete: boolean,
  currentQuestionIndex: number,
  questions: Question[],
  correctAnswers: number,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Track whether a transition is already in progress
  const transitionInProgressRef = useRef(false);
  // Track the last time a transition was initiated to prevent rapid repeated transitions
  const lastTransitionTimeRef = useRef(0);
  // Track the last question index that was processed
  const lastProcessedIndexRef = useRef(-1);
  
  // Advance to the next question when modal is closed
  useEffect(() => {
    // Only process if modal is closed, session is not complete, and we have valid questions
    if (!isModalOpen && !sessionComplete && questions.length > 0 && currentQuestionIndex < questions.length) {
      console.log(`Modal closed, current question index: ${currentQuestionIndex}, total questions: ${questions.length}`);
      
      // Skip if we just processed this index (prevents duplicate processing)
      if (lastProcessedIndexRef.current === currentQuestionIndex) {
        console.log(`Already processed transition for index ${currentQuestionIndex}, skipping`);
        return;
      }
      
      // Prevent rapid transitions
      const now = Date.now();
      if (now - lastTransitionTimeRef.current < 1200) { // Increased from 1000ms to 1200ms
        console.log(`Transition requested too soon (${now - lastTransitionTimeRef.current}ms), ignoring`);
        return;
      }
      
      // Prevent duplicate transitions
      if (transitionInProgressRef.current) {
        console.log("Modal transition already in progress, ignoring duplicate event");
        return;
      }
      
      // Set the transition flag and update the transition time
      transitionInProgressRef.current = true;
      lastTransitionTimeRef.current = now;
      lastProcessedIndexRef.current = currentQuestionIndex;
      
      // Move to the next question
      const nextQuestionIndex = currentQuestionIndex + 1;
      
      if (nextQuestionIndex >= questions.length) {
        // If we've reached the end, mark session as complete
        console.log('Reached end of questions, completing session');
        setSessionComplete(true);
        
        // Check for perfect score
        const isPerfectScore = correctAnswers === questions.length && questions.length > 0;
        if (isPerfectScore) {
          // For perfect scores, keep the modal closed
          console.log("Perfect score detected - keeping modal closed");
          transitionInProgressRef.current = false;
        } else {
          // For non-perfect scores, reopen the modal for the summary screen
          console.log("Non-perfect score - reopening modal for summary");
          
          // Store transition time for debugging
          const transitionTime = Date.now();
          console.log(`TRANSITION: Modal closed at ${transitionTime}, scheduling reopen with delay`);
          
          // CRITICAL: Use setTimeout with a LONGER delay to ensure complete DOM updates
          setTimeout(() => {
            console.log(`TRANSITION: Reopening modal after ${Date.now() - transitionTime}ms delay`);
            
            // Make sure pointer events are enabled before showing summary
            document.body.style.removeProperty('pointer-events');
            
            // This will reopen the modal with the summary screen
            setIsModalOpen(true);
            transitionInProgressRef.current = false;
          }, 1000); // Increased from 800ms to 1000ms
        }
      } else {
        // CRITICAL: Immediately advance to next question index
        console.log(`Advancing to question ${nextQuestionIndex + 1}`);
        setCurrentQuestionIndex(nextQuestionIndex);
        
        // Store transition time for debugging
        const transitionTime = Date.now();
        console.log(`TRANSITION: Modal closed at ${transitionTime}, scheduling reopen with delay`);
        
        // CRITICAL: Ensure the modal reopens with the next question
        // Use setTimeout with a longer delay to ensure complete DOM updates
        setTimeout(() => {
          console.log(`TRANSITION: Reopening modal after ${Date.now() - transitionTime}ms delay`);
          
          // Make sure pointer events are enabled before showing next question
          document.body.style.removeProperty('pointer-events');
          
          // Reopen the modal with the next question
          setIsModalOpen(true);
          transitionInProgressRef.current = false;
        }, 1000); // Increased from 800ms to 1000ms
      }
    } else if (isModalOpen) {
      // Reset transition flag when modal is open
      transitionInProgressRef.current = false;
    }
  }, [isModalOpen, sessionComplete, currentQuestionIndex, questions.length, correctAnswers, setCurrentQuestionIndex, setIsModalOpen, setSessionComplete]);
};
