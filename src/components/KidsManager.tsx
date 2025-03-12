
import React, { useState } from 'react';
import KidForm from './KidForm';
import KidsList from './KidsList';
import KidPackagesForm from './packages/KidPackagesForm';
import { Button } from '@/components/ui/button';
import { useKidsData } from '@/hooks/useKidsData';
import { UserPlus } from 'lucide-react';
import { DropResult } from 'react-beautiful-dnd';

const KidsManager = () => {
  const { kids, setKids, isLoading, fetchKids, updateKidsPositions, deleteKid } = useKidsData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPackagesFormOpen, setIsPackagesFormOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string | undefined>(undefined);
  const [selectedKidName, setSelectedKidName] = useState<string>('');
  
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
  
  const handlePackagesFormClose = () => {
    setIsPackagesFormOpen(false);
    // Reset focus and ensure state is clean
    setTimeout(() => {
      setSelectedKidId(undefined);
      setSelectedKidName('');
    }, 300); // Increased timeout for better cleanup
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
        <h3 className="text-lg font-medium">Your Kids</h3>
        <Button onClick={handleAddKid} className="flex items-center gap-2">
          <UserPlus size={16} />
          <span>Add Kid</span>
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
      />
      
      <KidForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchKids}
        kidId={selectedKidId}
      />
      
      {/* Only render the package form when we actually have a selected kid */}
      {selectedKidId && (
        <KidPackagesForm
          isOpen={isPackagesFormOpen}
          onClose={handlePackagesFormClose}
          kidId={selectedKidId}
          kidName={selectedKidName}
        />
      )}
    </div>
  );
};

export default KidsManager;
