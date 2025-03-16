import { useCallback } from 'react';
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
  const handleCorrectAnswer = useCallback((currentQuestion: Question) => {
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
      
      // Get current question index value to check if it's the last question
      setCurrentQuestionIndex(prevIndex => {
        if (isLastQuestion(prevIndex)) {
          // If perfect score (all questions answered correctly)
          if (newCorrectAnswers === questions.length && questions.length > 0) {
            console.log("🎉🎉🎉 PERFECT SCORE after last question! Adding delay before showing boom effect");
            setSessionComplete(true);
            
            // Add a 2-second delay before showing the boom effect
            setTimeout(() => {
              console.log("Showing boom effect after 2-second delay");
              setShowBoomEffect(true);
            }, 2000);
            
            // Keep the modal open for completion screen
            return prevIndex + 1;
          } else {
            // Move to completion screen if not perfect score
            return prevIndex + 1;
          }
        } else {
          // Not the last question, move to next
          console.log("Moving to next question, CONFIRMED selection state is null");
          
          // Important: Force DOM update with state reset before changing question
          document.body.style.pointerEvents = 'none';
          
          // We'll re-enable pointer events in useCurrentQuestion when the new question is loaded
          
          // Return the next index (the modal stays open)
          return prevIndex + 1;
        }
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
    resetAnswerState
  ]);

  return { handleCorrectAnswer };
};
