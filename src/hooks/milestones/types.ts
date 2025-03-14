
import { Milestone as BaseMilestone } from '@/hooks/packages/types';

export type Milestone = BaseMilestone;

export interface MilestoneProgress {
  current: Milestone | null;
  next: Milestone | null;
  percentage: number;
  pointsToNext: number;
}
