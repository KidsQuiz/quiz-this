
import { useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useKidsData } from './useKidsData';

export const useKidsDragDrop = (fetchKids: () => Promise<void>) => {
  const handleDragEnd = async (result: DropResult, reorderKids: (sourceIndex: number, destinationIndex: number) => any) => {
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

  return { handleDragEnd };
};
