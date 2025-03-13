
import React, { useState, useEffect } from 'react';
import KidsList from './KidsList';
import { useKidsData } from '@/hooks/useKidsData';
import { DropResult } from 'react-beautiful-dnd';
import { useKidsDialogs } from '@/hooks/useKidsDialogs';
import { useKidsDragDrop } from '@/hooks/useKidsDragDrop';
import KidsHeader from './kids/KidsHeader';
import KidsDialogs from './kids/KidsDialogs';

const KidsManager = () => {
  const { kids, isLoading, fetchKids, deleteKid, reorderKids } = useKidsData();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const {
    // Kid form
    isFormOpen,
    selectedKidId,
    openAddKidForm,
    openEditKidForm,
    closeKidForm,
    
    // Package form
    isPackageFormOpen,
    selectedKidForPackages,
    openPackageForm,
    closePackageForm,
    
    // Question session
    isQuestionSessionOpen,
    selectedKidForQuestions,
    openQuestionSession,
    closeQuestionSession,
    
    // Reset points
    isResetPointsDialogOpen,
    kidToResetPoints,
    openResetPointsDialog,
    closeResetPointsDialog
  } = useKidsDialogs();
  
  const { handleDragEnd } = useKidsDragDrop(fetchKids);
  
  useEffect(() => {
    fetchKids();
  }, [refreshTrigger]);

  const handleDragEndWrapped = (result: DropResult) => {
    handleDragEnd(result, reorderKids);
  };
  
  const handlePackageFormClose = () => {
    closePackageForm();
    // Trigger a refresh to update the package count badge
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleQuestionSessionClose = () => {
    closeQuestionSession();
    // Refresh kids to update points
    fetchKids();
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <KidsHeader onAddKid={openAddKidForm} />
      
      <KidsList 
        kids={kids}
        isLoading={isLoading}
        onDragEnd={handleDragEndWrapped}
        onEditKid={openEditKidForm}
        onDeleteKid={deleteKid}
        onAddKid={openAddKidForm}
        onAssignPackages={openPackageForm}
        onStartQuestions={openQuestionSession}
        onResetPoints={openResetPointsDialog}
      />
      
      <KidsDialogs
        // Kid Form props
        isFormOpen={isFormOpen}
        selectedKidId={selectedKidId}
        closeKidForm={closeKidForm}
        onKidSaved={fetchKids}
        
        // Package Form props
        isPackageFormOpen={isPackageFormOpen}
        selectedKidForPackages={selectedKidForPackages}
        closePackageForm={handlePackageFormClose}
        onPackageAssignmentChange={() => setRefreshTrigger(prev => prev + 1)}
        
        // Question Session props
        isQuestionSessionOpen={isQuestionSessionOpen}
        selectedKidForQuestions={selectedKidForQuestions}
        closeQuestionSession={handleQuestionSessionClose}
        onQuestionSessionEnd={fetchKids}
        
        // Reset Points Dialog props
        isResetPointsDialogOpen={isResetPointsDialogOpen}
        kidToResetPoints={kidToResetPoints}
        closeResetPointsDialog={closeResetPointsDialog}
        onPointsReset={fetchKids}
      />
    </div>
  );
};

export default KidsManager;
