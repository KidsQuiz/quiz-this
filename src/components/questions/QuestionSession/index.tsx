
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import ConfigScreen from './ConfigScreen';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import { QuestionSessionProps } from './types';

const QuestionSession = ({ isOpen, onClose, kidId, kidName }: QuestionSessionProps) => {
  const {
    isConfiguring,
    isLoading,
    currentQuestion,
    answerOptions,
    questionPackages,
    selectedPackageIds,
    questions,
    currentQuestionIndex,
    timeRemaining,
    sessionComplete,
    correctAnswers,
    totalPoints,
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showWowEffect,
    isModalOpen,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    handleSelectAnswer
  } = useQuestionSession(kidId, kidName, onClose);

  // Clean up effect for when component unmounts
  useEffect(() => {
    return () => {
      // Remove any global styles or event listeners
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  // Determine effective open state as a combination of parent control and internal state
  const effectiveOpenState = isOpen && isModalOpen;

  // Handle dialog close with proper cleanup
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Remove any applied styles before closing
      document.body.style.removeProperty('pointer-events');
      
      // If we're closing because the session is complete, call the parent's onClose
      if (sessionComplete) {
        onClose();
      }
    }
  };

  return (
    <Dialog 
      open={effectiveOpenState} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[950px] max-h-[90vh] overflow-y-auto"
        // Don't trap the focus inside the dialog when it's closing
        onEscapeKeyDown={() => {
          document.body.style.removeProperty('pointer-events');
        }}
        onInteractOutside={() => {
          document.body.style.removeProperty('pointer-events');
        }}
        onCloseAutoFocus={(e) => {
          // Prevent the default focus behavior which can cause issues
          e.preventDefault();
          document.body.style.removeProperty('pointer-events');
        }}
      >
        {isConfiguring && (
          <ConfigScreen
            questionPackages={questionPackages}
            selectedPackageIds={selectedPackageIds}
            isLoading={isLoading}
            togglePackageSelection={togglePackageSelection}
            selectAllPackages={selectAllPackages}
            deselectAllPackages={deselectAllPackages}
            onStartSession={handleStartSession}
            onClose={onClose}
          />
        )}
        
        {!isConfiguring && !sessionComplete && currentQuestion && (
          <QuestionDisplay
            currentQuestion={currentQuestion}
            answerOptions={answerOptions}
            currentQuestionIndex={currentQuestionIndex}
            questionsTotal={questions.length}
            timeRemaining={timeRemaining}
            answerSubmitted={answerSubmitted}
            selectedAnswerId={selectedAnswerId}
            isCorrect={isCorrect}
            showWowEffect={showWowEffect}
            handleSelectAnswer={handleSelectAnswer}
          />
        )}
        
        {!isConfiguring && sessionComplete && (
          <CompletionScreen
            kidName={kidName}
            totalPoints={totalPoints}
            correctAnswers={correctAnswers}
            totalQuestions={questions.length}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSession;
