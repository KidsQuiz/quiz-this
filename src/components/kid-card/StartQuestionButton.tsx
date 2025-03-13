
import React from 'react';
import { PlayCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface StartQuestionButtonProps {
  id: string;
  name: string;
  onStartQuestions: (id: string, name: string) => void;
  packageCount: number;
}

const StartQuestionButton = ({ 
  id, 
  name, 
  onStartQuestions,
  packageCount
}: StartQuestionButtonProps) => {
  const { t } = useLanguage();
  
  const isDisabled = packageCount === 0;
  
  return (
    <div className="w-full mt-4">
      <Button
        size="default"
        variant="default"
        className="w-full text-primary-foreground bg-primary hover:bg-primary/90"
        onClick={() => !isDisabled && onStartQuestions(id, name)}
        disabled={isDisabled}
      >
        <PlayCircle className="h-5 w-5 mr-1" />
        {t('startSession')}
      </Button>
    </div>
  );
};

export default StartQuestionButton;
