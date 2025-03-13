
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
    <div className="w-full mb-4">
      <Button
        size="default"
        variant="default"
        className="w-full bg-primary text-white hover:bg-primary/90 shadow-md transition-all hover:shadow-lg animate-pulse"
        onClick={() => onStartQuestions(id, name)}
      >
        <PlayCircle className="h-5 w-5 mr-1" />
        {t('startSession')}
      </Button>
    </div>
  );
};

export default StartQuestionButton;
