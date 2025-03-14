
import { useMemo } from 'react';
import { Milestone, MilestoneProgress } from './types';

export const useMilestonesProgress = (milestones: Milestone[], points: number) => {
  const getCurrentMilestone = (points: number) => {
    const achieved = milestones.filter(m => m.points_required <= points);
    return achieved.length > 0 ? achieved[achieved.length - 1] : null;
  };

  const getNextMilestone = (points: number) => {
    const next = milestones.find(m => m.points_required > points);
    return next || null;
  };

  // Calculate progress towards next milestone (as percentage)
  const getMilestoneProgress = (points: number) => {
    const current = getCurrentMilestone(points);
    const next = getNextMilestone(points);
    
    if (!next) return 100; // Already reached highest milestone
    
    const currentPoints = current ? current.points_required : 0;
    const nextPoints = next.points_required;
    
    const range = nextPoints - currentPoints;
    const progress = points - currentPoints;
    
    return Math.min(Math.floor((progress / range) * 100), 100);
  };

  // Calculate points needed to reach next milestone
  const getPointsToNextMilestone = (points: number) => {
    const next = getNextMilestone(points);
    if (!next) return 0;
    return next.points_required - points;
  };

  // Calculate and memoize all progress information
  const progress = useMemo<MilestoneProgress>(() => {
    const current = getCurrentMilestone(points);
    const next = getNextMilestone(points);
    const percentage = getMilestoneProgress(points);
    const pointsToNext = getPointsToNextMilestone(points);

    return {
      current,
      next,
      percentage,
      pointsToNext
    };
  }, [milestones, points]);

  return {
    ...progress,
    getCurrentMilestone,
    getNextMilestone,
    getMilestoneProgress,
    getPointsToNextMilestone
  };
};
