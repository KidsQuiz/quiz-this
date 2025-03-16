
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
  // Show loading state if questions are still loading or no questions are available
  const isLoadingOrMissingQuestion = isLoading || (!sessionComplete && !currentQuestion);
  const noQuestionsAvailable = !isLoading && questions.length === 0;

  // Show completion screen if session is complete
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
  
  // Show loading indicator while questions are being prepared
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
  
  // If there are no questions available for this session
  if (noQuestionsAvailable) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64">
        <p className="text-lg text-center">No questions available for this session.</p>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Close
        </button>
      </div>
    );
  }
  
  // Render the question display when everything is ready
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
