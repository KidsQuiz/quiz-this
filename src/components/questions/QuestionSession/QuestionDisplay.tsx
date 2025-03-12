
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { cn } from '@/lib/utils';

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
  // Calculate progress percentage with boundaries
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / currentQuestion.time_limit) * 100));
  
  // Determine progress color based on remaining time
  const progressColor = progressPercent > 50 
    ? "bg-green-500" 
    : progressPercent > 20 
      ? "bg-amber-500" 
      : "bg-red-500";

  return (
    <>
      <DialogHeader className="mb-2">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold">Question {currentQuestionIndex + 1}/{questionsTotal}</DialogTitle>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-primary">{timeRemaining}s</span>
          </div>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <Progress 
          value={progressPercent} 
          className={cn("h-3 rounded-full transition-all", progressColor)} 
        />
        
        <div className="bg-gradient-to-r from-primary/15 to-primary/5 p-8 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-2xl font-medium leading-relaxed">{currentQuestion.content}</p>
          <div className="flex items-center gap-2 mt-4 bg-white/50 dark:bg-black/20 w-fit px-3 py-1.5 rounded-full">
            <Star className="h-5 w-5 text-amber-500" fill="#f59e0b" />
            <span className="text-base font-bold text-primary">{currentQuestion.points} points</span>
          </div>
          
          {showWowEffect && (
            <div className="absolute inset-0 flex items-center justify-center z-10 animate-enter">
              <div className="absolute inset-0 bg-primary/5 rounded-lg animate-pulse"></div>
              <div className="relative z-20 flex flex-col items-center">
                <Sparkles className="h-28 w-28 text-amber-500 animate-bounce" />
                <span className="text-2xl font-bold text-primary mt-2 animate-pulse-soft">Correct!</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mt-6">
          {answerOptions.map(option => {
            // Determine styling based on answer state
            const isSelected = selectedAnswerId === option.id;
            const isCorrectAnswer = option.is_correct;
            const isIncorrectSelection = answerSubmitted && isSelected && !isCorrectAnswer;
            
            let answerClasses = cn(
              "w-full p-5 text-left rounded-xl border-2 text-lg transition-all",
              isSelected && !answerSubmitted && "border-primary bg-primary/10 shadow-md",
              answerSubmitted && isCorrectAnswer && "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md",
              isIncorrectSelection && "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md",
              !isSelected && !answerSubmitted && "hover:bg-accent hover:border-accent/50 hover:shadow-md",
              answerSubmitted ? "cursor-default" : "cursor-pointer"
            );
            
            return (
              <button
                key={option.id}
                onClick={() => !answerSubmitted && handleSelectAnswer(option.id)}
                disabled={answerSubmitted}
                className={answerClasses}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{option.content}</span>
                  {answerSubmitted && isCorrectAnswer && (
                    <CheckCircle className="h-7 w-7 text-green-600" fill="#dcfce7" />
                  )}
                  {isIncorrectSelection && (
                    <XCircle className="h-7 w-7 text-red-600" fill="#fee2e2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {answerSubmitted && (
          <div 
            className={cn(
              "p-5 rounded-xl text-lg shadow-md border-2 animate-fade-in",
              isCorrect 
                ? "bg-green-50 border-green-500 text-green-800 dark:bg-green-950/30 dark:text-green-300" 
                : "bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300"
            )}
          >
            <p className="font-medium text-xl">
              {isCorrect 
                ? `Correct! +${currentQuestion.points} points 🎉` 
                : 'Incorrect. The correct answer is highlighted.'}
            </p>
            <p className="text-base mt-2">
              Next question in <span className="font-bold">{timeBetweenQuestions}</span> seconds...
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionDisplay;
