
import React from 'react';
import KidForm from '../KidForm';
import KidPackagesForm from '../packages/KidPackagesForm';
import QuestionSession from '../questions/QuestionSession';
import ResetPointsDialog from './ResetPointsDialog';
import { useKidsDialogs } from '@/hooks/useKidsDialogs';

interface KidsDialogsProps {
  isFormOpen: boolean;
  selectedKidId?: string;
  closeKidForm: () => void;
  onKidSaved: () => void;
  
  isPackageFormOpen: boolean;
  selectedKidForPackages: { id: string; name: string; } | null;
  closePackageForm: () => void;
  onPackageAssignmentChange: () => void;
  
  isQuestionSessionOpen: boolean;
  selectedKidForQuestions: { id: string; name: string; } | null;
  closeQuestionSession: () => void;
  onQuestionSessionEnd: () => void;
  
  isResetPointsDialogOpen: boolean;
  kidToResetPoints: { id: string; name: string; } | null;
  closeResetPointsDialog: () => void;
  onPointsReset: () => void;
}

const KidsDialogs = ({
  // Kid Form
  isFormOpen,
  selectedKidId,
  closeKidForm,
  onKidSaved,
  
  // Package Form
  isPackageFormOpen,
  selectedKidForPackages,
  closePackageForm,
  onPackageAssignmentChange,
  
  // Question Session
  isQuestionSessionOpen,
  selectedKidForQuestions,
  closeQuestionSession,
  onQuestionSessionEnd,
  
  // Reset Points Dialog
  isResetPointsDialogOpen,
  kidToResetPoints,
  closeResetPointsDialog,
  onPointsReset
}: KidsDialogsProps) => {
  return (
    <>
      <KidForm 
        isOpen={isFormOpen}
        onClose={closeKidForm}
        onSave={onKidSaved}
        kidId={selectedKidId}
      />
      
      {selectedKidForPackages && (
        <KidPackagesForm
          isOpen={isPackageFormOpen}
          onClose={closePackageForm}
          kidId={selectedKidForPackages.id}
          kidName={selectedKidForPackages.name}
          onAssignmentChange={onPackageAssignmentChange}
        />
      )}
      
      {selectedKidForQuestions && (
        <QuestionSession
          isOpen={isQuestionSessionOpen}
          onClose={closeQuestionSession}
          kidId={selectedKidForQuestions.id}
          kidName={selectedKidForQuestions.name}
        />
      )}
      
      <ResetPointsDialog
        isOpen={isResetPointsDialogOpen}
        onClose={closeResetPointsDialog}
        kidToReset={kidToResetPoints}
        onReset={onPointsReset}
      />
    </>
  );
};

export default KidsDialogs;
