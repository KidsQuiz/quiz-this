
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Kid {
  id: string;
  name: string;
  age: number;
  avatar_url: string | null;
  position: number;
  points: number;
}

export const useKidsData = () => {
  const { user } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const deleteKid = async (id: string) => {
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

  return {
    kids,
    setKids,
    isLoading,
    fetchKids,
    updateKidsPositions,
    deleteKid
  };
};
