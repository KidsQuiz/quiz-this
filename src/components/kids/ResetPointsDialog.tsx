
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { KidIdentifier } from '@/hooks/useKidsDialogs';

interface ResetPointsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kidToReset: KidIdentifier | null;
  onReset: () => void;
}

const ResetPointsDialog = ({
  isOpen,
  onClose,
  kidToReset,
  onReset
}: ResetPointsDialogProps) => {
  const { t } = useLanguage();

  const confirmResetPoints = async () => {
    if (!kidToReset) return;
    
    try {
      const { error } = await supabase
        .from('kids')
        .update({ points: 0 })
        .eq('id', kidToReset.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${kidToReset.name}'s points have been reset to 0`
      });
      
      onReset();
    } catch (error: any) {
      console.error('Error resetting points:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset points"
      });
    } finally {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('resetPoints')}</AlertDialogTitle>
          <AlertDialogDescription>
            {kidToReset?.name}'s points will be reset to 0. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={confirmResetPoints}>{t('confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetPointsDialog;
