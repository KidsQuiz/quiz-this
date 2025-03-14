
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlayCircle, Package, AlertTriangle } from 'lucide-react';
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
      <div className="mt-4 space-y-2">
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription className="text-xs">
            {t('assignPackagesFirst')}
          </AlertDescription>
        </Alert>
        <Button
          className="w-full gap-2"
          variant="outline"
          disabled
        >
          <Package className="h-4 w-4" />
          {t('assignPackages')}
        </Button>
      </div>
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
