
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircleQuestion, Plus, Upload, Trash2, CheckSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Question } from '@/hooks/questionsTypes';
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

interface QuestionsHeaderProps {
  packageName: string;
  questions: Question[];
  selectedQuestions: Set<string>;
  onSelectAllQuestions: () => void;
  onDeleteSelected: () => void;
  onAddQuestion: () => void;
  onOpenImportDialog: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleting: boolean;
}

const QuestionsHeader = ({
  packageName,
  questions,
  selectedQuestions,
  onSelectAllQuestions,
  onDeleteSelected,
  onAddQuestion,
  onOpenImportDialog,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  isDeleting
}: QuestionsHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
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
            <>
              <Button 
                variant="outline" 
                onClick={onSelectAllQuestions}
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                <CheckSquare className="h-4 w-4" />
                <span>
                  {selectedQuestions.size === questions.length ? t('deselectAllQuestions') : t('selectAllQuestions')}
                </span>
              </Button>
              {selectedQuestions.size > 0 && (
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span>
                        {isDeleting 
                          ? t('deletingQuestions') || 'Deleting...' 
                          : `${t('deleteSelected')} (${selectedQuestions.size})`
                        }
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('deleteSelectedQuestions')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteSelectedQuestionsConfirmation')}
                        {' '}
                        {t('thisActionCannotBeUndone')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={onDeleteSelected}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        {t('deleteSelected')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
          <Button 
            variant="outline" 
            onClick={onOpenImportDialog} 
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            <Upload className="h-4 w-4" />
            <span>{t('import')}</span>
          </Button>
          <Button 
            onClick={onAddQuestion} 
            className="flex items-center gap-2"
            disabled={isDeleting}
          >
            <Plus className="h-4 w-4" />
            <span>{t('addQuestion')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsHeader;
