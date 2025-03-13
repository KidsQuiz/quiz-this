
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Question } from '@/hooks/useQuestionsData';
import { Edit, Trash2, Timer, Star, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  onEditQuestion: (id: string) => void;
  onDeleteQuestion: (id: string, showConfirm?: boolean) => void;
  onAddQuestion: () => void;
  packageName?: string;
  selectedQuestions?: Set<string>;
  onSelectQuestion?: (id: string, isSelected: boolean) => void;
}

const QuestionsList = ({ 
  questions, 
  isLoading, 
  onEditQuestion, 
  onDeleteQuestion, 
  onAddQuestion,
  packageName,
  selectedQuestions = new Set(),
  onSelectQuestion
}: QuestionsListProps) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {packageName 
            ? `${t('noPackages')} ${packageName} ${t('package')}` 
            : t('noPackages')
          }
        </p>
        <Button 
          variant="outline" 
          onClick={onAddQuestion} 
          className="mt-4"
        >
          {t('createFirstPackage')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="overflow-hidden transition-colors hover:shadow-md">
          <div className="p-4">
            <div className="flex items-start">
              {onSelectQuestion && (
                <div className="mt-1 mr-3">
                  <Checkbox 
                    id={`select-${question.id}`}
                    checked={selectedQuestions.has(question.id)}
                    onCheckedChange={(checked) => {
                      onSelectQuestion(question.id, checked === true);
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-medium text-base line-clamp-2">{question.content}</h3>
                
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span>{question.time_limit}s</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span>{question.points} {t('points')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditQuestion(question.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">{t('edit')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeleteQuestion(question.id, true)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('delete')}</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      <Button
        variant="outline"
        onClick={onAddQuestion}
        className="w-full py-6 border-dashed flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>{t('addQuestion')}</span>
      </Button>
    </div>
  );
};

export default QuestionsList;
