
import React, { useEffect, useRef, useCallback } from 'react';
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
  // Create a ref to track answer options change (new question)
  const optionsRef = useRef<string[]>([]);
  const selectedIdRef = useRef<string | null>(null);
  
  // Update selectedIdRef whenever selectedAnswerId changes
  useEffect(() => {
    selectedIdRef.current = selectedAnswerId;
  }, [selectedAnswerId]);
  
  // Force re-render and reset selected state when answer options change
  useEffect(() => {
    const newOptionsIds = answerOptions.map(o => o.id).join(',');
    const previousOptionsIds = optionsRef.current.join(',');
    
    if (newOptionsIds !== previousOptionsIds) {
      console.log("New question detected: Answer options changed");
      // Update our ref
      optionsRef.current = answerOptions.map(o => o.id);
      
      // Force complete reset of any visual selection state
      // This ensures no answer appears selected when a new question loads
      selectedIdRef.current = null;
      
      // Clear DOM selection state immediately
      setTimeout(() => {
        console.log("Aggressively clearing any visual selection state");
        const allButtons = document.querySelectorAll('[data-answer-option]');
        allButtons.forEach(button => {
          button.setAttribute('data-selected', 'false');
          button.classList.remove('border-primary', 'bg-primary/10', 'shadow-md', 
                                'border-green-500', 'bg-green-50', 'dark:bg-green-950/30',
                                'border-red-500', 'bg-red-50', 'dark:bg-red-950/30');
          
          // Reset to default button styles
          button.classList.add('hover:bg-accent', 'hover:border-accent/50');
        });
      }, 0);
    }
  }, [answerOptions]);
  
  // Create a safe select handler that double-checks state
  const safeSelectAnswer = useCallback((answerId: string) => {
    if (answerSubmitted) {
      console.log("Answer already submitted, ignoring selection");
      return;
    }
    
    // Additional sanity check
    if (selectedIdRef.current) {
      console.log("Selection already exists, clearing before new selection");
      selectedIdRef.current = null;
      
      // Force quick DOM update
      const allButtons = document.querySelectorAll('[data-answer-option]');
      allButtons.forEach(button => {
        button.setAttribute('data-selected', 'false');
      });
      
      // Small delay before allowing new selection
      setTimeout(() => {
        console.log("Applying new selection:", answerId);
        handleSelectAnswer(answerId);
      }, 50);
    } else {
      handleSelectAnswer(answerId);
    }
  }, [answerSubmitted, handleSelectAnswer]);
  
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
          
          // Double check to prevent rendering selected state when it shouldn't be
          if (isSelected && !selectedAnswerId) {
            console.warn("Detected inconsistent state in AnswerOptionsList. Forcing unselected style.");
            answerClasses = cn(
              "w-full p-4 text-left rounded-xl border-2 text-lg transition-all",
              !answerSubmitted && "hover:bg-accent hover:border-accent/50 hover:shadow-md",
              "cursor-pointer"
            );
          }
          
          return (
            <button
              key={option.id}
              onClick={() => !answerSubmitted && safeSelectAnswer(option.id)}
              disabled={answerSubmitted}
              className={answerClasses}
              data-selected={isSelected ? "true" : "false"}
              data-submitted={answerSubmitted ? "true" : "false"}
              data-answer-option="true"
              data-answer-id={option.id}
              data-correct={isCorrectAnswer ? "true" : "false"}
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
