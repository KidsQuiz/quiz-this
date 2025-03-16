
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
      // Remove any global styles or event listeners
      document.body.style.removeProperty('pointer-events');
    };
  }, []);

  // Log boom effect state for debugging
  useEffect(() => {
    if (showBoomEffect) {
      console.log(t('boomEffectVisible'));
    }
  }, [showBoomEffect, t]);

  // Determine effective open state as a combination of parent control and internal state
  const effectiveOpenState = isOpen && isModalOpen;

  return (
    <>
      <Dialog 
        open={effectiveOpenState} 
        onOpenChange={(open) => {
          if (!open) {
            // When dialog is closing, call our custom close handler
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
              showRelaxAnimation={showRelaxAnimation}
              handleSelectAnswer={handleSelectAnswer}
            />
          )}
          
          {!isConfiguring && sessionComplete && (
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
        onComplete={() => {
          console.log(t('boomEffectComplete'));
          setShowBoomEffect(false);
        }} 
      />
    </>
  );
};

export default QuestionSession;
