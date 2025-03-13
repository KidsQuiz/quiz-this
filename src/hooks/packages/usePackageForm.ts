
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const usePackageForm = (packageId?: string, onSave?: () => void, onClose?: () => void) => {
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
    
    if (packageId) {
      loadPackageData();
    } else {
      // Reset form when opening in add mode
      setName('');
      setDescription('');
      setPresentationOrder('shuffle');
    }
  }, [packageId, t]);
  
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
      
      if (onSave) onSave();
      if (onClose) onClose();
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
  
  return {
    name,
    setName,
    description,
    setDescription,
    presentationOrder,
    setPresentationOrder,
    isLoading,
    isEditMode,
    handleSubmit
  };
};
