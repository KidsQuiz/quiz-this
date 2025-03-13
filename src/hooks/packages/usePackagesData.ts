
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePackagesFetch } from './usePackagesFetch';
import { usePackagesManagement } from './usePackagesManagement';
import { Package } from './types';

export const usePackagesData = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const { isLoading, fetchPackages } = usePackagesFetch();
  const { deletePackage: deletePackageAction } = usePackagesManagement();

  const loadPackages = async () => {
    if (!user) return;
    const data = await fetchPackages(user.id);
    setPackages(data);
  };

  useEffect(() => {
    loadPackages();
  }, [user]);

  const deletePackage = async (id: string) => {
    const success = await deletePackageAction(id);
    if (success) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
    return success;
  };

  return {
    packages,
    isLoading,
    fetchPackages: loadPackages,
    deletePackage
  };
};
