
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeUpFeedbackProps {
  show: boolean;
}

const TimeUpFeedback: React.FC<TimeUpFeedbackProps> = ({ show }) => {
  // Always return null to never show this component
  return null;
};

export default TimeUpFeedback;
