
import { useState } from 'react';

export const useSessionState = () => {
  const [timeBetweenQuestions, setTimeBetweenQuestions] = useState(5);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [kidAnswers, setKidAnswers] = useState<Array<{
    questionId: string,
    answerId: string,
    isCorrect: boolean,
    points: number,
    timestamp: Date
  }>>([]);

  return {
    timeBetweenQuestions,
    setTimeBetweenQuestions,
    isConfiguring,
    setIsConfiguring,
    sessionComplete,
    setSessionComplete,
    correctAnswers,
    setCorrectAnswers,
    totalPoints,
    setTotalPoints,
    showWowEffect,
    setShowWowEffect,
    isModalOpen,
    setIsModalOpen,
    kidAnswers,
    setKidAnswers
  };
};
