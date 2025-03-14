
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePackagesFetch } from './usePackagesFetch';
import { usePackagesManagement } from './usePackagesManagement';
import { Package } from './types';

export const usePackagesData = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const { isLoading, fetchPackages } = usePackagesFetch();
  const { deletePackage: deletePackageAction, clonePackage: clonePackageAction } = usePackagesManagement();
  // Add a ref to prevent multiple loadPackages calls
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadPackages = async () => {
    if (!user || isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    try {
      const data = await fetchPackages(user.id);
      setPackages(data);
      hasLoadedRef.current = true;
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (user && !hasLoadedRef.current && !isLoadingRef.current) {
      loadPackages();
    }
    
    // Clean up function
    return () => {
      hasLoadedRef.current = false;
    };
  }, [user]);

  const deletePackage = async (id: string) => {
    const success = await deletePackageAction(id);
    if (success) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    }
    return success;
  };
  
  const clonePackage = async (id: string) => {
    const newPackage = await clonePackageAction(id);
    if (newPackage) {
      await loadPackages(); // Reload all packages to get updated list
    }
    return !!newPackage;
  };

  return {
    packages,
    isLoading,
    fetchPackages: loadPackages,
    deletePackage,
    clonePackage
  };
};
