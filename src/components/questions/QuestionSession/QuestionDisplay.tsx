
import React, { useEffect } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { playSound } from '@/utils/soundEffects';

// Import the new component files
import ProgressTimer from './components/ProgressTimer';
import QuestionCard from './components/QuestionCard';
import CelebrationEffect from './components/CelebrationEffect';
import AnswerOptionsList from './components/AnswerOptionsList';
import FeedbackMessage from './components/FeedbackMessage';
import AnimationStyles from './components/AnimationStyles';

interface QuestionDisplayProps {
  currentQuestion: Question;
  answerOptions: AnswerOption[];
  currentQuestionIndex: number;
  questionsTotal: number;
  timeRemaining: number;
  answerSubmitted: boolean;
  selectedAnswerId: string | null;
  isCorrect: boolean;
  showWowEffect: boolean;
  timeBetweenQuestions: number;
  handleSelectAnswer: (answerId: string) => void;
}

const QuestionDisplay = ({
  currentQuestion,
  answerOptions,
  currentQuestionIndex,
  questionsTotal,
  timeRemaining,
  answerSubmitted,
  selectedAnswerId,
  isCorrect,
  showWowEffect,
  timeBetweenQuestions,
  handleSelectAnswer
}: QuestionDisplayProps) => {
  // Play sound effect when answer is submitted
  useEffect(() => {
    if (answerSubmitted) {
      playSound(isCorrect ? 'correct' : 'incorrect');
    }
  }, [answerSubmitted, isCorrect]);

  return (
    <>
      <DialogHeader className="mb-2">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold">
            Question {currentQuestionIndex + 1}/{questionsTotal}
          </DialogTitle>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <ProgressTimer 
          timeRemaining={timeRemaining} 
          timeLimit={currentQuestion.time_limit} 
        />
        
        <QuestionCard question={currentQuestion} showWowEffect={showWowEffect}>
          <CelebrationEffect 
            showEffect={showWowEffect} 
            points={currentQuestion.points} 
          />
        </QuestionCard>
        
        <AnswerOptionsList 
          answerOptions={answerOptions}
          selectedAnswerId={selectedAnswerId}
          answerSubmitted={answerSubmitted}
          handleSelectAnswer={handleSelectAnswer}
        />
        
        <FeedbackMessage 
          isCorrect={isCorrect}
          points={currentQuestion.points}
          timeBetweenQuestions={timeBetweenQuestions}
          answerSubmitted={answerSubmitted}
        />
      </div>
      
      <AnimationStyles />
    </>
  );
};

export default QuestionDisplay;
