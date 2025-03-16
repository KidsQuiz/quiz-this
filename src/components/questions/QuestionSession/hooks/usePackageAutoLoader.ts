
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

export const usePackageAutoLoader = (
  kidId: string,
  loadQuestions: (packageIds: string[]) => Promise<void>,
  setCurrentQuestionIndex: (index: number) => void
) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  // Auto-load all assigned packages for the kid and start the session
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
          
          // Load the questions from all assigned packages
          await loadQuestions(packageIds);
          
          // Start the session at the first question
          setCurrentQuestionIndex(0);
        } else {
          console.warn(`No packages assigned to kid ${kidId}`);
          toast({
            variant: "destructive",
            title: t('noPackages'),
            description: t('assignPackagesFirst')
          });
        }
      } catch (error) {
        console.error('Error auto-loading assigned packages:', error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('somethingWentWrong')
        });
      }
    };
    
    // Execute the function right away
    loadAssignedPackages();
  }, [kidId, loadQuestions, setCurrentQuestionIndex, toast, t]);
};
