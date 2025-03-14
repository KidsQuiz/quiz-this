
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Check, AlertTriangle, Clock, XCircle, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WrongAnswersStats from './WrongAnswersStats';
import { useToast } from '@/hooks/use-toast';

interface WrongAnswersDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
}

interface WrongAnswer {
  id: string;
  kid_id: string;
  question_id: string;
  answer_id: string;
  question_content: string;
  answer_content: string;
  correct_answer_content: string;
  created_at: string;
}

const WrongAnswersDashboard = ({ isOpen, onClose, kidId, kidName }: WrongAnswersDashboardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    if (isOpen && kidId) {
      fetchWrongAnswers();
    }
  }, [isOpen, kidId]);

  const fetchWrongAnswers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching wrong answers for kid:', kidId);
      const { data, error } = await supabase
        .from('kid_wrong_answers')
        .select('*')
        .eq('kid_id', kidId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wrong answers:', error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('error')
        });
        throw error;
      }
      
      console.log('Wrong answers fetched:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample wrong answer:', data[0]);
      }
      
      setWrongAnswers(data || []);
    } catch (error) {
      console.error('Error fetching wrong answers:', error);
      setWrongAnswers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return new Intl.DateTimeFormat('default', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Error';
    }
  };

  const hasWrongAnswers = wrongAnswers.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            {t('wrongAnswersDashboard')}: {kidName}
          </DialogTitle>
          <DialogDescription>
            {hasWrongAnswers 
              ? t('wrongAnswersDescription', {count: wrongAnswers.length}) 
              : t('noWrongAnswers')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              {t('wrongAnswersList')}
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              {t('statistics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="flex-1 overflow-hidden flex flex-col mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <p>{t('loading')}</p>
              </div>
            ) : !hasWrongAnswers ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center pt-8 pb-8">
                  <Check className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t('allCorrect')}</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {t('noWrongAnswers')}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="flex-1 overflow-auto pr-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">{t('question')}</TableHead>
                      <TableHead className="w-[25%]">{t('wrongAnswer')}</TableHead>
                      <TableHead className="w-[25%]">{t('correctAnswer')}</TableHead>
                      <TableHead className="w-[10%]">{t('date')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wrongAnswers.map((answer) => (
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
                          {formatDate(answer.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-auto">
            <WrongAnswersStats wrongAnswers={wrongAnswers} kidName={kidName} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WrongAnswersDashboard;
