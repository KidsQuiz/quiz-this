
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StartQuestionButtonProps {
  id: string;
  name: string;
  packageCount: number;
  onStartQuestions: (id: string, name: string) => void;
}

const StartQuestionButton = ({ 
  id, 
  name, 
  packageCount, 
  onStartQuestions 
}: StartQuestionButtonProps) => {
  const { t } = useLanguage();
  const isDisabled = packageCount === 0;
  
  console.log(`StartQuestionButton for ${name}: packageCount = ${packageCount}`);
  
  return (
    <Button
      className="mt-4 w-full gap-2"
      onClick={() => onStartQuestions(id, name)}
      disabled={isDisabled}
    >
      <PlayCircle className="h-4 w-4" />
      {t('startQuestions')}
      {isDisabled && <span className="text-xs ml-2">({t('noPackagesAssigned')})</span>}
    </Button>
  );
};

export default StartQuestionButton;
