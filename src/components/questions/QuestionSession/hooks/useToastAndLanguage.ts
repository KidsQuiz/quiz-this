
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useToastAndLanguage = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  return { toast, t };
};
