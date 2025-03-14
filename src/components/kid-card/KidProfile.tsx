
import React from 'react';
import { Baby, Star } from 'lucide-react';
import Avatar from '../Avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidProfileProps {
  name: string;
  age: number;
  avatarUrl: string | null;
  points: number;
}

const KidProfile = ({ 
  name, 
  age, 
  avatarUrl, 
  points 
}: KidProfileProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex justify-center">
        {avatarUrl ? (
          <Avatar 
            src={avatarUrl} 
            alt={name} 
            size="lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Baby className="w-12 h-12 text-primary" />
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{age} {t('age')}</p>
        
        <div className="mt-4 bg-primary/10 rounded-full py-2 px-4 inline-flex items-center justify-center gap-1.5 transform transition-all hover:scale-105">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="font-semibold text-primary">{points} {t('points')}</span>
        </div>
      </div>
    </div>
  );
};

export default KidProfile;
