
import React from 'react';
import Dashboard from '@/components/Dashboard';

// Mock user data
const userData = {
  name: "John Appleseed",
  points: 3500,
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1 flex items-center justify-center py-12">
        <Dashboard userData={userData} />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default Index;
