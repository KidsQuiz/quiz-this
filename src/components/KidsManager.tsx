
import React, { useState, useEffect } from 'react';
import KidsList from './KidsList';
import { useKidsData } from '@/hooks/useKidsData';
import { DropResult } from 'react-beautiful-dnd';
import { useKidsDialogs } from '@/hooks/useKidsDialogs';
import { useKidsDragDrop } from '@/hooks/useKidsDragDrop';
import KidsHeader from './kids/KidsHeader';
import KidsDialogs from './kids/KidsDialogs';
import MilestonesDialog from './milestones/MilestonesDialog';
import WrongAnswersDashboard from './wrong-answers';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const KidsManager = () => {
  const { kids, isLoading, fetchKids, deleteKid, reorderKids } = useKidsData();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Milestone dialog state
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false);
  const [selectedKidForMilestones, setSelectedKidForMilestones] = useState<{ id: string; name: string; points: number } | null>(null);
  
  // Wrong answers dialog state
  const [isWrongAnswersDialogOpen, setIsWrongAnswersDialogOpen] = useState(false);
  const [selectedKidForWrongAnswers, setSelectedKidForWrongAnswers] = useState<{ id: string; name: string } | null>(null);
  
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
  
  // Milestone management functions
  const openMilestoneDialog = (id: string, name: string, points: number) => {
    setSelectedKidForMilestones({ id, name, points });
    setIsMilestoneDialogOpen(true);
  };
  
  const closeMilestoneDialog = () => {
    setIsMilestoneDialogOpen(false);
    setSelectedKidForMilestones(null);
    // Refresh kids to update milestones on the card
    fetchKids();
  };
  
  // Wrong answers management functions
  const openWrongAnswersDialog = (id: string, name: string) => {
    setSelectedKidForWrongAnswers({ id, name });
    setIsWrongAnswersDialogOpen(true);
  };
  
  const closeWrongAnswersDialog = () => {
    setIsWrongAnswersDialogOpen(false);
    setSelectedKidForWrongAnswers(null);
    // Refresh kids data to reflect any changes
    fetchKids();
  };
  
  // Reset wrong answers function
  const resetWrongAnswers = async (id: string, name: string) => {
    try {
      console.log(`Resetting wrong answers for kid: ${id} (${name})`);
      
      const { error } = await supabase
        .from('kid_wrong_answers')
        .delete()
        .eq('kid_id', id);
        
      if (error) {
        console.error('Error resetting wrong answers:', error);
        throw error;
      }
      
      toast({
        title: t('success'),
        description: t('wrongAnswersResetSuccess')
      });
      
      // Refresh kids data
      fetchKids();
    } catch (error) {
      console.error('Error resetting wrong answers:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorResettingWrongAnswers')
      });
    }
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
        onManageMilestones={openMilestoneDialog}
        onViewWrongAnswers={openWrongAnswersDialog}
        onResetWrongAnswers={resetWrongAnswers}
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
    </div>
  );
};

export default KidsManager;
