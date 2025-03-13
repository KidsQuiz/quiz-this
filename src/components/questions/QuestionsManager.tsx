
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import QuestionsList from './QuestionsList';
import QuestionForm from './QuestionForm';
import ImportQuestionsDialog from './ImportQuestionsDialog';
import { useQuestionsData } from '@/hooks/useQuestionsData';
import { MessageCircleQuestion, ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const QuestionsManager = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { questions, isLoading, fetchQuestions, deleteQuestion, deleteAllQuestions } = useQuestionsData(packageId);
  const { t } = useLanguage();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(undefined);
  const [packageName, setPackageName] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    const getPackageName = async () => {
      if (!packageId) return;
      
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('name')
          .eq('id', packageId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setPackageName(data.name);
        }
      } catch (error) {
        console.error('Error fetching package name:', error);
      }
    };
    
    getPackageName();
  }, [packageId]);
  
  const handleAddQuestion = () => {
    setSelectedQuestionId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setIsFormOpen(true);
  };
  
  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleDeleteAllQuestions = async () => {
    if (await deleteAllQuestions()) {
      setIsDeleteDialogOpen(false);
    }
  };
  
  if (!packageId) {
    return <div>{t('somethingWentWrong')}</div>;
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-2 px-0"
          onClick={() => navigate('/packages')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('packages')}
        </Button>
        
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MessageCircleQuestion className="h-5 w-5" />
            <span>{t('questions')} {packageName}</span>
          </h3>
          <div className="flex gap-2">
            {questions.length > 0 && (
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{t('deleteAll')}</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteAllQuestions')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('deleteAllQuestionsConfirmation').replace('{package}', packageName)}
                      {' '}
                      {t('thisActionCannotBeUndone')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAllQuestions}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('deleteAll')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button 
              variant="outline" 
              onClick={handleOpenImportDialog} 
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>{t('import')}</span>
            </Button>
            <Button onClick={handleAddQuestion} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>{t('addQuestion')}</span>
            </Button>
          </div>
        </div>
      </div>
      
      <QuestionsList 
        questions={questions}
        isLoading={isLoading}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={deleteQuestion}
        onAddQuestion={handleAddQuestion}
        packageName={packageName}
      />
      
      <QuestionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchQuestions}
        questionId={selectedQuestionId}
        packageId={packageId}
      />
      
      <ImportQuestionsDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={fetchQuestions}
        packageId={packageId}
      />
    </div>
  );
};

export default QuestionsManager;
