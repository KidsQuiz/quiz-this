
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';

interface KidFormFieldsProps {
  name: string;
  age: string;
  points: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onPointsChange: (value: string) => void;
}

const KidFormFields = ({ 
  name, 
  age, 
  points, 
  isLoading, 
  onNameChange, 
  onAgeChange, 
  onPointsChange 
}: KidFormFieldsProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('name')}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">{t('age')}</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          placeholder={t('age')}
          min="0"
          max="18"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points">{t('points')}</Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => onPointsChange(e.target.value)}
          placeholder={t('points')}
          min="0"
          disabled={isLoading}
          required
        />
      </div>
    </>
  );
};

export default KidFormFields;
