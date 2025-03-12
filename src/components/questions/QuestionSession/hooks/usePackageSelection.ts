
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePackageSelection = (
  kidId: string,
  kidName: string,
  onClose: () => void,
  toast: any
) => {
  const [questionPackages, setQuestionPackages] = useState<{ id: string; name: string }[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load assigned packages
  useEffect(() => {
    const loadAssignedPackages = async () => {
      if (!kidId) return;
      
      try {
        setIsLoading(true);
        
        // First get the kid's assigned packages
        const { data: assignedPackages, error: assignmentsError } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (assignmentsError) throw assignmentsError;
        
        if (!assignedPackages || assignedPackages.length === 0) {
          toast({
            title: "No packages assigned",
            description: `${kidName} doesn't have any question packages assigned yet.`,
            variant: "destructive"
          });
          onClose();
          return;
        }
        
        // Get package details
        const packageIds = assignedPackages.map(p => p.package_id);
        const { data: packagesData, error: packagesError } = await supabase
          .from('packages')
          .select('id, name')
          .in('id', packageIds);
          
        if (packagesError) throw packagesError;
        
        setQuestionPackages(packagesData || []);
      } catch (error: any) {
        console.error('Error loading assigned packages:', error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load assigned packages"
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignedPackages();
  }, [kidId, kidName, onClose, toast]);

  // Handle package selection
  const togglePackageSelection = (packageId: string) => {
    setSelectedPackageIds(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  };

  // Select all packages
  const selectAllPackages = () => {
    setSelectedPackageIds(questionPackages.map(pkg => pkg.id));
  };

  // Deselect all packages
  const deselectAllPackages = () => {
    setSelectedPackageIds([]);
  };

  return {
    questionPackages,
    selectedPackageIds,
    isLoading,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  };
};
