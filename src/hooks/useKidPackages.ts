
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface KidPackage {
  id: string;
  kid_id: string;
  package_id: string;
  created_at: string;
}

export interface PackageWithAssignment {
  id: string;
  name: string;
  description: string | null;
  isAssigned: boolean;
}

export const useKidPackages = (kidId?: string) => {
  const { user } = useAuth();
  const [kidPackages, setKidPackages] = useState<KidPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKidPackages = async () => {
    if (!user || !kidId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('kid_packages')
        .select('*')
        .eq('kid_id', kidId);
        
      if (error) throw error;
      
      setKidPackages(data || []);
    } catch (error: any) {
      console.error('Error fetching kid packages:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load assigned packages"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackagesWithAssignmentStatus = async (): Promise<PackageWithAssignment[]> => {
    if (!user || !kidId) return [];
    
    try {
      // First get all packages
      const { data: allPackages, error: packagesError } = await supabase
        .from('packages')
        .select('id, name, description')
        .eq('parent_id', user.id);
        
      if (packagesError) throw packagesError;
      
      // Then get the kid's assigned packages
      const { data: assignedPackages, error: assignmentsError } = await supabase
        .from('kid_packages')
        .select('package_id')
        .eq('kid_id', kidId);
        
      if (assignmentsError) throw assignmentsError;
      
      // Create a Set of assigned package IDs for easy lookup
      const assignedPackageIds = new Set(assignedPackages.map(ap => ap.package_id));
      
      // Map the packages with assignment status
      return (allPackages || []).map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        isAssigned: assignedPackageIds.has(pkg.id)
      }));
    } catch (error: any) {
      console.error('Error fetching packages with assignment status:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load packages information"
      });
      return [];
    }
  };

  const assignPackageToKid = async (packageId: string) => {
    if (!user || !kidId) return;
    
    try {
      // Check if already assigned
      const { data: existingAssignment, error: checkError } = await supabase
        .from('kid_packages')
        .select('id')
        .eq('kid_id', kidId)
        .eq('package_id', packageId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingAssignment) {
        // Already assigned, so remove it
        const { error: deleteError } = await supabase
          .from('kid_packages')
          .delete()
          .eq('id', existingAssignment.id);
          
        if (deleteError) throw deleteError;
        
        setKidPackages(kidPackages.filter(kp => kp.package_id !== packageId));
        
        toast({
          title: "Success",
          description: "Package unassigned successfully"
        });
      } else {
        // Not assigned, so assign it
        const { data, error: insertError } = await supabase
          .from('kid_packages')
          .insert({
            kid_id: kidId,
            package_id: packageId
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        setKidPackages([...kidPackages, data]);
        
        toast({
          title: "Success",
          description: "Package assigned successfully"
        });
      }
    } catch (error: any) {
      console.error('Error toggling package assignment:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update package assignment"
      });
    }
  };

  useEffect(() => {
    fetchKidPackages();
  }, [user, kidId]);

  return {
    kidPackages,
    isLoading,
    fetchKidPackages,
    fetchPackagesWithAssignmentStatus,
    assignPackageToKid
  };
};
