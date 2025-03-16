
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

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
      className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center z-30 py-2 px-4"
    >
      <div className="bg-red-500 text-white font-bold text-lg px-4 py-2 rounded-md shadow-lg">
        {t('timeUp')}
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        {t('nextQuestionIn')} <span className="font-bold">{countdown}</span> {t('seconds')}
      </div>
    </motion.div>
  );
};

export default TimeUpFeedback;
