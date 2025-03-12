
import React from 'react';
import { cn } from '@/lib/utils';

interface FeedbackMessageProps {
  isCorrect: boolean;
  points: number;
  timeBetweenQuestions: number;
  answerSubmitted: boolean;
}

const FeedbackMessage = ({ 
  isCorrect, 
  points, 
  timeBetweenQuestions, 
  answerSubmitted 
}: FeedbackMessageProps) => {
  if (!answerSubmitted) return null;
  
  return (
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
          ? `Correct! +${points} points 🎉` 
          : 'Incorrect. The correct answer is highlighted.'}
      </p>
      <p className="text-base mt-2">
        Next question in <span className="font-bold">{timeBetweenQuestions}</span> seconds...
      </p>
    </div>
  );
};

export default FeedbackMessage;
