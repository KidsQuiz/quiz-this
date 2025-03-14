
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const UserStatsCards = () => {
  const { t } = useLanguage();
  
  const { data: userCount, isLoading: countLoading, error: countError } = useQuery({
    queryKey: ['userCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      return count;
    }
  });

  const { data: activeUserCount, isLoading: activeCountLoading, error: activeCountError } = useQuery({
    queryKey: ['activeUserCount'],
    queryFn: async () => {
      const { data: kidAnswers, error: answersError } = await supabase
        .from('kid_answers')
        .select('kid_id')
        .limit(1);
      
      if (answersError) throw answersError;
      
      if (!kidAnswers || kidAnswers.length === 0) return 0;
      
      const { data, error } = await supabase
        .rpc('count_active_users');
        
      if (error) throw error;
      
      return data || 0;
    }
  });

  const error = countError || activeCountError;
  const loading = countLoading || activeCountLoading;

  const activeUserPercentage = userCount && activeUserCount 
    ? Math.round((Number(activeUserCount) / Number(userCount)) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UsersIcon className="h-5 w-5 text-primary" />
            {t('registeredUsers')}
          </CardTitle>
          <CardDescription>{t('totalRegisteredUsers')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 flex items-center">
              <div className="w-full h-6 bg-muted rounded animate-pulse"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold">{userCount}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t('activeUsers')}
          </CardTitle>
          <CardDescription>{t('usersWithActiveKids')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 flex items-center">
              <div className="w-full h-6 bg-muted rounded animate-pulse"></div>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold">{activeUserCount || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {activeUserPercentage}% {t('ofAllUsers')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
