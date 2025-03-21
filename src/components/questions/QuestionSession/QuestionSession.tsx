
import React, { useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import BoomEffect from './components/BoomEffect';
import RelaxAnimation from './components/RelaxAnimation';
import { QuestionSessionProps } from './types';
import QuestionSessionContent from './components/QuestionSessionContent';
import ConfigScreen from './ConfigScreen';

const QuestionSession: React.FC<QuestionSessionProps> = ({ kidId, kidName, onClose }) => {
  const {
    isLoading,
    currentQuestion,
    answerOptions,
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
    showBoomEffect,
    showRelaxAnimation,
    isModalOpen,
    isConfiguring,
    handleSelectAnswer,
    handleDialogClose,
    setShowBoomEffect,
    loadQuestions,
    isTimeUp,
    showingTimeUpFeedback,
    // Package selection props
    questionPackages,
    selectedPackageIds,
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession
  } = useQuestionSession(kidId, kidName, onClose);

  // Handler for when the boom effect is complete or dismissed
  const handleBoomEffectComplete = useCallback(() => {
    console.log("Boom effect complete, hiding animation");
    setShowBoomEffect(false);
  }, [setShowBoomEffect]);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] p-0 gap-0 border-0 overflow-hidden min-h-[600px]">
          {isConfiguring ? (
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
          ) : (
            <QuestionSessionContent
              isLoading={isLoading}
              currentQuestion={currentQuestion}
              answerOptions={answerOptions}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              timeRemaining={timeRemaining}
              sessionComplete={sessionComplete}
              correctAnswers={correctAnswers}
              totalPoints={totalPoints}
              selectedAnswerId={selectedAnswerId}
              answerSubmitted={answerSubmitted}
              isCorrect={isCorrect}
              showWowEffect={showWowEffect}
              showRelaxAnimation={showRelaxAnimation}
              handleSelectAnswer={handleSelectAnswer}
              onClose={onClose}
              kidName={kidName}
              isTimeUp={isTimeUp}
              showingTimeUpFeedback={showingTimeUpFeedback}
            />
          )}
        </DialogContent>
      </Dialog>

      {showBoomEffect && (
        <BoomEffect 
          isVisible={showBoomEffect} 
          onComplete={handleBoomEffectComplete} 
          totalPoints={totalPoints}
        />
      )}

      {showRelaxAnimation && (
        <RelaxAnimation show={showRelaxAnimation} />
      )}
    </>
  );
};

export default QuestionSession;
