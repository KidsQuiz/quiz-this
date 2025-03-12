
import React from 'react';

const AnimationStyles = () => {
  return (
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
  );
};

export default AnimationStyles;
