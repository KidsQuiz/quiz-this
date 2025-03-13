
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidsHeaderProps {
  onAddKid: () => void;
}

const KidsHeader = ({ onAddKid }: KidsHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6 flex justify-between items-center">
      <h3 className="text-lg font-medium">{t('myKids')}</h3>
      <Button onClick={onAddKid} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        <span>{t('addKid')}</span>
      </Button>
    </div>
  );
};

export default KidsHeader;
