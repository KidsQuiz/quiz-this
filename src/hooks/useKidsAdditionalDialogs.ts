
import { useState } from 'react';

export interface KidWithPoints extends KidIdentifier {
  points: number;
}

export interface KidIdentifier {
  id: string;
  name: string;
}

export const useKidsAdditionalDialogs = () => {
  // Milestone dialog state
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [selectedKidForMilestones, setSelectedKidForMilestones] = useState<KidWithPoints | null>(null);
  
  // Wrong answers dialog state
  const [isWrongAnswersDialogOpen, setIsWrongAnswersDialogOpen] = useState(false);
  const [selectedKidForWrongAnswers, setSelectedKidForWrongAnswers] = useState<KidIdentifier | null>(null);
  
  // Milestone management functions
  const openMilestoneDialog = (id: string, name: string, points: number) => {
    setSelectedKidForMilestones({ id, name, points });
    setIsMilestoneDialogOpen(true);
  };
  
  const closeMilestoneDialog = () => {
    setIsMilestoneDialogOpen(false);
    setSelectedKidForMilestones(null);
  };
  
  // Wrong answers management functions
  const openWrongAnswersDialog = (id: string, name: string) => {
    setSelectedKidForWrongAnswers({ id, name });
    setIsWrongAnswersDialogOpen(true);
  };
  
  const closeWrongAnswersDialog = () => {
    setIsWrongAnswersDialogOpen(false);
    setSelectedKidForWrongAnswers(null);
  };
  
  // This function just opens the WrongAnswersDashboard where the actual reset happens
  const handleResetWrongAnswers = (id: string, name: string) => {
    openWrongAnswersDialog(id, name);
  };

  return {
    // Milestone dialog
    isMilestoneDialogOpen,
    selectedKidForMilestones,
    openMilestoneDialog,
    closeMilestoneDialog,
    
    // Wrong answers dialog
    isWrongAnswersDialogOpen,
    selectedKidForWrongAnswers,
    openWrongAnswersDialog,
    closeWrongAnswersDialog,
    handleResetWrongAnswers
  };
};
