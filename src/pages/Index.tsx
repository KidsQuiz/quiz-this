
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import QuestionsManager from '@/components/questions/QuestionsManager';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const location = useLocation();
  const isQuestionsPage = location.pathname.startsWith('/questions/');
  const [activeTab, setActiveTab] = useState('kids');
  const { t } = useLanguage();
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 flex items-start justify-center pt-8">
        {isQuestionsPage ? (
          <QuestionsManager />
        ) : (
          <Dashboard activeTab={activeTab} />
        )}
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>{t("designedWithPrecision")}</p>
      </footer>
    </div>
  );
};

export default Index;
