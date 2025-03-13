
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ListOrdered, Shuffle } from 'lucide-react';

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  packageId?: string;
}

const PackageForm = ({ isOpen, onClose, onSave, packageId }: PackageFormProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [presentationOrder, setPresentationOrder] = useState<'sequential' | 'shuffle'>('shuffle');
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!packageId;
  
  useEffect(() => {
    const loadPackageData = async () => {
      if (!packageId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('packages')
          .select('name, description, presentation_order')
          .eq('id', packageId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setName(data.name);
          setDescription(data.description || '');
          setPresentationOrder((data.presentation_order as 'sequential' | 'shuffle') || 'shuffle');
        }
      } catch (error: any) {
        console.error('Error fetching package:', error.message);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("somethingWentWrong")
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
      setPresentationOrder('shuffle');
    }
  }, [isOpen, packageId, isEditMode, t]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("somethingWentWrong")
      });
      return;
    }
    
    if (!name) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("somethingWentWrong")
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
            presentation_order: presentationOrder,
            updated_at: new Date().toISOString()
          })
          .eq('id', packageId);
          
        if (error) throw error;
        
        toast({
          title: t("update"),
          description: t("somethingWentWrong")
        });
      } else {
        const { error } = await supabase
          .from('packages')
          .insert({
            parent_id: user.id,
            name,
            description: description || null,
            presentation_order: presentationOrder
          });
          
        if (error) throw error;
        
        toast({
          title: t("create"),
          description: t("somethingWentWrong")
        });
      }
      
      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving package:', error.message);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error.message || t("somethingWentWrong")
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('editPackage') : t('addPackage')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('packageName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('packageName')}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('packageDescription')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('packageDescription')}
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('questionOrder')}</Label>
            <RadioGroup 
              value={presentationOrder} 
              onValueChange={(value) => setPresentationOrder(value as 'sequential' | 'shuffle')}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sequential" id="sequential" />
                <Label htmlFor="sequential" className="flex items-center space-x-1 cursor-pointer">
                  <ListOrdered className="h-4 w-4" />
                  <span>{t('sequential')}</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shuffle" id="shuffle" />
                <Label htmlFor="shuffle" className="flex items-center space-x-1 cursor-pointer">
                  <Shuffle className="h-4 w-4" />
                  <span>{t('shuffle')}</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : (isEditMode ? t('update') : t('create'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PackageForm;
