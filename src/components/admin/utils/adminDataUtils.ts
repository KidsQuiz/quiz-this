
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
  const dailyCountMap = new Map();

  data.forEach(profile => {
    const date = new Date(profile.updated_at);
    const dayDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    if (!dailyCountMap.has(dayDate)) {
      const days = Array.from(dailyCountMap.keys()).sort();
      const previousCount = days.length > 0 ? dailyCountMap.get(days[days.length - 1]) : 0;
      dailyCountMap.set(dayDate, previousCount + 1);
    } else {
      dailyCountMap.set(dayDate, dailyCountMap.get(dayDate) + 1);
    }
  });

  return Array.from(dailyCountMap.entries()).map(([day, count]) => ({
    day,
    count
  }));
};

export const formatDayDate = (dayDate: string) => {
  const date = new Date(dayDate);
  return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
};
