
import { useState } from 'react';

interface KidAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  points: number;
  timestamp: Date;
}

export const useSessionState = () => {
  const [timeBetweenQuestions, setTimeBetweenQuestions] = useState(5);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showWowEffect, setShowWowEffect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [kidAnswers, setKidAnswers] = useState<KidAnswer[]>([]);

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
