
import { useCallback, useRef } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

export const useCorrectAnswerHandling = (
  questions: Question[],
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  resetAnswerState: () => void
) => {
  // Add a processing flag to prevent duplicate transitions
  const isProcessingRef = useRef(false);
  const lastProcessedQuestionIdRef = useRef<string | null>(null);

  const handleCorrectAnswer = useCallback((currentQuestion: Question) => {
    // Skip if already processing or this question was already processed
    if (isProcessingRef.current || lastProcessedQuestionIdRef.current === currentQuestion.id) {
      console.log("Already processing this correct answer, skipping duplicate handling");
      return;
    }
    
    // Mark as processing and store the question ID
    isProcessingRef.current = true;
    lastProcessedQuestionIdRef.current = currentQuestion.id;
    
    const points = currentQuestion.points;
    console.log(`Correct answer! Adding ${points} points to session total`);
    
    // Play correct sound effect
    playSound('correct');
    
    // Update correct answers count
    let newCorrectAnswers = 0;
    setCorrectAnswers(prev => {
      newCorrectAnswers = prev + 1;
      console.log(`Updated correctAnswers: ${prev} -> ${newCorrectAnswers}`);
      return newCorrectAnswers;
    });
    
    setTotalPoints(prev => prev + points);
    setShowWowEffect(true);
    
    // Check if this was the last question AND if all answers were correct
    const isLastQuestion = (currentIdx: number) => currentIdx + 1 >= questions.length;
    
    // Show celebration effect for a short duration
    setTimeout(() => {
      setShowWowEffect(false);
      
      // CRITICAL: Aggressive state reset before navigation
      console.log("CRITICAL: Resetting all answer state before navigation");
      resetAnswerState();
      
      // Force multiple resets for redundancy
      setTimeout(() => resetAnswerState(), 50);
      setTimeout(() => resetAnswerState(), 100);
      
      console.log("Multiple forced resets applied, current selection state:", null);
      
      // Ensure we completely disable interaction during transition
      document.body.style.pointerEvents = 'none';
      
      // Get current question index value to check if it's the last question
      setCurrentQuestionIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        
        if (isLastQuestion(prevIndex)) {
          // If perfect score (all questions answered correctly)
          if (newCorrectAnswers === questions.length && questions.length > 0) {
            console.log("🎉🎉🎉 PERFECT SCORE after last question!");
            
            // Immediately hide the modal to skip summary screen
            console.log("Immediately hiding modal to prevent summary screen from showing");
            setIsModalOpen(false);
            
            // Mark session as complete for proper cleanup
            setSessionComplete(true);
            
            // Show boom effect immediately without delay
            console.log("Showing boom effect immediately");
            setShowBoomEffect(true);
          } else {
            // Move to completion screen if not perfect score
            console.log("Moving to completion screen (not a perfect score)");
            setSessionComplete(true);
          }
        } else {
          // Not the last question, move to next
          console.log(`Moving to next question (${nextIndex + 1}), CONFIRMED selection state is null`);
        }
        
        // Re-enable pointer events after a significant delay
        setTimeout(() => {
          document.body.style.removeProperty('pointer-events');
          isProcessingRef.current = false;
          console.log("Re-enabled pointer events, processing flag reset");
        }, 800);
        
        return nextIndex;
      });
    }, 1500);
  }, [
    questions,
    setCorrectAnswers,
    setTotalPoints,
    setShowWowEffect,
    setCurrentQuestionIndex,
    setSessionComplete,
    setShowBoomEffect,
    setIsModalOpen,
    resetAnswerState
  ]);

  return { handleCorrectAnswer };
};
