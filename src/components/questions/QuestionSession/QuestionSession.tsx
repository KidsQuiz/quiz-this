
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import BoomEffect from './components/BoomEffect';
import RelaxAnimation from './components/RelaxAnimation';

interface QuestionSessionProps {
  kidId: string;
  kidName: string;
  onClose: () => void;
}

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
          ) : (
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
