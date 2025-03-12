
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import KidFormFields from './KidFormFields';
import AvatarUploader from './AvatarUploader';
import { uploadAvatar, getMaxPosition, fetchKidData } from './kidFormUtils';

interface KidFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kidId?: string;
}

const KidForm = ({ isOpen, onClose, onSave, kidId }: KidFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [points, setPoints] = useState<string>('0');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!kidId;
  
  useEffect(() => {
    const loadKidData = async () => {
      if (!kidId) return;
      
      const data = await fetchKidData(kidId);
      
      if (data) {
        setName(data.name);
        setAge(data.age.toString());
        setPoints(data.points.toString());
        setAvatarUrl(data.avatar_url);
      }
    };
    
    if (isOpen && isEditMode) {
      loadKidData();
    } else {
      // Reset form when opening in add mode
      setName('');
      setAge('');
      setPoints('0');
      setAvatarFile(null);
      setAvatarUrl(null);
    }
  }, [isOpen, kidId, isEditMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to add or edit kids."
      });
      return;
    }
    
    if (!name || !age) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both name and age."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newAvatarUrl = await uploadAvatar(avatarFile, avatarUrl, user.id);
      
      if (isEditMode) {
        const { error } = await supabase
          .from('kids')
          .update({
            name,
            age: parseInt(age),
            points: parseInt(points),
            avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', kidId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Kid updated successfully!"
        });
      } else {
        // Get the next position for the new kid
        const nextPosition = await getMaxPosition(user.id);
        
        const { error } = await supabase
          .from('kids')
          .insert({
            parent_id: user.id,
            name,
            age: parseInt(age),
            points: parseInt(points),
            avatar_url: newAvatarUrl,
            position: nextPosition
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Kid added successfully!"
        });
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving kid:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save kid information."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Kid' : 'Add Kid'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <KidFormFields
            name={name}
            age={age}
            points={points}
            isLoading={isLoading}
            onNameChange={setName}
            onAgeChange={setAge}
            onPointsChange={setPoints}
          />
          
          <AvatarUploader
            avatarUrl={avatarUrl}
            isLoading={isLoading}
            onFileChange={setAvatarFile}
          />
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KidForm;
