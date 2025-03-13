
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePackageData = (packageId: string | undefined) => {
  const [packageName, setPackageName] = useState<string>('');
  
  useEffect(() => {
    const getPackageName = async () => {
      if (!packageId) return;
      
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('name')
          .eq('id', packageId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setPackageName(data.name);
        }
      } catch (error) {
        console.error('Error fetching package name:', error);
      }
    };
    
    getPackageName();
  }, [packageId]);
  
  return { packageName };
};
