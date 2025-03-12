
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import KidsManager from './KidsManager';
import PackagesManager from './packages/PackagesManager';
import { TabsContent } from '@/components/ui/tabs';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('kids');

  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: error.message || "Couldn't load your profile information"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    getProfile();
  }, [user]);
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <TabsContent value="kids" className="mt-0">
        <KidsManager />
      </TabsContent>
      
      <TabsContent value="packages" className="mt-0">
        <PackagesManager />
      </TabsContent>
    </div>
  );
};

export default Dashboard;
