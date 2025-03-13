
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionMetadataFieldsProps {
  timeLimit: string;
  points: string;
  isLoading: boolean;
  onTimeLimitChange: (value: string) => void;
  onPointsChange: (value: string) => void;
}

const QuestionMetadataFields = ({
  timeLimit,
  points,
  isLoading,
  onTimeLimitChange,
  onPointsChange
}: QuestionMetadataFieldsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="timeLimit" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{t('questionTimeLimit')}</span>
        </Label>
        <Input
          id="timeLimit"
          type="number"
          value={timeLimit}
          onChange={(e) => onTimeLimitChange(e.target.value)}
          min="5"
          max="300"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points" className="flex items-center gap-1">
          <Star className="h-4 w-4" />
          <span>{t('questionPoints')}</span>
        </Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => onPointsChange(e.target.value)}
          min="1"
          max="100"
          disabled={isLoading}
          required
        />
      </div>
    </div>
  );
};

export default QuestionMetadataFields;
