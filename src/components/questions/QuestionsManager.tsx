
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionsData } from '@/hooks/useQuestionsData';
import { useLanguage } from '@/contexts/LanguageContext';
import QuestionsList from './QuestionsList';
import QuestionForm from './QuestionForm';
import ImportQuestionsDialog from './ImportQuestionsDialog';
import QuestionsHeader from './QuestionsHeader';
import { usePackageData } from '@/hooks/questions/usePackageData';
import { useQuestionSelection } from '@/hooks/questions/useQuestionSelection';
import { useDeleteQuestions } from '@/hooks/questions/useDeleteQuestions';

const QuestionsManager = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { t } = useLanguage();
  const { 
    questions, 
    isLoading, 
    fetchQuestions, 
    deleteQuestion,
    cloneQuestion 
  } = useQuestionsData(packageId);
  const { packageName } = usePackageData(packageId);
  const { selectedQuestions, handleSelectQuestion, handleSelectAllQuestions, clearSelections } = useQuestionSelection(questions);
  const { handleDeleteSelectedQuestions, isDeleting } = useDeleteQuestions(deleteQuestion, fetchQuestions);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleAddQuestion = () => {
    setSelectedQuestionId(undefined);
    setIsFormOpen(true);
  };
  
  const handleEditQuestion = (id: string) => {
    setSelectedQuestionId(id);
    setIsFormOpen(true);
  };
  
  const handleCloneQuestion = async (id: string) => {
    await cloneQuestion(id);
  };
  
  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true);
  };

  const handleDeleteSelected = async () => {
    const success = await handleDeleteSelectedQuestions(selectedQuestions);
    if (success) {
      clearSelections();
      setIsDeleteDialogOpen(false);
    }
  };
  
  if (!packageId) {
    return <div>{t('somethingWentWrong')}</div>;
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <QuestionsHeader 
        packageName={packageName}
        questions={questions}
        selectedQuestions={selectedQuestions}
        onSelectAllQuestions={handleSelectAllQuestions}
        onDeleteSelected={handleDeleteSelected}
        onAddQuestion={handleAddQuestion}
        onOpenImportDialog={handleOpenImportDialog}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isDeleting={isDeleting}
      />
      
      <QuestionsList 
        questions={questions}
        isLoading={isLoading}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={deleteQuestion}
        onCloneQuestion={handleCloneQuestion}
        onAddQuestion={handleAddQuestion}
        packageName={packageName}
        selectedQuestions={selectedQuestions}
        onSelectQuestion={handleSelectQuestion}
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
