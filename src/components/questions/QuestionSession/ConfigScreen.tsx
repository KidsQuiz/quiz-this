
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Package } from 'lucide-react';

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
  return (
    <>
      <DialogHeader>
        <DialogTitle>Start Question Session</DialogTitle>
        <DialogDescription>
          Select packages to include for this quiz session.
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <Label>Select Question Packages</Label>
          <div className="flex gap-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={selectAllPackages}
              disabled={isLoading || questionPackages.length === 0}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={deselectAllPackages}
              disabled={isLoading || selectedPackageIds.length === 0}
            >
              Deselect All
            </Button>
          </div>
          <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
            {questionPackages.length > 0 ? (
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
            ) : (
              <p className="text-sm text-muted-foreground">Loading packages...</p>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onStartSession} 
          disabled={isLoading || selectedPackageIds.length === 0}
        >
          Start Session
        </Button>
      </DialogFooter>
    </>
  );
};

export default ConfigScreen;
