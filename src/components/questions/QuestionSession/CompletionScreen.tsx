
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompletionScreenProps {
  kidName: string;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  onClose: () => void;
}

const CompletionScreen = ({
  kidName,
  totalPoints,
  correctAnswers,
  totalQuestions,
  onClose
}: CompletionScreenProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('sessionComplete')}</DialogTitle>
        <DialogDescription>
          {t('greatJob')}, {kidName}!
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4 text-center">
        <div className="text-5xl font-bold text-primary">{totalPoints}</div>
        <p className="text-lg">{t('totalPointsEarned')}</p>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <p>{t('youAnswered').replace('{correct}', correctAnswers.toString()).replace('{total}', totalQuestions.toString())}</p>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogFooter>
    </>
  );
};

export default CompletionScreen;
