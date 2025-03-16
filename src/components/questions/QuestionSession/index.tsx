
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import ConfigScreen from './ConfigScreen';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import BoomEffect from './components/BoomEffect';
import { QuestionSessionProps } from './types';
import { useToastAndLanguage } from './hooks/useToastAndLanguage';

const QuestionSession = ({ isOpen, onClose, kidId, kidName }: QuestionSessionProps) => {
  const { t } = useToastAndLanguage();
  
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
    showRelaxAnimation,
    showBoomEffect,
    setShowBoomEffect,
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
      // Always restore pointer events when unmounting
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  // Log boom effect state for debugging
  useEffect(() => {
    if (showBoomEffect) {
      console.log(t('boomEffectVisible'));
    }
  }, [showBoomEffect, t]);

  // Handle boom effect completion
  const handleBoomEffectComplete = () => {
    console.log(t('boomEffectComplete'));
    // Explicitly restore pointer events
    document.body.style.removeProperty('pointer-events');
    setShowBoomEffect(false);
    
    // If dialog is already closed, call onClose to ensure complete cleanup
    if (!isModalOpen) {
      onClose();
    }
  };

  // When the dialog is closed externally (by ESC key or clicking outside),
  // make sure we clean up properly
  useEffect(() => {
    if (!isOpen && !showBoomEffect) {
      // Ensure cleanup happens
      handleDialogClose();
    }
  }, [isOpen, showBoomEffect, handleDialogClose]);

  // For perfect scores, we want to completely skip the dialog
  const isPerfectScore = correctAnswers === questions.length && questions.length > 0 && sessionComplete;

  return (
    <>
      <Dialog 
        open={isOpen && isModalOpen && !isPerfectScore} 
        onOpenChange={(open) => {
          if (!open) {
            // When dialog is closing, call our custom close handler which ensures cleanup
            handleDialogClose();
          }
        }}
      >
        <DialogContent 
          className="sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[1100px] h-[92vh] max-h-[800px] p-4 flex flex-col overflow-hidden"
          onEscapeKeyDown={() => {
            handleDialogClose();
          }}
          onInteractOutside={() => {
            // Always ensure pointer events are restored
            document.body.style.removeProperty('pointer-events');
          }}
          onCloseAutoFocus={(e) => {
            // Prevent the default focus behavior which can cause issues
            e.preventDefault();
            // Always ensure pointer events are restored
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
              showRelaxAnimation={showRelaxAnimation}
              handleSelectAnswer={handleSelectAnswer}
            />
          )}
          
          {!isConfiguring && sessionComplete && !isPerfectScore && (
            <CompletionScreen
              kidName={kidName}
              totalPoints={totalPoints}
              correctAnswers={correctAnswers}
              totalQuestions={questions.length}
              onClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Boom effect shown when the kid answers all questions correctly - outside Dialog */}
      <BoomEffect 
        isVisible={showBoomEffect} 
        onComplete={handleBoomEffectComplete} 
      />
    </>
  );
};

export default QuestionSession;
