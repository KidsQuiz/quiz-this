
import { useState } from 'react';

export interface KidIdentifier {
  id: string;
  name: string;
}

export const useKidsDialogs = () => {
  // Kid form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string | undefined>(undefined);
  
  // Package assignment state
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [selectedKidForPackages, setSelectedKidForPackages] = useState<KidIdentifier | null>(null);
  
  // Question session state
  const [isQuestionSessionOpen, setIsQuestionSessionOpen] = useState(false);
  const [selectedKidForQuestions, setSelectedKidForQuestions] = useState<KidIdentifier | null>(null);
  
  // Reset points confirmation state
  const [isResetPointsDialogOpen, setIsResetPointsDialogOpen] = useState(false);
  const [kidToResetPoints, setKidToResetPoints] = useState<KidIdentifier | null>(null);
  
  // Form handlers
  const openAddKidForm = () => {
    setSelectedKidId(undefined);
    setIsFormOpen(true);
  };
  
  const openEditKidForm = (id: string) => {
    setSelectedKidId(id);
    setIsFormOpen(true);
  };
  
  const closeKidForm = () => {
    setIsFormOpen(false);
    setSelectedKidId(undefined);
  };
  
  // Package form handlers
  const openPackageForm = (id: string, name: string) => {
    setSelectedKidForPackages({ id, name });
    setIsPackageFormOpen(true);
  };
  
  const closePackageForm = () => {
    setIsPackageFormOpen(false);
    setSelectedKidForPackages(null);
  };
  
  // Question session handlers
  const openQuestionSession = (id: string, name: string) => {
    setSelectedKidForQuestions({ id, name });
    setIsQuestionSessionOpen(true);
  };
  
  const closeQuestionSession = () => {
    setIsQuestionSessionOpen(false);
    setSelectedKidForQuestions(null);
  };
  
  // Reset points handlers
  const openResetPointsDialog = (id: string, name: string) => {
    setKidToResetPoints({ id, name });
    setIsResetPointsDialogOpen(true);
  };
  
  const closeResetPointsDialog = () => {
    setIsResetPointsDialogOpen(false);
    setKidToResetPoints(null);
  };

  return {
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
  };
};
