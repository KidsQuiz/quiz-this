
import React, { useState, useEffect } from 'react';
import KidForm from './KidForm';
import KidsList from './KidsList';
import KidPackagesForm from './packages/KidPackagesForm';
import QuestionSession from './questions/QuestionSession';
import { Button } from '@/components/ui/button';
import { useKidsData } from '@/hooks/useKidsData';
import { UserPlus } from 'lucide-react';
import { DropResult } from 'react-beautiful-dnd';
import { useLanguage } from '@/contexts/LanguageContext';

const KidsManager = () => {
  const { kids, setKids, isLoading, fetchKids, updateKidsPositions, deleteKid, resetPoints } = useKidsData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPackagesFormOpen, setIsPackagesFormOpen] = useState(false);
  const [isQuestionSessionOpen, setIsQuestionSessionOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string | undefined>(undefined);
  const [selectedKidName, setSelectedKidName] = useState<string>('');
  const { t } = useLanguage();
  
  // Reset form open state on component unmount
  useEffect(() => {
    return () => {
      setIsFormOpen(false);
      setIsPackagesFormOpen(false);
      setIsQuestionSessionOpen(false);
      setSelectedKidId(undefined);
      setSelectedKidName('');
    };
  }, []);
  
  const handleAddKid = () => {
    setSelectedKidId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditKid = (id: string) => {
    setSelectedKidId(id);
    setIsFormOpen(true);
  };
  
  const handleAssignPackages = (id: string, name: string) => {
    setSelectedKidId(id);
    setSelectedKidName(name);
    setIsPackagesFormOpen(true);
  };
  
  const handleStartQuestions = (id: string, name: string) => {
    setSelectedKidId(id);
    setSelectedKidName(name);
    setIsQuestionSessionOpen(true);
  };
  
  const handleResetPoints = (id: string, name: string) => {
    resetPoints(id, name);
  };
  
  const handlePackagesFormClose = () => {
    // First, close the modal
    setIsPackagesFormOpen(false);
    
    // Clear state immediately after closing the modal
    setSelectedKidId(undefined);
    setSelectedKidName('');
  };
  
  const handleQuestionSessionClose = () => {
    // First, close the session
    setIsQuestionSessionOpen(false);
    
    // Then clear the selected kid
    setSelectedKidId(undefined);
    setSelectedKidName('');
    
    // Refresh kids data to get updated points
    fetchKids();
  };
  
  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    
    // If dropped outside the list or no movement
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Reorder the kids array
    const reorderedKids = Array.from(kids);
    const [removed] = reorderedKids.splice(source.index, 1);
    reorderedKids.splice(destination.index, 0, removed);
    
    // Update the position property on each kid
    const updatedKids = reorderedKids.map((kid, index) => ({
      ...kid,
      position: index
    }));
    
    // Update the UI state immediately
    setKids(updatedKids);
    
    // Prepare position updates for the database
    const positionUpdates = updatedKids.map(kid => ({
      id: kid.id,
      position: kid.position
    }));
    
    // Update positions in the database
    await updateKidsPositions(positionUpdates);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('myKids')}</h3>
        <Button onClick={handleAddKid} className="flex items-center gap-2">
          <UserPlus size={16} />
          <span>{t('addKid')}</span>
        </Button>
      </div>
      
      <KidsList 
        kids={kids}
        isLoading={isLoading}
        onDragEnd={onDragEnd}
        onEditKid={handleEditKid}
        onDeleteKid={deleteKid}
        onAddKid={handleAddKid}
        onAssignPackages={handleAssignPackages}
        onStartQuestions={handleStartQuestions}
        onResetPoints={handleResetPoints}
      />
      
      <KidForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchKids}
        kidId={selectedKidId}
      />
      
      {isPackagesFormOpen && selectedKidId && (
        <KidPackagesForm
          isOpen={isPackagesFormOpen}
          onClose={handlePackagesFormClose}
          kidId={selectedKidId}
          kidName={selectedKidName}
        />
      )}
      
      {isQuestionSessionOpen && selectedKidId && (
        <QuestionSession
          isOpen={isQuestionSessionOpen}
          onClose={handleQuestionSessionClose}
          kidId={selectedKidId}
          kidName={selectedKidName}
        />
      )}
    </div>
  );
};

export default KidsManager;
