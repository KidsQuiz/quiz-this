
import React from 'react';
import { Star, Sparkles, Trophy, PartyPopper, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CelebrationEffectProps {
  showEffect: boolean;
  points: number;
}

const CelebrationEffect = ({ showEffect, points }: CelebrationEffectProps) => {
  // Collection of celebration icons
  const celebrationIcons = [
    <Sparkles key="sparkles" className="h-10 w-10 text-amber-500" />,
    <Trophy key="trophy" className="h-10 w-10 text-amber-500" />,
    <PartyPopper key="party" className="h-10 w-10 text-pink-500" />,
    <Rocket key="rocket" className="h-10 w-10 text-blue-500" />
  ];

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
          animation: showEffect ? `confetti ${randomDuration} ease-out ${randomDelay} forwards` : 'none',
        }}
      />
    );
  });

  if (!showEffect) return null;

  return (
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
          <span className="text-3xl font-bold text-amber-500 animate-scale-in">+{points}</span>
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
  );
};

export default CelebrationEffect;
