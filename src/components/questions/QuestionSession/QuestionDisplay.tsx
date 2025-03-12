
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
import { Card, CardContent } from '@/components/ui/card';

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
  handleSelectAnswer
}: QuestionDisplayProps) => {
  // Play sound effect when answer is submitted
  useEffect(() => {
    if (answerSubmitted) {
      playSound(isCorrect ? 'correct' : 'incorrect');
    }
  }, [answerSubmitted, isCorrect]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DialogHeader className="mb-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-3xl font-bold">
            Question {currentQuestionIndex + 1}/{questionsTotal}
          </DialogTitle>
        </div>
      </DialogHeader>
      
      <Card className="flex-grow flex flex-col overflow-hidden mb-2">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex flex-col h-full gap-4">
            <ProgressTimer 
              timeRemaining={timeRemaining} 
              timeLimit={currentQuestion.time_limit} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-grow overflow-hidden">
              <div className="md:col-span-2 flex flex-col">
                <QuestionCard question={currentQuestion} showWowEffect={showWowEffect}>
                  <CelebrationEffect 
                    showEffect={showWowEffect} 
                    points={currentQuestion.points} 
                  />
                </QuestionCard>
                
                {answerSubmitted && (
                  <div className="mt-4">
                    <FeedbackMessage 
                      isCorrect={isCorrect}
                      points={currentQuestion.points}
                      answerSubmitted={answerSubmitted}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3">
                <AnswerOptionsList 
                  answerOptions={answerOptions}
                  selectedAnswerId={selectedAnswerId}
                  answerSubmitted={answerSubmitted}
                  handleSelectAnswer={handleSelectAnswer}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AnimationStyles />
    </div>
  );
};

export default QuestionDisplay;
