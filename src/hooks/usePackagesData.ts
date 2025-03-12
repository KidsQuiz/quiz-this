
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
      
      // Then, get the question count for each package
      const packageIds = packagesData.map(pkg => pkg.id);
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('package_id, count')
        .in('package_id', packageIds)
        .group('package_id');
      
      if (questionsError) throw questionsError;
      
      // Map question counts to packages
      const packageWithCounts = packagesData.map(pkg => {
        const countData = questionsData?.find(q => q.package_id === pkg.id);
        return {
          ...pkg,
          question_count: countData ? parseInt(countData.count) : 0
        };
      });
      
      setPackages(packageWithCounts);
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
