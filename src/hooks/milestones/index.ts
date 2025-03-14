
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMilestonesFetch } from './useMilestonesFetch';
import { useMilestonesManagement } from './useMilestonesManagement';
import { useMilestonesProgress } from './useMilestonesProgress';
import { Milestone, MilestoneProgress } from './types';

export type { Milestone, MilestoneProgress };

export const useMilestonesData = (kidId?: string) => {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const { milestones, isLoading, fetchMilestones, setMilestones } = useMilestonesFetch(kidId);
  const { addMilestone, updateMilestone, deleteMilestone } = useMilestonesManagement(setMilestones);
  const progressData = useMilestonesProgress(milestones, points);

  // Update the points value (used for calculating progress metrics)
  const updatePoints = (newPoints: number) => {
    setPoints(newPoints);
  };

  return {
    user,
    milestones,
    isLoading,
    fetchMilestones,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    updatePoints,
    ...progressData
  };
};
