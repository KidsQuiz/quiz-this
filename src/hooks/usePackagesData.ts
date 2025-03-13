
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Package {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  question_count?: number;
  presentation_order?: 'sequential' | 'shuffle';
}

export const usePackagesData = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // First, get all packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (packagesError) throw packagesError;
      
      if (!packagesData || packagesData.length === 0) {
        setPackages([]);
        return;
      }
      
      // Then, get question counts for each package individually
      const packagesWithCounts = await Promise.all(
        packagesData.map(async (pkg) => {
          // Count questions for this package
          const { count, error: countError } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('package_id', pkg.id);
          
          if (countError) {
            console.error('Error counting questions:', countError.message);
            return { ...pkg, question_count: 0 };
          }
          
          return { ...pkg, question_count: count || 0 };
        })
      );
      
      setPackages(packagesWithCounts);
    } catch (error: any) {
      console.error('Error fetching packages:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load packages"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [user]);

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package? All questions within this package will also be deleted.')) return;
    
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPackages(packages.filter(pkg => pkg.id !== id));
      
      toast({
        title: "Success",
        description: "Package deleted successfully"
      });
    } catch (error: any) {
      console.error('Error deleting package:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete package"
      });
    }
  };

  return {
    packages,
    isLoading,
    fetchPackages,
    deletePackage
  };
};
