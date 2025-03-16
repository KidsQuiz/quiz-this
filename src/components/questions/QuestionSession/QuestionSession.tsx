
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import BoomEffect from './components/BoomEffect';
import RelaxAnimation from './components/RelaxAnimation';
import { QuestionSessionProps } from './types';

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
    handleSelectAnswer,
    handleDialogClose
  } = useQuestionSession(kidId, kidName, onClose);

  // Render a loading state if currentQuestion is null but we're not at the completion screen
  const isLoadingOrMissingQuestion = isLoading || (!sessionComplete && !currentQuestion);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 border-0 overflow-hidden">
          {sessionComplete ? (
            <CompletionScreen 
              kidName={kidName}
              correctAnswers={correctAnswers} 
              totalQuestions={questions.length}
              totalPoints={totalPoints}
              onClose={onClose}
            />
          ) : isLoadingOrMissingQuestion ? (
            <div className="flex flex-col items-center justify-center p-12 h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg">Loading questions...</p>
            </div>
          ) : currentQuestion && (
            <QuestionDisplay
              currentQuestion={currentQuestion}
              answerOptions={answerOptions}
              currentQuestionIndex={currentQuestionIndex}
              questionsTotal={questions.length}
              timeRemaining={timeRemaining}
              selectedAnswerId={selectedAnswerId}
              answerSubmitted={answerSubmitted}
              isCorrect={isCorrect}
              showWowEffect={showWowEffect}
              showRelaxAnimation={showRelaxAnimation}
              handleSelectAnswer={handleSelectAnswer}
            />
          )}
        </DialogContent>
      </Dialog>

      {showBoomEffect && (
        <BoomEffect 
          isVisible={showBoomEffect} 
          onComplete={() => {}} 
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
