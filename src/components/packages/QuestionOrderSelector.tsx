
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ListOrdered, Shuffle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionOrderSelectorProps {
  value: 'sequential' | 'shuffle';
  onChange: (value: 'sequential' | 'shuffle') => void;
  disabled?: boolean;
}

const QuestionOrderSelector = ({ 
  value, 
  onChange, 
  disabled = false 
}: QuestionOrderSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <RadioGroup 
      value={value} 
      onValueChange={(value) => onChange(value as 'sequential' | 'shuffle')}
      className="flex space-x-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="sequential" id="sequential" disabled={disabled} />
        <Label htmlFor="sequential" className="flex items-center space-x-1 cursor-pointer">
          <ListOrdered className="h-4 w-4" />
          <span>{t('sequential')}</span>
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="shuffle" id="shuffle" disabled={disabled} />
        <Label htmlFor="shuffle" className="flex items-center space-x-1 cursor-pointer">
          <Shuffle className="h-4 w-4" />
          <span>{t('shuffle')}</span>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default QuestionOrderSelector;
