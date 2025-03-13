
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PackageWithAssignment, useKidPackages } from '@/hooks/useKidPackages';
import { PackageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidPackagesFormProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
  onAssignmentChange?: () => void;
}

const KidPackagesForm = ({ 
  isOpen, 
  onClose, 
  kidId, 
  kidName, 
  onAssignmentChange 
}: KidPackagesFormProps) => {
  const { fetchPackagesWithAssignmentStatus, assignPackageToKid } = useKidPackages(kidId);
  const [packages, setPackages] = useState<PackageWithAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    const loadPackages = async () => {
      if (!isOpen || !kidId) return;
      
      try {
        setIsLoading(true);
        const packagesData = await fetchPackagesWithAssignmentStatus();
        console.log('Loaded packages for kid:', packagesData);
        setPackages(packagesData);
      } catch (error) {
        console.error('Error loading packages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen && kidId) {
      loadPackages();
    }
  }, [isOpen, kidId, fetchPackagesWithAssignmentStatus]);
  
  const handleToggleAssignment = async (packageId: string) => {
    if (isLoading) return;
    
    try {
      await assignPackageToKid(packageId);
      
      // Update local state after successful assignment
      setPackages(packages.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, isAssigned: !pkg.isAssigned } 
          : pkg
      ));
      
      // Notify parent component about the assignment change
      if (onAssignmentChange) {
        onAssignmentChange();
      }
    } catch (error) {
      console.error('Error toggling package assignment:', error);
    }
  };
  
  const handleSelectAll = () => {
    const unassignedPackages = packages.filter(pkg => !pkg.isAssigned);
    if (unassignedPackages.length === 0) return;
    
    unassignedPackages.forEach(async (pkg) => {
      await handleToggleAssignment(pkg.id);
    });
  };
  
  const handleDeselectAll = () => {
    const assignedPackages = packages.filter(pkg => pkg.isAssigned);
    if (assignedPackages.length === 0) return;
    
    assignedPackages.forEach(async (pkg) => {
      await handleToggleAssignment(pkg.id);
    });
  };
  
  const handleDialogClose = () => {
    // Call the onClose prop directly
    onClose();
    
    // Notify parent component about potential assignment changes
    if (onAssignmentChange) {
      onAssignmentChange();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleDialogClose();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('selectQuestionPackages')} {kidName}</DialogTitle>
          <DialogDescription>
            {t('selectQuestionPackages')} {kidName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {packages.length > 0 && (
            <div className="flex justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                className="text-xs"
              >
                {t('selectAll')}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDeselectAll}
                className="text-xs"
              >
                {t('deselectAll')}
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t('noPackages')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('createFirstPackage')}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between border p-3 rounded-md">
                  <div className="flex items-center gap-2">
                    <PackageIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      {pkg.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{pkg.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`package-${pkg.id}`} className="sr-only">
                      {t('package')}
                    </Label>
                    <Switch
                      id={`package-${pkg.id}`}
                      checked={pkg.isAssigned}
                      onCheckedChange={() => handleToggleAssignment(pkg.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleDialogClose}>{t('close')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KidPackagesForm;
