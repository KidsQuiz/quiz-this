
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const usePackageSelection = (
  kidId: string,
  kidName: string,
  onClose: () => void,
  toast: any
) => {
  const [questionPackages, setQuestionPackages] = useState<{ id: string; name: string }[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

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
        
        console.log(`Assigned packages for kid ${kidId}:`, assignedPackages);
        
        if (!assignedPackages || assignedPackages.length === 0) {
          toast({
            title: t("noPackages"),
            description: t("assignPackagesFirst"),
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
          title: t("error"),
          description: t("somethingWentWrong")
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAssignedPackages();
  }, [kidId, kidName, onClose, toast, t]);

  // Handle package selection
  const togglePackageSelection = useCallback((packageId: string) => {
    setSelectedPackageIds(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else {
        return [...prev, packageId];
      }
    });
  }, []);

  // Select all packages
  const selectAllPackages = useCallback(() => {
    setSelectedPackageIds(questionPackages.map(pkg => pkg.id));
  }, [questionPackages]);

  // Deselect all packages
  const deselectAllPackages = useCallback(() => {
    setSelectedPackageIds([]);
  }, []);

  return {
    questionPackages,
    selectedPackageIds,
    isLoading,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  };
};
