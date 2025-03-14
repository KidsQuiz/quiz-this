
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, Package } from 'lucide-react';
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
  
  if (isDisabled) {
    return (
      <Button
        className="mt-4 w-full gap-2"
        variant="outline"
        disabled
      >
        <Package className="h-4 w-4" />
        {t('assignPackages')}
      </Button>
    );
  }

  return (
    <Button
      className="mt-4 w-full gap-2"
      onClick={() => onStartQuestions(id, name)}
    >
      <PlayCircle className="h-4 w-4" />
      {t('startSession')}
    </Button>
  );
};

export default StartQuestionButton;
