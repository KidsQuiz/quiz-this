
import { useState } from 'react';
import { usePackageSelection } from './usePackageSelection';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useSessionConfig = (
  kidId: string, 
  kidName: string, 
  onClose: () => void
) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isConfiguring, setIsConfiguring] = useState(true);
  
  const {
    questionPackages,
    selectedPackageIds,
    isLoading,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = usePackageSelection(kidId, kidName, onClose, toast);

  return {
    isConfiguring,
    setIsConfiguring,
    isLoading,
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    toast,
    t
  };
};
