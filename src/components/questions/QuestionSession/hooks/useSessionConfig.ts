
import { useToastAndLanguage } from './useToastAndLanguage';
import { usePackageSelection } from './usePackageSelection';
import { useSessionStartup } from './useSessionStartup';

export const useSessionConfig = (
  kidId: string, 
  kidName: string, 
  onClose: () => void
) => {
  const { toast, t } = useToastAndLanguage();
  
  // Load packages and handle selection
  const {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages
  } = usePackageSelection(kidId, kidName, onClose, toast);

  // Handle session startup
  const { handleStartSession } = useSessionStartup(
    selectedPackageIds,
    (selectedIds) => loadQuestions(selectedIds),
    setIsConfiguring,
    setCurrentQuestionIndex
  );

  const setIsConfiguring = () => {}; // This will be replaced by the real function in useQuestionSession
  const setCurrentQuestionIndex = () => {}; // This will be replaced by the real function in useQuestionSession
  const loadQuestions = async () => {}; // This will be replaced by the real function in useQuestionSession

  return {
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession: (setIsConfiguringFn: any, setCurrentQuestionIndexFn: any, loadQuestionsFn: any) => {
      setIsConfiguring = setIsConfiguringFn;
      setCurrentQuestionIndex = setCurrentQuestionIndexFn;
      loadQuestions = loadQuestionsFn;
      return handleStartSession;
    }
  };
};
