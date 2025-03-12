
import React, { useState, useEffect } from 'react';
import KidCard from './KidCard';
import KidForm from './KidForm';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Kid {
  id: string;
  name: string;
  age: number;
  avatar_url: string | null;
  position: number;
}

const KidsManager = () => {
  const { user } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState<string | undefined>(undefined);
  
  const fetchKids = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('parent_id', user.id)
        .order('position', { ascending: true });
        
      if (error) throw error;
      
      setKids(data || []);
    } catch (error: any) {
      console.error('Error fetching kids:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load kids information"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchKids();
  }, [user]);
  
  const handleAddKid = () => {
    setSelectedKidId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditKid = (id: string) => {
    setSelectedKidId(id);
    setIsFormOpen(true);
  };
  
  const handleDeleteKid = async (id: string) => {
    if (!confirm('Are you sure you want to remove this kid?')) return;
    
    try {
      const { error } = await supabase
        .from('kids')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state
      setKids(kids.filter(kid => kid.id !== id));
      
      // Reorder the remaining kids
      const remainingKids = kids.filter(kid => kid.id !== id);
      const updatedPositions = remainingKids.map((kid, index) => ({
        id: kid.id,
        position: index
      }));
      
      if (updatedPositions.length > 0) {
        await updateKidsPositions(updatedPositions);
      }
      
      toast({
        title: "Success",
        description: "Kid removed successfully"
      });
    } catch (error: any) {
      console.error('Error deleting kid:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove kid"
      });
    }
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
  
  const updateKidsPositions = async (positionUpdates: { id: string; position: number }[]) => {
    try {
      for (const update of positionUpdates) {
        const { error } = await supabase
          .from('kids')
          .update({ position: update.position })
          .eq('id', update.id);
          
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Error updating positions:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the new order"
      });
      // Fetch kids again to reset UI to server state
      fetchKids();
    }
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-56 rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : kids.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No kids added yet.</p>
          <Button 
            variant="outline" 
            onClick={handleAddKid} 
            className="mt-4"
          >
            Add your first kid
          </Button>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop to reorder your kids.
          </p>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="kids-list" direction="horizontal">
              {(provided) => (
                <div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {kids.map((kid, index) => (
                    <Draggable key={kid.id} draggableId={kid.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="transition-all focus:outline-none"
                        >
                          <KidCard
                            id={kid.id}
                            name={kid.name}
                            age={kid.age}
                            avatarUrl={kid.avatar_url}
                            onEdit={handleEditKid}
                            onDelete={handleDeleteKid}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
      
      <KidForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchKids}
        kidId={selectedKidId}
      />
    </div>
  );
};

export default KidsManager;
