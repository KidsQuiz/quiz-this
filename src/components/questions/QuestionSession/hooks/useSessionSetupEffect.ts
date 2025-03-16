
import { useEffect } from 'react';
import { Question } from '@/hooks/questionsTypes';
import { useSessionInitialization } from './useSessionInitialization';
import { useQuestionChangeEffects } from './useQuestionChangeEffects';
import { useSessionTimeManagement } from './useSessionTimeManagement';
import { usePackageAutoLoader } from './usePackageAutoLoader';

/**
 * Handles session setup and initialization effects
 */
export const useSessionSetupEffect = (props: {
  kidId: string;
  onClose: () => void;
  loadQuestions: (selectedPackageIds: string[]) => Promise<void>;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  currentQuestionIndex: number;
  questions: Question[];
  sessionComplete: boolean;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  resetAnswerState: () => void;
  setAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnswerId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsCorrect: React.Dispatch<React.SetStateAction<boolean>>;
  loadAnswerOptions: (questionId: string) => Promise<void>;
  setTimeRemaining: (newTime: number) => void;
  setTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
  updateTimeLimit: (newTimeLimit: number) => void;
  resetAndStartTimer: (seconds: number) => void;
  timeUpTriggered: boolean;
  navigationTimeUpTriggered: boolean | undefined;
  timeRemaining: number;
  answerSubmitted: boolean;
  timerActive: boolean;
  setTimeUpTriggered: React.Dispatch<React.SetStateAction<boolean>>;
  setNavigationTimeUpTriggered?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Use initialization hook
  const { initialLoadComplete } = useSessionInitialization(
    props.kidId,
    props.loadQuestions,
    props.setCurrentQuestionIndex,
    props.onClose
  );

  // Use question change effects
  useQuestionChangeEffects(
    props.currentQuestionIndex,
    initialLoadComplete,
    props.questions,
    props.sessionComplete,
    props.setCurrentQuestion,
    props.resetAnswerState,
    props.setAnswerSubmitted,
    props.setSelectedAnswerId,
    props.setIsCorrect,
    props.loadAnswerOptions,
    props.setTimeRemaining,
    props.setTimerActive,
    props.updateTimeLimit,
    props.resetAndStartTimer
  );

  // Use session time management if setNavigationTimeUpTriggered exists
  if (props.setNavigationTimeUpTriggered) {
    useSessionTimeManagement({
      timeUpTriggered: props.timeUpTriggered,
      navigationTimeUpTriggered: props.navigationTimeUpTriggered,
      timeRemaining: props.timeRemaining,
      answerSubmitted: props.answerSubmitted,
      timerActive: props.timerActive,
      setTimeUpTriggered: props.setTimeUpTriggered,
      setNavigationTimeUpTriggered: props.setNavigationTimeUpTriggered,
      setTimerActive: props.setTimerActive
    });
  }
}
