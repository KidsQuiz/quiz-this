
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSessionInitialization = (
  kidId: string,
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>,
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>,
  onClose: () => void
) => {
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initial setup - fetch questions
  useEffect(() => {
    const setup = async () => {
      console.log("Setting up question session for kid:", kidId);
      
      try {
        // Fetch the kid's assigned packages
        const { data: assignedPackages, error } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (error) throw error;
        
        if (!assignedPackages || assignedPackages.length === 0) {
          console.log("No packages assigned to kid", kidId);
          toast({
            variant: "destructive",
            title: t('noPackagesAssigned'),
            description: t('pleaseAssignPackages')
          });
          onClose();
          return;
        }
        
        // Extract package IDs and load questions
        const packageIds = assignedPackages.map(p => p.package_id);
        console.log("Loading questions for packages:", packageIds);
        await loadQuestions(packageIds);
        
        // Initialize the first question
        setCurrentQuestionIndex(0);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('somethingWentWrong')
        });
        
        // Close the session on error
        onClose();
      }
    };
    
    setup();
  }, [kidId, loadQuestions, setCurrentQuestionIndex, onClose, toast, t]);

  return { initialLoadComplete };
};
