
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { WrongAnswer } from './types';
import { getMostFrequentWrongAnswers, getWrongAnswersByMonth } from './stats/chartDataUtils';
import FrequentWrongAnswersChart from './stats/FrequentWrongAnswersChart';
import MonthlyWrongAnswersChart from './stats/MonthlyWrongAnswersChart';
import WrongAnswersDistributionChart from './stats/WrongAnswersDistributionChart';

interface WrongAnswersStatsProps {
  wrongAnswers: WrongAnswer[];
  kidName: string;
}

const WrongAnswersStats = ({ wrongAnswers, kidName }: WrongAnswersStatsProps) => {
  const { t } = useLanguage();

  // Process and transform data for visualization
  const mostFrequentWrongAnswers = useMemo(() => 
    getMostFrequentWrongAnswers(wrongAnswers), [wrongAnswers]);

  // For time-based analysis
  const wrongAnswersByMonth = useMemo(() => 
    getWrongAnswersByMonth(wrongAnswers), [wrongAnswers]);

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
          <FrequentWrongAnswersChart data={mostFrequentWrongAnswers} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('wrongAnswersByTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyWrongAnswersChart data={wrongAnswersByMonth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('topWrongAnswersDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <WrongAnswersDistributionChart data={mostFrequentWrongAnswers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WrongAnswersStats;
