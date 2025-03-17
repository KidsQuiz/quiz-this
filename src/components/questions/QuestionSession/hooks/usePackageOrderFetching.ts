
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePackageOrderFetching = () => {
  const fetchPackageOrders = useCallback(async (
    selectedPackageIds: string[], 
    abortSignal?: AbortSignal
  ) => {
    try {
      console.log('Fetching presentation orders for packages:', selectedPackageIds);
      
      const { data, error } = await supabase
        .from('packages')
        .select('id, presentation_order')
        .in('id', selectedPackageIds)
        .abortSignal(abortSignal);
        
      if (error) {
        console.error('Error fetching package presentation orders:', error.message);
        // Default all to shuffle if there's an error
        return selectedPackageIds.map(id => ({ packageId: id, order: 'shuffle' as const }));
      }
      
      if (!data || data.length === 0) {
        console.warn('No package data found, defaulting to shuffle');
        return selectedPackageIds.map(id => ({ packageId: id, order: 'shuffle' as const }));
      }
      
      console.log('Retrieved package orders from database:', data);
      
      const results = data.map(pkg => {
        // Ensure presentation_order is a valid value, default to 'shuffle' if invalid
        const order = pkg.presentation_order === 'sequential' ? 'sequential' : 'shuffle';
        return {
          packageId: pkg.id,
          order: order as 'sequential' | 'shuffle'
        };
      });
      
      console.log('Processed package orders:', results);
      
      // For any packages that weren't found in the database, default to shuffle
      const coveredPackageIds = new Set(results.map(r => r.packageId));
      const missingPackageIds = selectedPackageIds.filter(id => !coveredPackageIds.has(id));
      
      if (missingPackageIds.length > 0) {
        console.warn('Some package IDs were not found in database, defaulting to shuffle:', missingPackageIds);
        missingPackageIds.forEach(id => {
          results.push({ packageId: id, order: 'shuffle' });
        });
      }
      
      return results;
    } catch (error: any) {
      console.error('Error in fetchPackageOrders:', error.message);
      return selectedPackageIds.map(id => ({ packageId: id, order: 'shuffle' as const }));
    }
  }, []);

  return { fetchPackageOrders };
};
