
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, XCircle, BarChart, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WrongAnswersList from './WrongAnswersList';
import WrongAnswersStats from './WrongAnswersStats';
import { useWrongAnswers } from './hooks/useWrongAnswers';
import { WrongAnswersDashboardProps } from './types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WrongAnswersDashboard = ({ isOpen, onClose, kidId, kidName }: WrongAnswersDashboardProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('list');
  const { wrongAnswers, groupedWrongAnswers, isLoading, resetWrongAnswers } = useWrongAnswers(kidId, isOpen);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleResetConfirm = async () => {
    await resetWrongAnswers();
    setIsResetDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              {t('wrongAnswersDashboard')}: {kidName}
            </DialogTitle>
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
              <WrongAnswersList 
                groupedWrongAnswers={groupedWrongAnswers}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="stats" className="flex-1 overflow-auto">
              <WrongAnswersStats wrongAnswers={wrongAnswers} kidName={kidName} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsResetDialogOpen(true)}
              className="flex items-center gap-2 text-red-500"
              disabled={wrongAnswers.length === 0 || isLoading}
            >
              <RefreshCw className="h-4 w-4" />
              {t('resetWrongAnswers')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('resetWrongAnswers')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('resetWrongAnswersConfirmation').replace('{name}', kidName)}
              <br /><br />
              {t('thisActionCannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              {t('resetWrongAnswers')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WrongAnswersDashboard;
