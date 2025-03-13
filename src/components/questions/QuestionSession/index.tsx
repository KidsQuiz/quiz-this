
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
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
    handleSelectAnswer,
    handleDialogClose
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
      // When dialog is closing, call our custom close handler
      handleDialogClose();
    }
  };

  return (
    <Dialog 
      open={effectiveOpenState} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className="sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[1100px] h-[92vh] max-h-[800px] p-4 flex flex-col overflow-hidden"
        // Don't trap the focus inside the dialog when it's closing
        onEscapeKeyDown={() => {
          handleDialogClose();
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
