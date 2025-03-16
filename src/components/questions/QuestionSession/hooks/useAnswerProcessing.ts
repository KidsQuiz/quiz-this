
import { useState, useCallback } from 'react';
import { AnswerOption, Question } from '@/hooks/questionsTypes';
import { supabase } from '@/integrations/supabase/client';
import { playSound } from '@/utils/soundEffects';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useAnswerProcessing = (
  kidId: string,
  currentQuestion: Question | null,
  answerOptions: AnswerOption[],
  questions: Question[],
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>,
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>,
  setShowWowEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setShowBoomEffect: React.Dispatch<React.SetStateAction<boolean>>,
  setSessionComplete: React.Dispatch<React.SetStateAction<boolean>>,
  setKidAnswers: React.Dispatch<React.SetStateAction<KidAnswer[]>>
) => {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);

  // Define a reusable function to reset all answer-related state
  const resetAnswerState = useCallback(() => {
    console.log("Explicitly resetting answer state");
    setSelectedAnswerId(null);
    setAnswerSubmitted(false);
    setIsCorrect(false);
  }, [setSelectedAnswerId, setAnswerSubmitted, setIsCorrect]);

  // Handle answer selection
  const handleSelectAnswer = async (answerId: string) => {
    if (answerSubmitted || !currentQuestion) return;
    
    console.log(`Answer selected: ${answerId}`);
    setSelectedAnswerId(answerId);
    setAnswerSubmitted(true);
    
    // Find if the selected answer is correct
    const selectedAnswer = answerOptions.find(option => option.id === answerId);
    const wasCorrect = selectedAnswer?.is_correct || false;
    setIsCorrect(wasCorrect);
    
    // Record the answer in the database
    try {
      // Create a new answer record
      const newAnswer: KidAnswer = {
        questionId: currentQuestion.id,
        answerId: answerId,
        isCorrect: wasCorrect,
        points: wasCorrect ? currentQuestion.points : 0,
        timestamp: new Date()
      };
      
      // Add to local state
      setKidAnswers(prev => [...prev, newAnswer]);
      
      // Record in database if not correct (for analytics of wrong answers)
      if (!wasCorrect) {
        const selectedAnswerContent = selectedAnswer?.content || "";
        const correctAnswer = answerOptions.find(a => a.is_correct)?.content || "";
        
        await supabase.from('kid_wrong_answers').insert({
          kid_id: kidId,
          question_id: currentQuestion.id,
          answer_id: answerId,
          question_content: currentQuestion.content,
          answer_content: selectedAnswerContent,
          correct_answer_content: correctAnswer,
          created_at: new Date().toISOString()
        });
      } else {
        // Log correct answer for debugging
        console.log(`Recording answer for question ${currentQuestion.id}: Correct, points: ${currentQuestion.points}`);
      }
      
      console.log(`Answer recorded in database for kid ${kidId}`);
    } catch (error) {
      console.error('Error recording answer:', error);
    }
    
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
        
        // First reset answer state before any other operations
        resetAnswerState();
        
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
              
              // Dialog will close automatically in useSessionCompletion
            } else {
              // Move to completion screen if not perfect score
              return prevIndex + 1;
            }
          } else {
            // Not the last question, move to next
            setIsModalOpen(false); // Close this question to advance to next
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
        // First reset answer state
        resetAnswerState();
        
        setShowRelaxAnimation(false);
        setIsModalOpen(false); // Close this question to advance to next
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
    handleSelectAnswer,
    resetAnswerState // Export the reset function for use elsewhere
  };
};
