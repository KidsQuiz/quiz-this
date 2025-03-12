
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  packageId?: string;
}

const PackageForm = ({ isOpen, onClose, onSave, packageId }: PackageFormProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!packageId;
  
  useEffect(() => {
    const loadPackageData = async () => {
      if (!packageId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('packages')
          .select('name, description')
          .eq('id', packageId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setDescription(data.description || '');
        }
      } catch (error: any) {
        console.error('Error fetching package:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load package information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && isEditMode) {
      loadPackageData();
    } else {
      // Reset form when opening in add mode
      setName('');
      setDescription('');
    }
  }, [isOpen, packageId, isEditMode]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to add or edit packages."
      });
      return;
    }
    
    if (!name) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide a package name."
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('packages')
          .update({
            name,
            description: description || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', packageId);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Package updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('packages')
          .insert({
            parent_id: user.id,
            name,
            description: description || null
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Package created successfully"
        });
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving package:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save package information."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Package' : 'Create Package'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter package name"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter package description"
              disabled={isLoading}
              rows={3}
            />
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
              {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PackageForm;
