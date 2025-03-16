
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
import RelaxAnimation from './components/RelaxAnimation';
import TimeUpFeedback from './components/TimeUpFeedback';
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
  showRelaxAnimation: boolean;
  handleSelectAnswer: (answerId: string) => void;
  isTimeUp?: boolean;
  showingTimeUpFeedback?: boolean;
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
  showRelaxAnimation,
  handleSelectAnswer,
  isTimeUp = false,
  showingTimeUpFeedback = false
}: QuestionDisplayProps) => {
  // Play sound effect when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && !isCorrect && !showWowEffect) {
      console.log('Playing incorrect sound due to time expiration');
      playSound('incorrect');
    }
  }, [timeRemaining, isCorrect, showWowEffect]);

  // Check if time ran out - the key check for triggering feedback
  const timeRanOut = timeRemaining === 0 && answerSubmitted;
  
  // Log for debugging
  useEffect(() => {
    if (timeRanOut) {
      console.log('Time ran out state detected in QuestionDisplay');
      console.log(`Current question index: ${currentQuestionIndex}, question: ${currentQuestion.id}`);
      console.log('Timer status:', { timeRemaining, answerSubmitted, isCorrect });
    }
  }, [timeRanOut, currentQuestionIndex, currentQuestion.id, timeRemaining, answerSubmitted, isCorrect]);

  // Additional logging for index tracking (for debugging)
  useEffect(() => {
    console.log(`QuestionDisplay rendering - question index: ${currentQuestionIndex}, total questions: ${questionsTotal}`);
    console.log(`Question ID: ${currentQuestion.id}, Time limit: ${currentQuestion.time_limit}`);
  }, [currentQuestionIndex, questionsTotal, currentQuestion]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DialogHeader className="mb-4 flex-shrink-0 p-6">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-3xl font-bold">
            Question {currentQuestionIndex + 1}/{questionsTotal}
          </DialogTitle>
        </div>
      </DialogHeader>
      
      <Card className="flex-grow flex flex-col overflow-hidden mx-6 mb-6">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex flex-col h-full gap-6">
            <ProgressTimer 
              timeRemaining={timeRemaining} 
              timeLimit={currentQuestion.time_limit} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow overflow-hidden">
              <div className="md:col-span-5 flex flex-col">
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
                      timeRanOut={isTimeUp}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-7">
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
      
      {/* Show time-up feedback when needed */}
      {showingTimeUpFeedback && (
        <TimeUpFeedback show={showingTimeUpFeedback} />
      )}
      
      <AnimationStyles />
      
      {/* Show relaxing animation directly in the dialog when answer is incorrect */}
      <RelaxAnimation show={showRelaxAnimation} />
    </div>
  );
};

export default QuestionDisplay;
