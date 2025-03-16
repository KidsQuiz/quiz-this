
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
  const [progressValue, setProgressValue] = useState(0);
  
  // Progress animation for the 5-second delay before advancing to next question
  useEffect(() => {
    if (!answerSubmitted) return;
    
    // For incorrect answers or time running out, show progress
    if (!isCorrect || timeRanOut) {
      // Reset progress
      setProgressValue(0);
      
      // Animate progress over 5 seconds (same as the timeout duration)
      const startTime = Date.now();
      const duration = 5000; // 5 seconds, matching the timeout in useTimeoutEffects
      
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / duration) * 100);
        
        setProgressValue(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(progressInterval);
        }
      }, 50); // Update frequently for smooth animation
      
      return () => clearInterval(progressInterval);
    }
  }, [answerSubmitted, isCorrect, timeRanOut]);
  
  if (!answerSubmitted) return null;
  
  // Handle time ran out scenario
  if (timeRanOut) {
    return (
      <div className="bg-amber-50 border-2 border-amber-500 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300 p-3 rounded-xl text-lg shadow-md animate-fade-in flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">{t('timeUp') || "Time's up!"}</p>
            <p className="text-sm">{t('correctAnswerShown') || "The correct answer is highlighted."}</p>
          </div>
        </div>
        <Progress 
          value={progressValue} 
          className="h-2 w-full"
          indicatorClassName="bg-amber-500"
        />
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "p-3 rounded-xl text-lg shadow-md border-2 animate-fade-in flex flex-col gap-2",
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
      
      {/* Only show progress for incorrect answers */}
      {!isCorrect && (
        <Progress 
          value={progressValue} 
          className="h-2 w-full"
          indicatorClassName="bg-red-500"
        />
      )}
    </div>
  );
};

export default FeedbackMessage;
