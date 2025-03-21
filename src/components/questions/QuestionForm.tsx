
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import QuestionMetadataFields from './QuestionMetadataFields';
import AnswerOptionsList from './AnswerOptionsList';
import { useQuestionForm } from '@/hooks/useQuestionForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  questionId?: string;
  packageId: string;
}

const QuestionForm = ({ isOpen, onClose, onSave, questionId, packageId }: QuestionFormProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const {
    content,
    setContent,
    timeLimit,
    setTimeLimit,
    points,
    setPoints,
    answers,
    isLoading,
    isEditMode,
    handleAnswerChange,
    handleSubmit
  } = useQuestionForm(questionId, packageId, onSave, onClose);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('editQuestion') : t('addQuestion')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e) => handleSubmit(e, user?.id)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">{t('question')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('questionText')}
              disabled={isLoading}
              required
              className="min-h-20"
            />
          </div>
          
          <QuestionMetadataFields
            timeLimit={timeLimit}
            points={points}
            isLoading={isLoading}
            onTimeLimitChange={setTimeLimit}
            onPointsChange={setPoints}
          />
          
          <AnswerOptionsList
            answers={answers}
            isLoading={isLoading}
            onAnswerChange={handleAnswerChange}
          />
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : (isEditMode ? t('update') : t('create'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
