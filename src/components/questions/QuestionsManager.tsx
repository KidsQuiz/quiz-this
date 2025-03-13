
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import QuestionsList from './QuestionsList';
import QuestionForm from './QuestionForm';
import { useQuestionsData } from '@/hooks/useQuestionsData';
import { MessageCircleQuestion, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

const QuestionsManager = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const { questions, isLoading, fetchQuestions, deleteQuestion } = useQuestionsData(packageId);
  const { t } = useLanguage();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>(undefined);
  const [packageName, setPackageName] = useState<string>('');
  
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
          <Button onClick={handleAddQuestion} className="flex items-center gap-2">
            <span>{t('addQuestion')}</span>
          </Button>
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
    </div>
  );
};

export default QuestionsManager;
