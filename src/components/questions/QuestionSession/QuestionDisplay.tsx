
import React, { useEffect, useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

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
  const [showRelaxAnimation, setShowRelaxAnimation] = useState(false);
  
  // Play sound effect when answer is submitted or time runs out
  useEffect(() => {
    if (answerSubmitted) {
      // If time ran out (no selection made) play the incorrect sound
      if (selectedAnswerId === null && timeRemaining === 0) {
        playSound('incorrect');
        setShowRelaxAnimation(true);
      } else if (selectedAnswerId !== null) {
        if (isCorrect) {
          playSound('correct');
        } else {
          playSound('incorrect');
          setShowRelaxAnimation(true);
        }
      }
    }
  }, [answerSubmitted, isCorrect, selectedAnswerId, timeRemaining]);

  // Reset relax animation after a delay
  useEffect(() => {
    if (showRelaxAnimation) {
      const timer = setTimeout(() => {
        setShowRelaxAnimation(false);
      }, 4000); // Show for 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [showRelaxAnimation]);

  // Check if time ran out
  const timeRanOut = timeRemaining === 0 && answerSubmitted && selectedAnswerId === null;

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
                    {timeRanOut ? (
                      <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-red-500" />
                        <p className="text-red-700 dark:text-red-400 font-medium">Time's up! Moving to next question...</p>
                      </div>
                    ) : (
                      <FeedbackMessage 
                        isCorrect={isCorrect}
                        points={currentQuestion.points}
                        answerSubmitted={answerSubmitted}
                      />
                    )}
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
      
      {/* Show relaxing animation when answer is incorrect */}
      <RelaxAnimation show={showRelaxAnimation} />
    </div>
  );
};

export default QuestionDisplay;
