
import React from 'react';
import { Label } from '@/components/ui/label';
import AnswerOptionItem from './AnswerOptionItem';

export interface AnswerFormOption {
  id?: string;
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
  return (
    <div className="space-y-4">
      <Label>Answer Options</Label>
      
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
        Check the box next to each correct answer. At least one answer must be marked as correct.
      </p>
    </div>
  );
};

export default AnswerOptionsList;
