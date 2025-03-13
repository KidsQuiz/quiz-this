
import React, { useEffect, useState } from 'react';
import { Sparkles, PartyPopper, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BoomEffectProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const BoomEffect = ({ isVisible, onComplete }: BoomEffectProps) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }).map((_, i) => {
        const colors = ['bg-amber-500', 'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500'];
        const sizes = ['h-3 w-3', 'h-4 w-4', 'h-5 w-5'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const randomLeft = `${Math.random() * 100}%`;
        const randomDelay = `${Math.random() * 0.5}s`;
        const randomDuration = `${0.5 + Math.random() * 1.5}s`;
        
        return (
          <div 
            key={i}
            className={cn(
              "absolute rounded-full opacity-0",
              randomSize,
              randomColor
            )}
            style={{
              left: randomLeft,
              top: '50%',
              animation: `boom-particle ${randomDuration} ease-out ${randomDelay} forwards`
            }}
          />
        );
      });
      
      setParticles(newParticles);
      
      // Call onComplete after animation ends
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes boom-particle {
            0% {
              transform: translate(0, 0) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 300}px) scale(1) rotate(${Math.random() * 360}deg);
              opacity: 0;
            }
          }
          
          @keyframes boom-scale {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes boom-rotate {
            0% { transform: rotate(0deg) scale(0.8); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `
      }} />
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      
      {/* Particles */}
      {particles}
      
      {/* Center content */}
      <div className="relative flex flex-col items-center animate-[boom-scale_0.5s_forwards]">
        <div className="text-4xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-transparent bg-clip-text">
          FANTASTIC!
        </div>
        
        <div className="flex gap-4 justify-center animate-[boom-rotate_2s_linear_infinite]">
          <Trophy className="h-10 w-10 text-amber-500" />
          <PartyPopper className="h-10 w-10 text-pink-500" />
          <Sparkles className="h-10 w-10 text-purple-500" />
        </div>
        
        <div className="mt-4 text-xl font-medium text-white text-center">
          You answered all questions correctly!
        </div>
      </div>
    </div>
  );
};

export default BoomEffect;
