
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, UsersIcon, BarChart, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const fetchUserRegistrations = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, updated_at')
    .order('updated_at', { ascending: true });
    
  if (error) throw error;
  return data;
};

const prepareChartData = (data) => {
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

const formatMonthYear = (monthYear) => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
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

  const { data: registrationData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['userRegistrations'],
    queryFn: fetchUserRegistrations,
    select: prepareChartData,
  });

  const error = countError || chartError;
  const loading = countLoading || chartLoading;

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('dashboard')}</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error instanceof Error ? error.message : String(error)}</AlertDescription>
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
      </div>
      
      {/* User Registration Timeline */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            {t('userRegistrationTimeline')}
          </CardTitle>
          <CardDescription>{t('registrationsByMonth')}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="h-80 w-full flex items-center justify-center">
              <div className="w-full h-64 bg-muted rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={registrationData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonthYear}
                    tickMargin={10}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground">
                                {formatMonthYear(payload[0].payload.month)}
                              </span>
                              <span className="font-bold">
                                {payload[0].payload.count} {t('users')}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="users"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
