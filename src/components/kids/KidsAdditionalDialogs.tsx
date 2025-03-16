
import React from 'react';
import MilestonesDialog from '../milestones/MilestonesDialog';
import WrongAnswersDashboard from '../wrong-answers';
import { KidWithPoints, KidIdentifier } from '@/hooks/useKidsAdditionalDialogs';

interface KidsAdditionalDialogsProps {
  // Milestones Dialog props
  isMilestoneDialogOpen: boolean;
  selectedKidForMilestones: KidWithPoints | null;
  closeMilestoneDialog: () => void;
  
  // Wrong Answers Dashboard props
  isWrongAnswersDialogOpen: boolean;
  selectedKidForWrongAnswers: KidIdentifier | null;
  closeWrongAnswersDialog: () => void;
}

const KidsAdditionalDialogs = ({
  // Milestones Dialog props
  isMilestoneDialogOpen,
  selectedKidForMilestones,
  closeMilestoneDialog,
  
  // Wrong Answers Dashboard props
  isWrongAnswersDialogOpen,
  selectedKidForWrongAnswers,
  closeWrongAnswersDialog
}: KidsAdditionalDialogsProps) => {
  return (
    <>
      {/* Milestones Dialog */}
      {selectedKidForMilestones && (
        <MilestonesDialog
          isOpen={isMilestoneDialogOpen}
          onClose={closeMilestoneDialog}
          kidId={selectedKidForMilestones.id}
          kidName={selectedKidForMilestones.name}
          kidPoints={selectedKidForMilestones.points}
        />
      )}
      
      {/* Wrong Answers Dashboard */}
      {selectedKidForWrongAnswers && (
        <WrongAnswersDashboard
          isOpen={isWrongAnswersDialogOpen}
          onClose={closeWrongAnswersDialog}
          kidId={selectedKidForWrongAnswers.id}
          kidName={selectedKidForWrongAnswers.name}
        />
      )}
    </>
  );
};

export default KidsAdditionalDialogs;
