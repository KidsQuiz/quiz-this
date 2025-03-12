
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { Users, Package } from 'lucide-react';

const PackagesPage = () => {
  const [activeTab, setActiveTab] = useState('packages');

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main className="flex-1 flex items-start justify-center pt-8">
        <Dashboard activeTab={activeTab} />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default PackagesPage;
