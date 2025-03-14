
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChartData {
  question: string;
  count: number;
  correctAnswer: string;
  shortQuestion: string;
}

interface FrequentWrongAnswersChartProps {
  data: ChartData[];
}

const FrequentWrongAnswersChart: React.FC<FrequentWrongAnswersChartProps> = ({ data }) => {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="question" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [value, t('wrongCount')]}
            labelFormatter={(label) => `${t('question')}: ${label}`}
            contentStyle={{ maxWidth: '300px' }}
          />
          <Bar dataKey="count" fill="#ef4444" name={t('wrongCount')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FrequentWrongAnswersChart;
