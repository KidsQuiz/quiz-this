
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface MonthlyData {
  month: string;
  count: number;
}

interface MonthlyWrongAnswersChartProps {
  data: MonthlyData[];
}

const MonthlyWrongAnswersChart: React.FC<MonthlyWrongAnswersChartProps> = ({ data }) => {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
    );
  }

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [value, t('wrongCount')]}
          />
          <Bar dataKey="count" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyWrongAnswersChart;
