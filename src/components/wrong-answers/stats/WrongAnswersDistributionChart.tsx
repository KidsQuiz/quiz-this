
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { renderCustomizedLabel, CHART_COLORS } from './chartDataUtils';

interface ChartData {
  question: string;
  count: number;
  shortQuestion: string;
  correctAnswer: string;
}

interface WrongAnswersDistributionChartProps {
  data: ChartData[];
}

const WrongAnswersDistributionChart: React.FC<WrongAnswersDistributionChartProps> = ({ data }) => {
  const { t } = useLanguage();

  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
    );
  }

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="shortQuestion"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [value, t('wrongCount')]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend 
            formatter={(value, entry, index) => {
              const item = data[index];
              return `${item?.shortQuestion} (${item?.count})`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WrongAnswersDistributionChart;
