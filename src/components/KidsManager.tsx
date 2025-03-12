
import React, { useState, useEffect } from 'react';
import KidCard from './KidCard';
import KidForm from './KidForm';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus } from 'lucide-react';

interface Kid {
  id: string;
  name: string;
  age: number;
  avatar_url: string | null;
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
        .order('created_at', { ascending: false });
        
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {kids.map(kid => (
            <KidCard
              key={kid.id}
              id={kid.id}
              name={kid.name}
              age={kid.age}
              avatarUrl={kid.avatar_url}
              onEdit={handleEditKid}
              onDelete={handleDeleteKid}
            />
          ))}
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
