
import React, { useEffect, useState } from 'react';
import { Sparkles, PartyPopper, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface BoomEffectProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const BoomEffect = ({ isVisible, onComplete }: BoomEffectProps) => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);
  const { t } = useLanguage();
  
  // This effect handles the animation and cleanup
  useEffect(() => {
    if (isVisible) {
      console.log("🎉 BoomEffect is visible! Generating particles...");
      
      // Generate confetti particles
      const newParticles = Array.from({ length: 100 }).map((_, i) => {
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
        if (onComplete) {
          console.log("🎉 BoomEffect animation complete, calling onComplete");
          // Always restore pointer events before calling onComplete
          document.body.style.removeProperty('pointer-events');
          onComplete();
        }
      }, 5000); // Keep at 5000 for visibility
      
      return () => {
        clearTimeout(timer);
        // Ensure pointer events are restored on cleanup
        document.body.style.removeProperty('pointer-events');
      };
    }
  }, [isVisible, onComplete]);
  
  // Always ensure pointer events are restored when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.removeProperty('pointer-events');
    };
  }, []);
  
  if (!isVisible) return null;
  
  // Handle click to dismiss
  const handleClick = () => {
    console.log("BoomEffect clicked, dismissing...");
    document.body.style.removeProperty('pointer-events');
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
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
              transform: translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 400}px) scale(1) rotate(${Math.random() * 360}deg);
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
      
      {/* Background overlay with increased opacity */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" />
      
      {/* Particles */}
      {particles}
      
      {/* Center content */}
      <div className="relative flex flex-col items-center animate-[boom-scale_0.5s_forwards]">
        <div className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          {t('fantastic')}
        </div>
        
        <div className="flex gap-6 justify-center animate-[boom-rotate_2s_linear_infinite]">
          <Trophy className="h-12 w-12 text-amber-500" />
          <PartyPopper className="h-12 w-12 text-pink-500" />
          <Sparkles className="h-12 w-12 text-purple-500" />
        </div>
        
        <div className="mt-6 text-2xl font-medium text-white text-center drop-shadow-md">
          {t('allCorrectAnswers')}
        </div>
        
        <div className="mt-8 text-white/80 text-sm animate-pulse">
          {t('clickToDismiss')}
        </div>
      </div>
    </div>
  );
};

export default BoomEffect;
