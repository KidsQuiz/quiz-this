
import React from 'react';
import { cn } from '@/lib/utils';

interface FeedbackMessageProps {
  isCorrect: boolean;
  points: number;
  answerSubmitted: boolean;
}

const FeedbackMessage = ({ 
  isCorrect, 
  points, 
  answerSubmitted 
}: FeedbackMessageProps) => {
  if (!answerSubmitted) return null;
  
  return (
    <div 
      className={cn(
        "p-3 rounded-xl text-lg shadow-md border-2 animate-fade-in",
        isCorrect 
          ? "bg-green-50 border-green-500 text-green-800 dark:bg-green-950/30 dark:text-green-300" 
          : "bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300"
      )}
    >
      <p className="font-medium text-lg text-center">
        {isCorrect 
          ? `Correct! +${points} points 🎉` 
          : 'Incorrect. The correct answer is highlighted.'}
      </p>
    </div>
  );
};

export default FeedbackMessage;
