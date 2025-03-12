
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import QuestionMetadataFields from './QuestionMetadataFields';
import AnswerOptionsList from './AnswerOptionsList';
import { useQuestionForm } from '@/hooks/useQuestionForm';

interface QuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  questionId?: string;
  packageId: string;
}

const QuestionForm = ({ isOpen, onClose, onSave, questionId, packageId }: QuestionFormProps) => {
  const { user } = useAuth();
  
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
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Question' : 'Create Question'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e) => handleSubmit(e, user?.id)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="content">Question</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your question"
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
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionForm;
