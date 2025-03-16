
import { useState } from 'react';
import { AnswerOption, Question } from '@/hooks/questionsTypes';
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
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);

  // Handle answer selection
  const handleSelectAnswer = async (answerId: string) => {
    // Skip if answer already submitted
    if (answerSubmitted) {
      console.log("Answer already submitted, ignoring selection");
      return false;
    }
    
    console.log(`Answer selected: ${answerId}`);
    
    // Immediately stop the timer when an answer is selected
    setTimerActive(false);
    
    // Update state to reflect selection
    setSelectedAnswerId(answerId);
    setAnswerSubmitted(true);
    
    // Find if the selected answer is correct
    const selectedAnswer = answerOptions.find(option => option.id === answerId);
    const wasCorrect = selectedAnswer?.is_correct || false;
    setIsCorrect(wasCorrect);
    
    // Update scores
    if (wasCorrect && currentQuestion) {
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
        
        // Get current question index value to check if it's the last question
        setCurrentQuestionIndex(prevIndex => {
          if (isLastQuestion(prevIndex)) {
            // If perfect score (all questions answered correctly)
            if (newCorrectAnswers === questions.length) {
              console.log("🎉🎉🎉 PERFECT SCORE after last question! Adding delay before showing boom effect");
              setSessionComplete(true);
              
              // Add a 2-second delay before showing the boom effect
              setTimeout(() => {
                console.log("Showing boom effect after 2-second delay");
                setShowBoomEffect(true);
              }, 2000);
              
              // Dialog will close automatically in useSessionCompletion
            } else {
              // Move to completion screen if not perfect score
              return prevIndex + 1;
            }
          } else {
            // Not the last question, move to next
            return prevIndex + 1;
          }
          return prevIndex;
        });
      }, 1500);
    } else {
      // Play incorrect sound effect
      playSound('incorrect');
      
      // Show the relaxing animation directly in the question dialog
      setShowRelaxAnimation(true);
      
      // Wait 5 seconds before moving to next question
      setTimeout(() => {
        setShowRelaxAnimation(false);
        setCurrentQuestionIndex(prev => prev + 1);
      }, 5000);
    }
    
    return wasCorrect;
  };

  return {
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showRelaxAnimation,
    setSelectedAnswerId,
    setAnswerSubmitted,
    setIsCorrect,
    setShowRelaxAnimation,
    handleSelectAnswer
  };
};
