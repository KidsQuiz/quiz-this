
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { AnswerOption } from '@/hooks/questionsTypes';
import { cn } from '@/lib/utils';

interface AnswerOptionsListProps {
  answerOptions: AnswerOption[];
  selectedAnswerId: string | null;
  answerSubmitted: boolean;
  handleSelectAnswer: (answerId: string) => void;
}

const AnswerOptionsList = ({ 
  answerOptions, 
  selectedAnswerId, 
  answerSubmitted, 
  handleSelectAnswer 
}: AnswerOptionsListProps) => {
  return (
    <div className="h-full overflow-auto pr-1">
      <div className="space-y-3">
        {answerOptions.map(option => {
          // Determine styling based on answer state
          const isSelected = selectedAnswerId === option.id;
          const isCorrectAnswer = option.is_correct;
          const isIncorrectSelection = answerSubmitted && isSelected && !isCorrectAnswer;
          
          let answerClasses = cn(
            "w-full p-4 text-left rounded-xl border-2 text-lg transition-all",
            isSelected && !answerSubmitted && "border-primary bg-primary/10 shadow-md",
            answerSubmitted && isCorrectAnswer && "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md",
            isIncorrectSelection && "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md",
            !isSelected && !answerSubmitted && "hover:bg-accent hover:border-accent/50 hover:shadow-md",
            answerSubmitted ? "cursor-default" : "cursor-pointer"
          );
          
          return (
            <button
              key={option.id}
              onClick={() => !answerSubmitted && handleSelectAnswer(option.id)}
              disabled={answerSubmitted}
              className={answerClasses}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{option.content}</span>
                {answerSubmitted && isCorrectAnswer && (
                  <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 ml-2" fill="#dcfce7" />
                )}
                {isIncorrectSelection && (
                  <XCircle className="h-8 w-8 text-red-600 flex-shrink-0 ml-2" fill="#fee2e2" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AnswerOptionsList;
