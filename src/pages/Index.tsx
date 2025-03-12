
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 flex items-start justify-center pt-8">
        <Dashboard />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default Index;
