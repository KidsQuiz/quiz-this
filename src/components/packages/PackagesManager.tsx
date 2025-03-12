
import React, { useState } from 'react';
import PackagesList from './PackagesList';
import PackageForm from './PackageForm';
import { usePackagesData } from '@/hooks/usePackagesData';
import { Package as PackageIcon } from 'lucide-react';

const PackagesManager = () => {
  const { packages, isLoading, fetchPackages, deletePackage } = usePackagesData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | undefined>(undefined);
  
  const handleAddPackage = () => {
    setSelectedPackageId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditPackage = (id: string) => {
    setSelectedPackageId(id);
    setIsFormOpen(true);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <PackageIcon className="h-5 w-5" />
          <span>Question Packages</span>
        </h3>
      </div>
      
      <PackagesList 
        packages={packages}
        isLoading={isLoading}
        onEditPackage={handleEditPackage}
        onDeletePackage={deletePackage}
        onAddPackage={handleAddPackage}
        alwaysShowAddCard={true}
      />
      
      <PackageForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchPackages}
        packageId={selectedPackageId}
      />
    </div>
  );
};

export default PackagesManager;
