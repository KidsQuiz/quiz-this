
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeUpFeedbackProps {
  show: boolean;
}

const TimeUpFeedback: React.FC<TimeUpFeedbackProps> = ({ show }) => {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    if (!show) return;
    
    setCountdown(5);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [show]);
  
  if (!show) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex items-center justify-center z-50 bg-black/40"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <Clock className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {t('timeUp') || 'Time\'s Up!'}
        </h2>
        
        <p className="text-lg mb-4">
          {t('correctAnswerShown') || 'The correct answer is highlighted.'}
        </p>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-red-500 h-4 rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 5) * 100}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('nextQuestionIn') || 'Next question in'} <span className="font-bold">{countdown}</span> {t('seconds') || 'seconds'}
        </p>
      </div>
    </motion.div>
  );
};

export default TimeUpFeedback;
