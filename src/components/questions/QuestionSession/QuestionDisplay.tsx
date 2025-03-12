
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';

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
  return (
    <>
      <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl">Question {currentQuestionIndex + 1}/{questionsTotal}</DialogTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-lg">{timeRemaining}s</span>
          </div>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <Progress value={(timeRemaining / currentQuestion.time_limit) * 100} className="h-2" />
        
        <div className="bg-primary/10 p-6 rounded-lg relative">
          <p className="text-xl font-medium">{currentQuestion.content}</p>
          <div className="flex items-center gap-2 mt-3">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-base font-medium text-primary">{currentQuestion.points} points</span>
          </div>
          
          {showWowEffect && (
            <div className="absolute inset-0 flex items-center justify-center animate-enter">
              <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse"></div>
              <Sparkles className="h-20 w-20 text-primary animate-bounce" />
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {answerOptions.map(option => (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={answerSubmitted}
              className={`w-full p-4 text-left rounded-lg border text-lg transition-all ${
                answerSubmitted && option.is_correct 
                  ? 'bg-green-100 border-green-500' 
                  : answerSubmitted && selectedAnswerId === option.id && !option.is_correct
                    ? 'bg-red-100 border-red-500'
                    : selectedAnswerId === option.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-accent border-input'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option.content}</span>
                {answerSubmitted && option.is_correct && (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                )}
                {answerSubmitted && selectedAnswerId === option.id && !option.is_correct && (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {answerSubmitted && (
          <div className={`p-4 rounded-lg text-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-medium">
              {isCorrect 
                ? 'Correct! +' + currentQuestion.points + ' points'
                : 'Incorrect. The correct answer is highlighted.'}
            </p>
            <p className="text-base mt-1">
              Next question in {timeBetweenQuestions} seconds...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionDisplay;
