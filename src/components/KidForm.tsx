
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface KidFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  kidId?: string;
}

interface Kid {
  id: string;
  name: string;
  age: number;
  avatar_url: string | null;
  position: number;
  points: number;
}

const KidForm = ({ isOpen, onClose, onSave, kidId }: KidFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [points, setPoints] = useState<string>('0');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const isEditMode = !!kidId;
  
  useEffect(() => {
    const fetchKid = async () => {
      if (!kidId) return;
      
      try {
        const { data, error } = await supabase
          .from('kids')
          .select('*')
          .eq('id', kidId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setAge(data.age.toString());
          setPoints(data.points.toString());
          setAvatarUrl(data.avatar_url);
        }
      } catch (error: any) {
        console.error('Error fetching kid:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load kid information"
        });
      }
    };
    
    if (isOpen && isEditMode) {
      fetchKid();
    } else {
      setName('');
      setAge('');
      setPoints('0');
      setAvatarFile(null);
      setAvatarUrl(null);
      setPreviewUrl(null);
    }
  }, [isOpen, kidId, isEditMode]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };
  
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return avatarUrl;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('kid-avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('kid-avatars')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error.message);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Avatar upload failed. Kid will be saved without an image."
      });
      return null;
    }
  };
  
  const getMaxPosition = async (): Promise<number> => {
    if (!user) return 0;
    
    try {
      const { data, error } = await supabase
        .from('kids')
        .select('position')
        .eq('parent_id', user.id)
        .order('position', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      return data && data.length > 0 ? data[0].position + 1 : 0;
    } catch (error) {
      console.error('Error getting max position:', error);
      return 0;
    }
  };
  
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
      const newAvatarUrl = avatarFile ? await uploadAvatar() : avatarUrl;
      
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
        const nextPosition = await getMaxPosition();
        
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
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
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
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Child's name"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Child's age"
              min="0"
              max="18"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Points"
              min="0"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isLoading}
              className="cursor-pointer"
            />
            
            {(previewUrl || avatarUrl) && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={previewUrl || avatarUrl || ''} 
                  alt="Avatar preview" 
                  className="h-24 w-24 rounded-full object-cover border" 
                />
              </div>
            )}
          </div>
          
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
