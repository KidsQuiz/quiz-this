
import React from 'react';
import { Trophy, ArrowRight, Star } from 'lucide-react';
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
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold">{points}</span>
              <span className="text-[10px] text-muted-foreground">{t('points')}</span>
            </div>
            
            <div className="flex-1 mx-2 relative">
              <Progress 
                value={progressPercentage} 
                className="h-2.5 bg-gray-200" 
                indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-500"
              />
              {progressPercentage > 0 && progressPercentage < 100 && (
                <div 
                  className="absolute top-0 left-0 flex items-center justify-center"
                  style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
                >
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 mt-[-8px]" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold">{nextMilestone.points_required}</span>
              <span className="text-[10px] text-muted-foreground">{t('points')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <span>{t('milestones')}:</span>
            <div className="flex items-center">
              <span className="font-medium">{nextMilestone.name}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 text-primary" />
            </div>
            <span className="font-medium text-primary">
              {nextMilestone.points_required - points} {t('points')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KidMilestone;
