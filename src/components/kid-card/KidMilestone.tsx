
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
    <div className="mt-4 w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-2 cursor-help">
              <Trophy className="h-5 w-5 text-amber-500" />
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
            <span>{points} {t('points')}</span>
            <span>{nextMilestone.points_required} {t('points')}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {nextMilestone.points_required - points} {t('pointsToNextMilestone')}:&nbsp;
            <span className="font-medium">{nextMilestone.name}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default KidMilestone;
