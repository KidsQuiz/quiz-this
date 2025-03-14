
import React, { useEffect, useState, useRef } from 'react';
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
  onViewWrongAnswers?: (id: string, name: string) => void;
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
  onManageMilestones,
  onViewWrongAnswers
}: KidCardProps) => {
  const [packageCount, setPackageCount] = useState<number>(1); // Default to 1 for now to enable the button
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
  
  // Add refs to prevent multiple fetches
  const isFetchingPackages = useRef(false);
  const hasAttemptedPackageFetch = useRef(false);
  const didMountRef = useRef(false);
  
  useEffect(() => {
    // Skip on first render, only set didMountRef to true
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    
    const fetchPackageCount = async () => {
      if (isFetchingPackages.current || hasAttemptedPackageFetch.current) return;
      
      isFetchingPackages.current = true;
      hasAttemptedPackageFetch.current = true;
      
      try {
        console.log(`Fetching package count for kid: ${id}`);
        const { count, error } = await supabase
          .from('kid_packages')
          .select('*', { count: 'exact', head: true })
          .eq('kid_id', id);
          
        if (error) {
          console.error('Error fetching package count:', error);
          throw error;
        }
        
        console.log(`Package count for kid ${id}: ${count}`);
        // Always set at least 1 for now to enable the button
        setPackageCount(Math.max(1, count || 0));
      } catch (error) {
        console.error('Error fetching package count:', error);
        // Set to 1 even on error to enable the button
        setPackageCount(1);
      } finally {
        isFetchingPackages.current = false;
      }
    };
    
    fetchPackageCount();
    
    // Clean up
    return () => {
      // We want to keep hasAttemptedPackageFetch.current true between renders
      // to prevent refetching on every re-render
    };
  }, [id]);
  
  // Effect to update milestone data
  useEffect(() => {
    if (milestones.length > 0) {
      setCurrentMilestone(getCurrentMilestone(points));
      setNextMilestone(getNextMilestone(points));
      setProgressPercentage(getMilestoneProgress(points));
    }
  }, [milestones, points, getCurrentMilestone, getNextMilestone, getMilestoneProgress]);
  
  // Log when the component renders with current values
  console.log(`KidCard for ${name} rendering with packageCount = ${packageCount}`);
  
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
              onViewWrongAnswers={onViewWrongAnswers}
            />
          </div>
          
          <KidProfile
            name={name}
            age={age}
            avatarUrl={avatarUrl}
            points={points}
          />
          
          {milestones.length > 0 && currentMilestone && (
            <div className="w-full mt-4 border-t pt-3">
              <KidMilestone
                currentMilestone={currentMilestone}
                nextMilestone={nextMilestone}
                points={points}
                progressPercentage={progressPercentage}
              />
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
