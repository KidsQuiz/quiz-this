
import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface StartQuestionButtonProps {
  id: string;
  name: string;
  onStartQuestions: (id: string, name: string) => void;
}

const StartQuestionButton = ({ 
  id, 
  name, 
  onStartQuestions 
}: StartQuestionButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full mt-4">
      <Button
        size="default"
        variant="outline"
        className="w-full text-primary border-primary/30 hover:bg-primary/10"
        onClick={() => onStartQuestions(id, name)}
      >
        <PlayCircle className="h-5 w-5 mr-1" />
        {t('startSession')}
      </Button>
    </div>
  );
};

export default StartQuestionButton;
