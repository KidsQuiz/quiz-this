
import React, { useState, useEffect } from 'react';
import KidForm from './KidForm';
import KidsList from './KidsList';
import { useKidsData, Kid } from '@/hooks/useKidsData';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import KidPackagesForm from './packages/KidPackagesForm';
import QuestionSession from './questions/QuestionSession';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';

const KidsManager = () => {
  const { kids, isLoading, fetchKids, deleteKid, reorderKids } = useKidsData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string | undefined>(undefined);
  const { t } = useLanguage();
  
  // Package assignment state
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [selectedKidForPackages, setSelectedKidForPackages] = useState<{id: string, name: string} | null>(null);
  
  // Question session state
  const [isQuestionSessionOpen, setIsQuestionSessionOpen] = useState(false);
  const [selectedKidForQuestions, setSelectedKidForQuestions] = useState<{id: string, name: string} | null>(null);
  
  // Reset points confirmation state
  const [isResetPointsDialogOpen, setIsResetPointsDialogOpen] = useState(false);
  const [kidToResetPoints, setKidToResetPoints] = useState<{id: string, name: string} | null>(null);
  
  // Force refresh state to update the package count badge
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    fetchKids();
  }, [refreshTrigger]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    // First update the local state
    const reorderedKids = reorderKids(sourceIndex, destinationIndex);
    
    // Then update the positions in the database
    try {
      const updates = reorderedKids.map((kid, index) => ({
        id: kid.id,
        position: index
      }));
      
      for (const update of updates) {
        const { error } = await supabase
          .from('kids')
          .update({ position: update.position })
          .eq('id', update.id);
          
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Error updating kid positions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update kid order"
      });
      
      // Refresh kids to get the original order
      fetchKids();
    }
  };
  
  const handleAddKid = () => {
    setSelectedKidId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditKid = (id: string) => {
    setSelectedKidId(id);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedKidId(undefined);
  };
  
  const handleAssignPackages = (id: string, name: string) => {
    setSelectedKidForPackages({ id, name });
    setIsPackageFormOpen(true);
  };
  
  const handlePackageFormClose = () => {
    setIsPackageFormOpen(false);
    setSelectedKidForPackages(null);
    
    // Trigger a refresh to update the package count badge
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleStartQuestions = (id: string, name: string) => {
    setSelectedKidForQuestions({ id, name });
    setIsQuestionSessionOpen(true);
  };
  
  const handleQuestionSessionClose = () => {
    setIsQuestionSessionOpen(false);
    setSelectedKidForQuestions(null);
    
    // Refresh kids to update points
    fetchKids();
  };
  
  const handleResetPoints = (id: string, name: string) => {
    setKidToResetPoints({ id, name });
    setIsResetPointsDialogOpen(true);
  };
  
  const confirmResetPoints = async () => {
    if (!kidToResetPoints) return;
    
    try {
      const { error } = await supabase
        .from('kids')
        .update({ points: 0 })
        .eq('id', kidToResetPoints.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${kidToResetPoints.name}'s points have been reset to 0`
      });
      
      // Refresh kids to update points
      fetchKids();
    } catch (error: any) {
      console.error('Error resetting points:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset points"
      });
    } finally {
      setIsResetPointsDialogOpen(false);
      setKidToResetPoints(null);
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('myKids')}</h3>
        <Button onClick={handleAddKid} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>{t('addKid')}</span>
        </Button>
      </div>
      
      <KidsList 
        kids={kids}
        isLoading={isLoading}
        onDragEnd={handleDragEnd}
        onEditKid={handleEditKid}
        onDeleteKid={deleteKid}
        onAddKid={handleAddKid}
        onAssignPackages={handleAssignPackages}
        onStartQuestions={handleStartQuestions}
        onResetPoints={handleResetPoints}
      />
      
      <KidForm 
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSave={fetchKids}
        kidId={selectedKidId}
      />
      
      {selectedKidForPackages && (
        <KidPackagesForm
          isOpen={isPackageFormOpen}
          onClose={handlePackageFormClose}
          kidId={selectedKidForPackages.id}
          kidName={selectedKidForPackages.name}
          onAssignmentChange={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}
      
      {selectedKidForQuestions && (
        <QuestionSession
          isOpen={isQuestionSessionOpen}
          onClose={handleQuestionSessionClose}
          kidId={selectedKidForQuestions.id}
          kidName={selectedKidForQuestions.name}
        />
      )}
      
      <AlertDialog open={isResetPointsDialogOpen} onOpenChange={setIsResetPointsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('resetPoints')}</AlertDialogTitle>
            <AlertDialogDescription>
              {kidToResetPoints?.name}'s points will be reset to 0. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPoints}>{t('confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KidsManager;
