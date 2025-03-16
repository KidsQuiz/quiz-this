
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePackageOrderFetching = () => {
  const fetchPackageOrders = useCallback(async (
    selectedPackageIds: string[], 
    abortSignal?: AbortSignal
  ) => {
    try {
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
      
      return data.map(pkg => ({
        packageId: pkg.id,
        order: (pkg.presentation_order as 'sequential' | 'shuffle') || 'shuffle'
      }));
    } catch (error: any) {
      console.error('Error in fetchPackageOrders:', error.message);
      return selectedPackageIds.map(id => ({ packageId: id, order: 'shuffle' as const }));
    }
  }, []);

  return { fetchPackageOrders };
};
