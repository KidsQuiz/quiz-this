
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useMilestonesData } from '@/hooks/useMilestonesData';
import KidActions from './KidActions';
import KidToolbar from './KidToolbar';
import KidProfile from './KidProfile';
import KidMilestone from './KidMilestone';
import StartQuestionButton from './StartQuestionButton';

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
  }, [id, fetchMilestones]);
  
  useEffect(() => {
    if (milestones.length > 0) {
      setCurrentMilestone(getCurrentMilestone(points));
      setNextMilestone(getNextMilestone(points));
      setProgressPercentage(getMilestoneProgress(points));
    }
  }, [milestones, points, getCurrentMilestone, getNextMilestone, getMilestoneProgress]);
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md relative">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex justify-between items-center w-full">
            <KidToolbar 
              id={id}
              name={name}
              points={points}
              packageCount={packageCount}
              onAssignPackages={onAssignPackages}
              onManageMilestones={onManageMilestones}
            />
            
            <KidActions
              id={id}
              name={name}
              onEdit={onEdit}
              onDelete={onDelete}
              onResetPoints={onResetPoints}
            />
          </div>
          
          <KidProfile
            name={name}
            age={age}
            avatarUrl={avatarUrl}
            points={points}
          />
          
          {milestones.length > 0 ? (
            <div className="w-full mt-4 border-t pt-3">
              {currentMilestone && (
                <KidMilestone
                  currentMilestone={currentMilestone}
                  nextMilestone={nextMilestone}
                  points={points}
                  progressPercentage={progressPercentage}
                />
              )}
            </div>
          ) : (
            <div className="w-full mt-4 border-t pt-3 text-sm text-muted-foreground">
              No milestones available
            </div>
          )}
          
          {onStartQuestions && (
            <StartQuestionButton 
              id={id} 
              name={name}
              packageCount={packageCount}
              onStartQuestions={onStartQuestions}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default KidCard;
