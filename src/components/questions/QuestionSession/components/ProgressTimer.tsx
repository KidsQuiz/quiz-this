
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressTimerProps {
  timeRemaining: number;
  timeLimit: number;
}

const ProgressTimer = ({ timeRemaining, timeLimit }: ProgressTimerProps) => {
  // Calculate progress percentage with boundaries
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / timeLimit) * 100));
  
  // Determine progress color based on remaining time
  const progressColor = progressPercent > 50 
    ? "bg-green-500" 
    : progressPercent > 20 
      ? "bg-amber-500" 
      : "bg-red-500";

  return (
    <div className="space-y-6">
      <Progress 
        value={progressPercent} 
        className={cn("h-3 rounded-full transition-all", progressColor)} 
      />
      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full float-right">
        <Clock className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg text-primary">{timeRemaining}s</span>
      </div>
    </div>
  );
};

export default ProgressTimer;
