
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePackageAutoLoader = (
  kidId: string,
  loadQuestions: (packageIds: string[]) => Promise<void>
) => {
  // Auto-load all assigned packages for the kid
  useEffect(() => {
    const loadAssignedPackages = async () => {
      try {
        console.log(`Auto-loading packages for kid ${kidId}`);
        
        // Get all assigned packages for this kid
        const { data: assignedPackages, error } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (error) throw error;
        
        if (assignedPackages && assignedPackages.length > 0) {
          const packageIds = assignedPackages.map(p => p.package_id);
          console.log(`Found ${packageIds.length} assigned packages, loading questions:`, packageIds);
          await loadQuestions(packageIds);
        } else {
          console.warn(`No packages assigned to kid ${kidId}`);
        }
      } catch (error) {
        console.error('Error auto-loading assigned packages:', error);
      }
    };
    
    loadAssignedPackages();
  }, [kidId, loadQuestions]);
};
