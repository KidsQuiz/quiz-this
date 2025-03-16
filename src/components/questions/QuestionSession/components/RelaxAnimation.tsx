
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface RelaxAnimationProps {
  show: boolean;
}

const RelaxAnimation: React.FC<RelaxAnimationProps> = ({ show }) => {
  const [randomImage, setRandomImage] = useState<number>(1);
  const { t } = useLanguage();
  
  // Select a random image when the component mounts
  useEffect(() => {
    if (show) {
      setRandomImage(Math.floor(Math.random() * 3) + 1);
    }
  }, [show]);
  
  if (!show) return null;
  
  const imageMap = {
    1: '/images/relaxing-cat.jpg',
    2: '/images/cute-kitten.jpg',
    3: '/images/funny-penguins.jpg',
  };
  
  const imageUrl = imageMap[randomImage as keyof typeof imageMap];
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-md mx-auto shadow-xl"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <div className="text-center">
          <motion.h3 
            className="text-2xl font-bold mb-4 text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {t('dontWorry')}
          </motion.h3>
          
          <motion.div 
            className="mb-6 overflow-hidden rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img 
              src={imageUrl} 
              alt="Relaxing image" 
              className="w-full h-auto object-cover rounded-lg transform transition-all duration-500 hover:scale-105"
            />
          </motion.div>
          
          <motion.p 
            className="text-lg mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t('learningTakesTime')}
          </motion.p>
          
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {t('tryNextQuestion')}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RelaxAnimation;
