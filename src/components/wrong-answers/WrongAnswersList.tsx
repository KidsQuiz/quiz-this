
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GroupedWrongAnswer } from './types';
import { formatDate } from './utils/wrongAnswersUtils';

interface WrongAnswersListProps {
  groupedWrongAnswers: GroupedWrongAnswer[];
  isLoading: boolean;
}

const WrongAnswersList = ({ groupedWrongAnswers, isLoading }: WrongAnswersListProps) => {
  const { t } = useLanguage();
  const hasWrongAnswers = groupedWrongAnswers.length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!hasWrongAnswers) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center pt-8 pb-8">
          <Check className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('allCorrect')}</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {t('noWrongAnswers')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 overflow-auto pr-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">{t('question')}</TableHead>
            <TableHead className="w-[20%]">{t('wrongAnswer')}</TableHead>
            <TableHead className="w-[20%]">{t('correctAnswer')}</TableHead>
            <TableHead className="w-[15%]">{t('date')}</TableHead>
            <TableHead className="w-[10%]">{t('occurrences')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupedWrongAnswers.map((answer) => (
            <TableRow key={answer.id}>
              <TableCell className="font-medium">{answer.question_content}</TableCell>
              <TableCell>
                <Badge variant="destructive" className="font-normal">
                  {answer.answer_content}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {answer.correct_answer_content}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(answer.latest_date)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-semibold">
                  {answer.count}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WrongAnswersList;
