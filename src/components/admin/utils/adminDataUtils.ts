
import { supabase } from '@/integrations/supabase/client';

export const fetchUserRegistrations = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, updated_at')
    .order('updated_at', { ascending: true });
    
  if (error) throw error;
  return data;
};

export const prepareChartData = (data: any[]) => {
  const monthCountMap = new Map();

  data.forEach(profile => {
    const date = new Date(profile.updated_at);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthCountMap.has(monthYear)) {
      const months = Array.from(monthCountMap.keys()).sort();
      const previousCount = months.length > 0 ? monthCountMap.get(months[months.length - 1]) : 0;
      monthCountMap.set(monthYear, previousCount + 1);
    } else {
      monthCountMap.set(monthYear, monthCountMap.get(monthYear) + 1);
    }
  });

  return Array.from(monthCountMap.entries()).map(([month, count]) => ({
    month,
    count
  }));
};

export const formatMonthYear = (monthYear: string) => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};
