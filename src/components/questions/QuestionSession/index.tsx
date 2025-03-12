
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import ConfigScreen from './ConfigScreen';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import { QuestionSessionProps } from './types';

const QuestionSession = ({ isOpen, onClose, kidId, kidName }: QuestionSessionProps) => {
  const {
    timeBetweenQuestions,
    setTimeBetweenQuestions,
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
    togglePackageSelection,
    selectAllPackages,
    deselectAllPackages,
    handleStartSession,
    handleSelectAnswer
  } = useQuestionSession(kidId, kidName, onClose);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        {isConfiguring && (
          <ConfigScreen
            questionPackages={questionPackages}
            selectedPackageIds={selectedPackageIds}
            timeBetweenQuestions={timeBetweenQuestions}
            isLoading={isLoading}
            togglePackageSelection={togglePackageSelection}
            selectAllPackages={selectAllPackages}
            deselectAllPackages={deselectAllPackages}
            setTimeBetweenQuestions={setTimeBetweenQuestions}
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
            timeBetweenQuestions={timeBetweenQuestions}
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
