
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import QuestionOrderSelector from './QuestionOrderSelector';

interface PackageFormContentProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  presentationOrder: 'sequential' | 'shuffle';
  setPresentationOrder: (order: 'sequential' | 'shuffle') => void;
  isLoading: boolean;
}

const PackageFormContent = ({
  name,
  setName,
  description,
  setDescription,
  presentationOrder,
  setPresentationOrder,
  isLoading
}: PackageFormContentProps) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">{t('packageName')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('packageName')}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">{t('packageDescription')}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('packageDescription')}
          disabled={isLoading}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>{t('questionOrder')}</Label>
        <QuestionOrderSelector
          value={presentationOrder}
          onChange={setPresentationOrder}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default PackageFormContent;
