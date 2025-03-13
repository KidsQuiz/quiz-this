
import React from 'react';
import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface KidMilestoneProps {
  currentMilestone: any;
  nextMilestone: any;
  points: number;
  progressPercentage: number;
}

const KidMilestone = ({ 
  currentMilestone, 
  nextMilestone, 
  points, 
  progressPercentage 
}: KidMilestoneProps) => {
  const { t } = useLanguage();
  
  if (!currentMilestone) return null;
  
  return (
    <div className="mt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-help">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium">{currentMilestone.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('currentMilestone')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {nextMilestone && (
        <div className="mt-2 space-y-1 px-4">
          <div className="flex justify-between text-xs">
            <span>{points}</span>
            <span>{nextMilestone.points_required}</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {nextMilestone.points_required - points} {t('pointsToNextMilestone')}
          </p>
        </div>
      )}
    </div>
  );
};

export default KidMilestone;
