
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchUserRegistrations, prepareChartData, formatDayDate } from './utils/adminDataUtils';

export const RegistrationChart = () => {
  const { t } = useLanguage();

  const { data: registrationData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['userRegistrations'],
    queryFn: fetchUserRegistrations,
    select: prepareChartData,
  });

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-primary" />
          {t('userRegistrationTimeline')}
        </CardTitle>
        <CardDescription>{t('registrationsByDay')}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {chartLoading ? (
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
                  dataKey="day" 
                  tickFormatter={formatDayDate}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                              {formatDayDate(payload[0].payload.day)}
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
  );
};
