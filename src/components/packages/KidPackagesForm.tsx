
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PackageWithAssignment, useKidPackages } from '@/hooks/useKidPackages';
import { PackageIcon } from 'lucide-react';

interface KidPackagesFormProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}

const KidPackagesForm = ({ isOpen, onClose, kidId, kidName }: KidPackagesFormProps) => {
  const { fetchPackagesWithAssignmentStatus, assignPackageToKid } = useKidPackages(kidId);
  const [packages, setPackages] = useState<PackageWithAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    } catch (error) {
      console.error('Error toggling package assignment:', error);
    }
  };
  
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      // Use setTimeout to allow React to process events properly
      setTimeout(() => {
        onClose();
      }, 0);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Question Packages to {kidName}</DialogTitle>
          <DialogDescription>
            Select which question packages should be assigned to {kidName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse"></div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No question packages available.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create packages first to assign them to {kidName}.
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
                      Assign package
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
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KidPackagesForm;
