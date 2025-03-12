
import React, { useState } from 'react';
import Header from '@/components/Header';
import PackagesManager from '@/components/packages/PackagesManager';
import KidsManager from '@/components/KidsManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package } from 'lucide-react';

const PackagesPage = () => {
  const [activeTab, setActiveTab] = useState('packages');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <main className="flex-1 flex items-start justify-center pt-8">
        <div className="w-full max-w-4xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="kids" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Kids</span>
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>Packages</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="kids">
              <KidsManager />
            </TabsContent>
            
            <TabsContent value="packages">
              <PackagesManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default PackagesPage;
