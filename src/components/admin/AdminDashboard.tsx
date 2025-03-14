
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, UsersIcon, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Fetch all profiles with their created_at timestamps
const fetchUserRegistrations = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, updated_at')
    .order('updated_at', { ascending: true });
    
  if (error) throw error;
  return data;
};

// Format the data for the timeline chart
const prepareChartData = (data) => {
  // Create a map to hold the cumulative count for each month
  const monthCountMap = new Map();

  // Process each registration
  data.forEach(profile => {
    const date = new Date(profile.updated_at);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Initialize or increment the count for this month
    if (!monthCountMap.has(monthYear)) {
      // Find the count from the previous month if it exists
      const months = Array.from(monthCountMap.keys()).sort();
      const previousCount = months.length > 0 ? monthCountMap.get(months[months.length - 1]) : 0;
      monthCountMap.set(monthYear, previousCount + 1);
    } else {
      monthCountMap.set(monthYear, monthCountMap.get(monthYear) + 1);
    }
  });

  // Convert map to array of data points for chart
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
  
  // Query to fetch user count
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

  // Query to fetch user registration data for timeline
  const { data: registrationData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['userRegistrations'],
    queryFn: fetchUserRegistrations,
    select: prepareChartData,
  });

  const error = countError || chartError;
  const loading = countLoading || chartLoading;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t('adminDashboard')}</h1>
      
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
        <CardContent>
          {loading ? (
            <div className="h-80 w-full flex items-center justify-center">
              <div className="w-full h-64 bg-muted rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="h-80 w-full">
              <ChartContainer
                config={{
                  users: {
                    label: 'Users',
                    color: 'hsl(var(--primary))'
                  }
                }}
              >
                <AreaChart
                  data={registrationData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonthYear}
                    tickMargin={10}
                  />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground">
                                {formatMonthYear(payload[0].payload.month)}
                              </span>
                              <span className="font-bold">
                                {payload[0].payload.count} {t('users')}
                              </span>
                            </div>
                          </ChartTooltipContent>
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
                    fill="hsl(var(--primary) / 0.2)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
