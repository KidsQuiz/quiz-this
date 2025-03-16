
import React from 'react';
import { Star, Sparkles, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface CelebrationEffectProps {
  showEffect: boolean;
  points: number;
}

const CelebrationEffect = ({ showEffect, points }: CelebrationEffectProps) => {
  const { t } = useLanguage();
  
  // Generate confetti elements with colors from the app's palette
  const confettiElements = Array.from({ length: 15 }).map((_, i) => {
    const colors = [
      'bg-mathwondo-teal', 
      'bg-mathwondo-yellow', 
      'bg-mathwondo-orange', 
      'bg-mathwondo-blue',
      'bg-mathwondo-purple'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomDelay = `${Math.random() * 0.3}s`;
    const randomDuration = `${0.5 + Math.random() * 0.8}s`;
    const randomX = `${Math.random() * 100 - 50}%`;
    
    return (
      <div 
        key={i}
        className={cn(
          "absolute rounded-full",
          i % 3 === 0 ? "h-3 w-3" : i % 3 === 1 ? "h-2 w-2" : "h-4 w-4",
          randomColor
        )}
        style={{
          top: '-20px',
          left: '50%',
          transform: `translateX(${randomX})`,
          opacity: 0,
          animation: showEffect ? `confetti ${randomDuration} ease-out ${randomDelay} forwards` : 'none',
        }}
      />
    );
  });

  if (!showEffect) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-mathwondo-teal/10 rounded-lg animate-pulse"></div>
      
      {/* Confetti elements */}
      <div className="absolute inset-0 overflow-hidden">
        {confettiElements}
      </div>
      
      {/* Main celebration content */}
      <div className="flex flex-col items-center justify-center p-4 relative z-20">
        {/* Trophy icon */}
        <div className="mb-2">
          <Trophy className="h-10 w-10 text-mathwondo-yellow animate-bounce" />
        </div>
        
        {/* Points display */}
        <div className="flex items-center gap-1 mb-1 animate-scale-in">
          <span className="text-2xl font-bold text-mathwondo-orange">+{points}</span>
          <Star className="h-5 w-5 text-mathwondo-yellow" fill="currentColor" />
        </div>
        
        {/* Correct message */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-mathwondo-blue" />
          <span className="text-2xl font-bold bg-gradient-to-r from-mathwondo-blue to-mathwondo-teal text-transparent bg-clip-text">
            {t('correct')}
          </span>
          <Sparkles className="h-5 w-5 text-mathwondo-blue" />
        </div>
      </div>
    </div>
  );
};

export default CelebrationEffect;
