
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConfigScreenProps {
  questionPackages: { id: string, name: string }[];
  selectedPackageIds: string[];
  isLoading: boolean;
  togglePackageSelection: (packageId: string) => void;
  selectAllPackages: () => void;
  deselectAllPackages: () => void;
  onStartSession: () => void;
  onClose: () => void;
}

const ConfigScreen = ({
  questionPackages,
  selectedPackageIds,
  isLoading,
  togglePackageSelection,
  selectAllPackages,
  deselectAllPackages,
  onStartSession,
  onClose
}: ConfigScreenProps) => {
  const { t } = useLanguage();
  
  const noPackagesAvailable = questionPackages.length === 0 && !isLoading;
  
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('startSession')}</DialogTitle>
        <DialogDescription>
          {t('selectQuestionPackages')}
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <Label>{t('selectQuestionPackages')}</Label>
          <div className="flex gap-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAllPackages}
              disabled={isLoading || questionPackages.length === 0}
            >
              {t('selectAll')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deselectAllPackages}
              disabled={isLoading || selectedPackageIds.length === 0}
            >
              {t('deselectAll')}
            </Button>
          </div>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            ) : noPackagesAvailable ? (
              <div className="text-center py-4">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">{t('noPackages')}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('assignPackagesFirst')}
                </p>
              </div>
            ) : (
              questionPackages.map(pkg => (
                <div key={pkg.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`package-${pkg.id}`}
                    checked={selectedPackageIds.includes(pkg.id)}
                    onCheckedChange={() => togglePackageSelection(pkg.id)}
                    disabled={isLoading}
                  />
                  <label 
                    htmlFor={`package-${pkg.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    <Package className="h-4 w-4 text-muted-foreground" />
                    {pkg.name}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>{t('cancel')}</Button>
        <Button 
          onClick={onStartSession} 
          disabled={isLoading || selectedPackageIds.length === 0 || noPackagesAvailable}
        >
          {t('startSession')}
        </Button>
      </DialogFooter>
    </>
  );
};

export default ConfigScreen;
