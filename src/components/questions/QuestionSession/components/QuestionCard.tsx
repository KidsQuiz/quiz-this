
import React from 'react';
import { Star } from 'lucide-react';
import { Question } from '@/hooks/questionsTypes';

interface QuestionCardProps {
  question: Question;
  showWowEffect: boolean;
  children?: React.ReactNode;
}

const QuestionCard = ({ question, showWowEffect, children }: QuestionCardProps) => {
  return (
    <div className="bg-gradient-to-r from-primary/15 to-primary/5 p-8 rounded-xl shadow-sm relative overflow-hidden min-h-[220px]">
      <p className="text-2xl font-medium leading-relaxed mb-8">{question.content}</p>
      <div className="flex items-center gap-2 mt-4 bg-white/50 dark:bg-black/20 w-fit px-3 py-1.5 rounded-full">
        <Star className="h-5 w-5 text-amber-500" fill="#f59e0b" />
        <span className="text-base font-bold text-primary">{question.points} points</span>
      </div>
      
      {children}
    </div>
  );
};

export default QuestionCard;
