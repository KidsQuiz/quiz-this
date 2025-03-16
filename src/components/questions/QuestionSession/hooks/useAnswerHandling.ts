
import { useCallback } from 'react';
import { AnswerOption } from '@/hooks/questionsTypes';
import { Question } from '@/hooks/questionsTypes';
import { useAnswerState } from './useAnswerState';
import { useVisualEffectsState } from './useVisualEffectsState';
import { playSound } from '@/utils/soundEffects';

export const useAnswerHandling = (
  answerOptions: AnswerOption[],
  currentQuestion: Question | null,
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  questions: Question[],
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Get answer state from our hook
  const {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    resetAnswerSelectionState
  } = useAnswerState();

  // Get visual effects state from our hook
  const {
    showRelaxAnimation,
    setShowRelaxAnimation,
    resetVisualEffects
  } = useVisualEffectsState();

  // Combined reset function
  const resetAnswerState = () => {
    resetAnswerSelectionState();
    resetVisualEffects();
  };

  // Handle selecting an answer
  const handleSelectAnswer = useCallback((answerId: string) => {
    console.log("Answer selected:", answerId);
    
    // If answer already submitted, do nothing
    if (answerSubmitted) {
      console.log("Answer already submitted, ignoring selection");
      return;
    }
    
    // Set the selected answer
    setSelectedAnswerId(answerId);
    
    // Find the selected answer option
    const selectedOption = answerOptions.find(option => option.id === answerId);
    if (!selectedOption) {
      console.error("Selected answer not found:", answerId);
      return;
    }
    
    // Mark the answer as submitted
    setAnswerSubmitted(true);
    
    // Stop the timer
    setTimerActive(false);
    
    // Check if the answer is correct
    const isAnswerCorrect = selectedOption.is_correct;
    setIsCorrect(isAnswerCorrect);
    
    // Play the appropriate sound
    if (isAnswerCorrect) {
      playSound('correct');
      
      // Update correct answers count and points
      setCorrectAnswers(prev => prev + 1);
      
      // Add points for this question
      if (currentQuestion) {
        setTotalPoints(prev => prev + currentQuestion.points);
      }
      
      // Show the wow effect
      setShowWowEffect(true);
    } else {
      playSound('incorrect');
      // Show relax animation for incorrect answers
      setShowRelaxAnimation(true);
    }
    
    // Automatically proceed to the next question after a delay
    setTimeout(() => {
      // Hide effects
      setShowWowEffect(false);
      setShowRelaxAnimation(false);
      
      // Move to the next question
      setCurrentQuestionIndex(prevIndex => {
        const next = prevIndex + 1;
        
        // Check if we've reached the end
        if (next >= questions.length) {
          console.log("Session complete!");
          setSessionComplete(true);
          setShowBoomEffect(true);
          return prevIndex; // Keep the same index
        }
        
        // Move to next question
        return next;
      });
      
      // Reset the answer state for the next question
      resetAnswerState();
      
      // Only restart the timer if we're not at the end
      setCurrentQuestionIndex(prevIndex => {
        const isLastQuestion = (index: number) => (index + 1) >= questions.length;
        if (!isLastQuestion(prevIndex)) {
          // We need to use setTimeout here because setState doesn't happen immediately
          setTimeout(() => setTimerActive(true), 0);
        }
        return prevIndex; // Don't change the index, just check it
      });
      
    }, 2500); // Wait 2.5 seconds before advancing
    
  }, [
    answerOptions, 
    answerSubmitted, 
    currentQuestion, 
    questions.length, 
    resetAnswerState, 
    setAnswerSubmitted, 
    setCorrectAnswers, 
    setCurrentQuestionIndex, 
    setIsCorrect, 
    setSelectedAnswerId, 
    setSessionComplete, 
    setShowBoomEffect, 
    setShowRelaxAnimation,
    setShowWowEffect, 
    setTimerActive, 
    setTotalPoints
  ]);

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setAnswerSubmitted,
    setSelectedAnswerId,
    setIsCorrect,
    resetAnswerState,
    handleSelectAnswer
  };
};
