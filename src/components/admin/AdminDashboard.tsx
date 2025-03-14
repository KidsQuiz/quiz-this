
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, UsersIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        // Get count of users from profiles table
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        
        setUserCount(count);
      } catch (err: any) {
        console.error('Error fetching user count:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t('adminDashboard')}</h1>
      
      {error && (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
        
        {/* Additional admin cards can be added here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
