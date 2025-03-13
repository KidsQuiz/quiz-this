
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Avatar from './Avatar';
import { Baby, Edit, Trash2, MoreVertical, Star, Package, PlayCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { useMilestonesData } from '@/hooks/useMilestonesData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface KidCardProps {
  id: string;
  name: string;
  age: number;
  avatarUrl: string | null;
  points: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAssignPackages?: (id: string, name: string) => void;
  onStartQuestions?: (id: string, name: string) => void;
  onResetPoints?: (id: string, name: string) => void;
  onManageMilestones?: (id: string, name: string, points: number) => void;
}

const KidCard = ({ 
  id, 
  name, 
  age, 
  avatarUrl, 
  points, 
  onEdit, 
  onDelete, 
  onAssignPackages,
  onStartQuestions,
  onResetPoints,
  onManageMilestones
}: KidCardProps) => {
  const { t } = useLanguage();
  const [packageCount, setPackageCount] = useState<number>(0);
  const { 
    milestones, 
    getCurrentMilestone, 
    getNextMilestone, 
    getMilestoneProgress, 
    fetchMilestones 
  } = useMilestonesData(id);
  
  const [currentMilestone, setCurrentMilestone] = useState<any>(null);
  const [nextMilestone, setNextMilestone] = useState<any>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  // Fetch assigned package count when component mounts
  useEffect(() => {
    const fetchPackageCount = async () => {
      try {
        const { count, error } = await supabase
          .from('kid_packages')
          .select('*', { count: 'exact', head: true })
          .eq('kid_id', id);
          
        if (error) throw error;
        setPackageCount(count || 0);
      } catch (error) {
        console.error('Error fetching package count:', error);
        setPackageCount(0);
      }
    };
    
    fetchPackageCount();
    fetchMilestones();
  }, [id]);
  
  // Update milestone information when milestones or points change
  useEffect(() => {
    if (milestones.length > 0) {
      setCurrentMilestone(getCurrentMilestone(points));
      setNextMilestone(getNextMilestone(points));
      setProgressPercentage(getMilestoneProgress(points));
    }
  }, [milestones, points]);
  
  return (
    <Card className="overflow-hidden transition-colors hover:shadow-md relative">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="self-stretch flex justify-end items-center mb-4 gap-2">
            {/* Start Questions Mini Button - Only show if packages assigned */}
            {onStartQuestions && packageCount > 0 && (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full bg-background text-primary hover:bg-accent flex items-center justify-center"
                onClick={() => onStartQuestions(id, name)}
                title={t('startSession')}
              >
                <PlayCircle className="h-4 w-4" />
                <span className="sr-only">{t('startSession')}</span>
              </Button>
            )}
            
            {/* Package Selection Button - Now second position */}
            {onAssignPackages && (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full bg-background hover:bg-accent flex items-center justify-center relative"
                onClick={() => onAssignPackages(id, name)}
                title={t('assignPackages')}
              >
                <Package className="h-4 w-4 text-primary" />
                {packageCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center text-[10px] px-1 py-0"
                  >
                    {packageCount}
                  </Badge>
                )}
                <span className="sr-only">{t('assignPackages')}</span>
              </Button>
            )}
            
            {/* Milestones Button */}
            {onManageMilestones && (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 p-0 rounded-full bg-background hover:bg-accent flex items-center justify-center"
                onClick={() => onManageMilestones(id, name, points)}
                title={t('manageMilestones')}
              >
                <Trophy className="h-4 w-4 text-primary" />
                <span className="sr-only">{t('manageMilestones')}</span>
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-full hover:bg-accent flex items-center justify-center focus:outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>{t('edit')}</span>
                </DropdownMenuItem>
                
                {onResetPoints && (
                  <DropdownMenuItem 
                    onClick={() => onResetPoints(id, name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>{t('resetPoints')}</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onDelete(id)}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t('delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mb-4">
            {avatarUrl ? (
              <Avatar 
                src={avatarUrl} 
                alt={name} 
                size="lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{age} {t('age')}</p>
            
            <div className="mt-4 bg-primary/10 rounded-full py-2 px-4 inline-flex items-center justify-center gap-1.5 transform transition-all hover:scale-105">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold text-primary">{points} {t('points')}</span>
            </div>
            
            {/* Milestone Section */}
            {currentMilestone && (
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
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KidCard;
