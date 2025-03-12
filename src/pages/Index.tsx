
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import QuestionsManager from '@/components/questions/QuestionsManager';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const location = useLocation();
  const isQuestionsPage = location.pathname.startsWith('/questions/');
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 flex items-start justify-center pt-8">
        {isQuestionsPage ? <QuestionsManager /> : <Dashboard />}
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default Index;
