
import React from 'react';
import { Package, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidToolbarProps {
  id: string;
  name: string;
  points: number;
  packageCount: number;
  onAssignPackages?: (id: string, name: string) => void;
  onManageMilestones?: (id: string, name: string, points: number) => void;
}

const KidToolbar = ({ 
  id, 
  name, 
  points, 
  packageCount, 
  onAssignPackages, 
  onManageMilestones 
}: KidToolbarProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="self-stretch flex justify-end items-center mb-4 gap-2">
      {/* Package Selection Button */}
      {onAssignPackages && (
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 p-0 rounded-full bg-background hover:bg-accent flex items-center justify-center relative"
          onClick={() => onAssignPackages(id, name)}
          title={t('assignPackages')}
        >
          <Package className="h-4 w-4 text-primary" />
          {packageCount > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center text-[10px] px-1 py-0"
            >
              {packageCount}
            </Badge>
          )}
          <span className="sr-only">{t('assignPackages')}</span>
        </Button>
      )}
      
      {/* Milestones Button */}
      {onManageMilestones && (
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 p-0 rounded-full bg-background hover:bg-accent flex items-center justify-center"
          onClick={() => onManageMilestones(id, name, points)}
          title={t('manageMilestones')}
        >
          <Trophy className="h-4 w-4 text-primary" />
          <span className="sr-only">{t('manageMilestones')}</span>
        </Button>
      )}
    </div>
  );
};

export default KidToolbar;
