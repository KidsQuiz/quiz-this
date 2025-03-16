
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeUpFeedbackProps {
  show: boolean;
}

const TimeUpFeedback: React.FC<TimeUpFeedbackProps> = ({ show }) => {
  const { t } = useLanguage();
  
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
        
        <p className="text-lg">
          {t('correctAnswerShown') || 'The correct answer is highlighted.'}
        </p>
      </div>
    </motion.div>
  );
};

export default TimeUpFeedback;
