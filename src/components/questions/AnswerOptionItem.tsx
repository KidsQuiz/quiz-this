
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface AnswerOptionItemProps {
  content: string;
  isCorrect: boolean;
  index: number;
  disabled: boolean;
  onChange: (index: number, field: 'content' | 'isCorrect', value: string | boolean) => void;
}

const AnswerOptionItem = ({ 
  content, 
  isCorrect, 
  index, 
  disabled, 
  onChange 
}: AnswerOptionItemProps) => {
  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id={`correct-${index}`}
        checked={isCorrect}
        onCheckedChange={(checked) => 
          onChange(index, 'isCorrect', checked === true)
        }
        disabled={disabled}
      />
      <div className="flex-1">
        <Input
          id={`answer-${index}`}
          value={content}
          onChange={(e) => onChange(index, 'content', e.target.value)}
          placeholder={`Answer option ${index + 1}`}
          disabled={disabled}
          className={isCorrect ? "border-green-500" : ""}
        />
      </div>
    </div>
  );
};

export default AnswerOptionItem;
