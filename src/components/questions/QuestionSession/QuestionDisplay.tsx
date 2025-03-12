
import React, { useEffect } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, CheckCircle, XCircle, Sparkles, Trophy, PartyPopper, Rocket } from 'lucide-react';
import { Question, AnswerOption } from '@/hooks/questionsTypes';
import { cn } from '@/lib/utils';
import { playSound } from '@/utils/soundEffects';

interface QuestionDisplayProps {
  currentQuestion: Question;
  answerOptions: AnswerOption[];
  currentQuestionIndex: number;
  questionsTotal: number;
  timeRemaining: number;
  answerSubmitted: boolean;
  selectedAnswerId: string | null;
  isCorrect: boolean;
  showWowEffect: boolean;
  timeBetweenQuestions: number;
  handleSelectAnswer: (answerId: string) => void;
}

const QuestionDisplay = ({
  currentQuestion,
  answerOptions,
  currentQuestionIndex,
  questionsTotal,
  timeRemaining,
  answerSubmitted,
  selectedAnswerId,
  isCorrect,
  showWowEffect,
  timeBetweenQuestions,
  handleSelectAnswer
}: QuestionDisplayProps) => {
  // Calculate progress percentage with boundaries
  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / currentQuestion.time_limit) * 100));
  
  // Determine progress color based on remaining time
  const progressColor = progressPercent > 50 
    ? "bg-green-500" 
    : progressPercent > 20 
      ? "bg-amber-500" 
      : "bg-red-500";
      
  // Play sound effect when answer is submitted
  useEffect(() => {
    if (answerSubmitted) {
      playSound(isCorrect ? 'correct' : 'incorrect');
    }
  }, [answerSubmitted, isCorrect]);

  // Confetti-like elements for celebration effect
  const confettiElements = Array.from({ length: 20 }).map((_, i) => {
    const colors = ['bg-amber-500', 'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomDelay = `${Math.random() * 0.5}s`;
    const randomDuration = `${0.5 + Math.random() * 1}s`;
    const randomX = `${Math.random() * 120 - 60}%`;
    const randomRotate = `${Math.random() * 360}deg`;
    
    return (
      <div 
        key={i}
        className={cn(
          "absolute rounded-full",
          i % 3 === 0 ? "h-4 w-4" : i % 3 === 1 ? "h-3 w-3" : "h-2 w-2",
          randomColor
        )}
        style={{
          top: '-20px',
          left: '50%',
          transform: `translateX(${randomX}) rotate(${randomRotate})`,
          opacity: 0,
          animation: showWowEffect ? `confetti ${randomDuration} ease-out ${randomDelay} forwards` : 'none',
        }}
      />
    );
  });

  // Collection of celebration icons
  const celebrationIcons = [
    <Sparkles key="sparkles" className="h-10 w-10 text-amber-500" />,
    <Trophy key="trophy" className="h-10 w-10 text-amber-500" />,
    <PartyPopper key="party" className="h-10 w-10 text-pink-500" />,
    <Rocket key="rocket" className="h-10 w-10 text-blue-500" />
  ];

  return (
    <>
      <DialogHeader className="mb-2">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold">Question {currentQuestionIndex + 1}/{questionsTotal}</DialogTitle>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-primary">{timeRemaining}s</span>
          </div>
        </div>
      </DialogHeader>
      
      <div className="py-6 space-y-6">
        <Progress 
          value={progressPercent} 
          className={cn("h-3 rounded-full transition-all", progressColor)} 
        />
        
        <div className="bg-gradient-to-r from-primary/15 to-primary/5 p-8 rounded-xl shadow-sm relative overflow-hidden">
          <p className="text-2xl font-medium leading-relaxed">{currentQuestion.content}</p>
          <div className="flex items-center gap-2 mt-4 bg-white/50 dark:bg-black/20 w-fit px-3 py-1.5 rounded-full">
            <Star className="h-5 w-5 text-amber-500" fill="#f59e0b" />
            <span className="text-base font-bold text-primary">{currentQuestion.points} points</span>
          </div>
          
          {showWowEffect && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
              
              {/* Stars/sparkles background */}
              <div className="absolute inset-0 overflow-hidden">
                {confettiElements}
              </div>
              
              {/* Main celebration container */}
              <div className="relative z-20 flex flex-col items-center">
                {/* Rotating icons */}
                <div className="flex items-center justify-center mb-2 relative">
                  <div className="absolute animate-spin-slow opacity-50 scale-125">
                    {celebrationIcons[0]}
                  </div>
                  <div className="animate-bounce scale-150">
                    {celebrationIcons[1]}
                  </div>
                </div>
                
                {/* Points earned with animation */}
                <div className="flex items-center justify-center gap-2 animate-float mb-1">
                  <span className="text-3xl font-bold text-amber-500 animate-scale-in">+{currentQuestion.points}</span>
                  <Star className="h-6 w-6 text-amber-500" fill="#f59e0b" />
                </div>
                
                {/* Success message with animation */}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text text-3xl font-extrabold animate-pulse-soft">
                  Correct!
                </span>
                
                {/* Additional celebration icons */}
                <div className="flex mt-2 gap-3">
                  <div className="animate-bounce-delayed">{celebrationIcons[2]}</div>
                  <div className="animate-float">{celebrationIcons[3]}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mt-6">
          {answerOptions.map(option => {
            // Determine styling based on answer state
            const isSelected = selectedAnswerId === option.id;
            const isCorrectAnswer = option.is_correct;
            const isIncorrectSelection = answerSubmitted && isSelected && !isCorrectAnswer;
            
            let answerClasses = cn(
              "w-full p-5 text-left rounded-xl border-2 text-lg transition-all",
              isSelected && !answerSubmitted && "border-primary bg-primary/10 shadow-md",
              answerSubmitted && isCorrectAnswer && "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md",
              isIncorrectSelection && "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-md",
              !isSelected && !answerSubmitted && "hover:bg-accent hover:border-accent/50 hover:shadow-md",
              answerSubmitted ? "cursor-default" : "cursor-pointer"
            );
            
            return (
              <button
                key={option.id}
                onClick={() => !answerSubmitted && handleSelectAnswer(option.id)}
                disabled={answerSubmitted}
                className={answerClasses}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{option.content}</span>
                  {answerSubmitted && isCorrectAnswer && (
                    <CheckCircle className="h-7 w-7 text-green-600" fill="#dcfce7" />
                  )}
                  {isIncorrectSelection && (
                    <XCircle className="h-7 w-7 text-red-600" fill="#fee2e2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {answerSubmitted && (
          <div 
            className={cn(
              "p-5 rounded-xl text-lg shadow-md border-2 animate-fade-in",
              isCorrect 
                ? "bg-green-50 border-green-500 text-green-800 dark:bg-green-950/30 dark:text-green-300" 
                : "bg-red-50 border-red-500 text-red-800 dark:bg-red-950/30 dark:text-red-300"
            )}
          >
            <p className="font-medium text-xl">
              {isCorrect 
                ? `Correct! +${currentQuestion.points} points 🎉` 
                : 'Incorrect. The correct answer is highlighted.'}
            </p>
            <p className="text-base mt-2">
              Next question in <span className="font-bold">{timeBetweenQuestions}</span> seconds...
            </p>
          </div>
        )}
      </div>
      
      {/* Add keyframe styles to the document head instead of using the problematic style tag */}
      <style>
        {`
          @keyframes confetti {
            0% {
              transform: translateY(0) translateX(0) rotate(0);
              opacity: 1;
            }
            100% {
              transform: translateY(350px) translateX(calc(var(--random-x, 0) * 200px - 100px)) rotate(720deg);
              opacity: 0;
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes bounce-delayed {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-20px);
            }
            60% {
              transform: translateY(-10px);
            }
          }
          
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
          
          .animate-bounce-delayed {
            animation: bounce-delayed 2s infinite;
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s forwards;
          }
        `}
      </style>
    </>
  );
};

export default QuestionDisplay;
