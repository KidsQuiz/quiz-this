
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const usePackagesManagement = () => {
  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package? All questions within this package will also be deleted.')) return false;
    
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Package deleted successfully"
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting package:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete package"
      });
      return false;
    }
  };

  return {
    deletePackage
  };
};
