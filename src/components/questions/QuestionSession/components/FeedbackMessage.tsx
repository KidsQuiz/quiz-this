
import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, AlertTriangle } from 'lucide-react';

interface FeedbackMessageProps {
  isCorrect: boolean;
  points: number;
  answerSubmitted: boolean;
  timeRanOut?: boolean;
}

const FeedbackMessage = ({ 
  isCorrect, 
  points, 
  answerSubmitted,
  timeRanOut = false
}: FeedbackMessageProps) => {
  const { t } = useLanguage();
  
  if (!answerSubmitted) return null;
  
  // Handle time ran out scenario
  if (timeRanOut) {
    return (
      <div className="bg-amber-50 border-2 border-amber-500 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 p-3 rounded-xl text-lg shadow-md animate-fade-in flex items-center gap-2">
        <Clock className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">{t('timeUp') || "Time's up!"}</p>
          <p className="text-sm">{t('correctAnswerShown') || "The correct answer is highlighted. Next question in 5 seconds..."}</p>
        </div>
      </div>
    );
  }
  
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
          ? t('correctFeedback').replace('{points}', points.toString())
          : t('incorrectFeedback')}
      </p>
    </div>
  );
};

export default FeedbackMessage;
