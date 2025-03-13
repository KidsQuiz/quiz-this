
import React from 'react';
import { Label } from '@/components/ui/label';
import AnswerOptionItem from './AnswerOptionItem';
import { useLanguage } from '@/contexts/LanguageContext';

export interface AnswerFormOption {
  id: string;  // Added id field to make it required
  content: string;
  isCorrect: boolean;
}

interface AnswerOptionsListProps {
  answers: AnswerFormOption[];
  isLoading: boolean;
  onAnswerChange: (index: number, field: 'content' | 'isCorrect', value: string | boolean) => void;
}

const AnswerOptionsList = ({ 
  answers, 
  isLoading, 
  onAnswerChange 
}: AnswerOptionsListProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <Label>{t('answerOptions')}</Label>
      
      {answers.map((answer, index) => (
        <AnswerOptionItem 
          key={index}
          content={answer.content}
          isCorrect={answer.isCorrect}
          index={index}
          disabled={isLoading}
          onChange={onAnswerChange}
        />
      ))}
      
      <p className="text-xs text-muted-foreground">
        {t('answerOptions')}
      </p>
    </div>
  );
};

export default AnswerOptionsList;
