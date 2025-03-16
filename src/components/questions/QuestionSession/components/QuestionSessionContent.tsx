
import React from 'react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import CompletionScreen from '../CompletionScreen';
import QuestionDisplay from '../QuestionDisplay';
import LoadingIndicator from './LoadingIndicator';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { DialogTitle } from '@/components/ui/dialog';

interface QuestionSessionContentProps {
  isLoading: boolean;
  currentQuestion: Question | null;
  answerOptions: AnswerOption[];
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number;
  sessionComplete: boolean;
  correctAnswers: number;
  totalPoints: number;
  selectedAnswerId: string | null;
  answerSubmitted: boolean;
  isCorrect: boolean;
  showWowEffect: boolean;
  showRelaxAnimation: boolean;
  handleSelectAnswer: (answerId: string) => void;
  onClose: () => void;
  kidName: string;
  isTimeUp: boolean;
  showingTimeUpFeedback: boolean;
}

const QuestionSessionContent: React.FC<QuestionSessionContentProps> = ({
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
  showRelaxAnimation,
  handleSelectAnswer,
  onClose,
  kidName,
  isTimeUp,
  showingTimeUpFeedback
}) => {
  // Render a loading state if currentQuestion is null but we're not at the completion screen
  const isLoadingOrMissingQuestion = isLoading || (!sessionComplete && !currentQuestion);

  if (sessionComplete) {
    return (
      <CompletionScreen 
        kidName={kidName}
        correctAnswers={correctAnswers} 
        totalQuestions={questions.length}
        totalPoints={totalPoints}
        onClose={onClose}
      />
    );
  }
  
  if (isLoadingOrMissingQuestion) {
    return (
      <>
        <DialogTitle asChild>
          <VisuallyHidden>Loading Questions</VisuallyHidden>
        </DialogTitle>
        <LoadingIndicator />
      </>
    );
  }
  
  return (
    <QuestionDisplay
      currentQuestion={currentQuestion!}
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
      isTimeUp={isTimeUp}
      showingTimeUpFeedback={showingTimeUpFeedback}
    />
  );
};

export default QuestionSessionContent;
