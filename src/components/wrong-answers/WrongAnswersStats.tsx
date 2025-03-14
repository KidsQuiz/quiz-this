
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { WrongAnswer } from './types';

interface WrongAnswersStatsProps {
  wrongAnswers: WrongAnswer[];
  kidName: string;
}

const WrongAnswersStats = ({ wrongAnswers, kidName }: WrongAnswersStatsProps) => {
  const { t } = useLanguage();

  const COLORS = ['#f43f5e', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  // Process and transform data for visualization
  const mostFrequentWrongAnswers = useMemo(() => {
    if (!wrongAnswers || wrongAnswers.length === 0) {
      console.log("No wrong answers data available for stats");
      return [];
    }
    
    console.log(`Processing ${wrongAnswers.length} wrong answers for stats`);
    
    const questionCounts = wrongAnswers.reduce((acc, answer) => {
      // Use question_content as the key
      const key = answer.question_content;
      if (!acc[key]) {
        acc[key] = { 
          question: key, 
          count: 0,
          correctAnswer: answer.correct_answer_content
        };
      }
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { question: string; count: number; correctAnswer: string }>);

    return Object.values(questionCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 wrong answers
  }, [wrongAnswers]);

  // For time-based analysis
  const wrongAnswersByMonth = useMemo(() => {
    if (!wrongAnswers || wrongAnswers.length === 0) {
      return [];
    }
    
    const monthCounts = wrongAnswers.reduce((acc, answer) => {
      // Check if created_at is valid before processing
      if (!answer.created_at) {
        console.warn('Missing created_at in wrong answer:', answer);
        return acc;
      }
      
      try {
        const date = new Date(answer.created_at);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date in wrong answer:', answer.created_at);
          return acc;
        }
        
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = { month: monthYear, count: 0 };
        }
        acc[monthYear].count += 1;
      } catch (error) {
        console.error('Error processing date:', error);
      }
      
      return acc;
    }, {} as Record<string, { month: string; count: number }>);

    // Convert to array and sort chronologically
    return Object.values(monthCounts)
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        const aDate = new Date(`${aMonth} 1, ${aYear}`);
        const bDate = new Date(`${bMonth} 1, ${bYear}`);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(-6); // Last 6 months
  }, [wrongAnswers]);

  // Debug output
  console.log("Most frequent wrong answers:", mostFrequentWrongAnswers);
  console.log("Wrong answers by month:", wrongAnswersByMonth);

  if (!wrongAnswers || wrongAnswers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 pb-6">
          <p className="text-center text-muted-foreground">{t('noWrongAnswersStats')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('mostFrequentWrongAnswers')}</CardTitle>
        </CardHeader>
        <CardContent>
          {mostFrequentWrongAnswers.length === 0 ? (
            <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mostFrequentWrongAnswers}
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
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('wrongAnswersByTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            {wrongAnswersByMonth.length === 0 ? (
              <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wrongAnswersByMonth}>
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('topWrongAnswersDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            {mostFrequentWrongAnswers.length === 0 ? (
              <p className="text-center text-muted-foreground">{t('notEnoughData')}</p>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mostFrequentWrongAnswers}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${Math.round(percent * 100)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="question"
                    >
                      {mostFrequentWrongAnswers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [value, t('wrongCount')]}
                      labelFormatter={(label) => `${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WrongAnswersStats;
