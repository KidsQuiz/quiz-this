
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import KidsManager from './KidsManager';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="mb-8 text-center animate-fade-in">
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-balance">
          Your Family Dashboard
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
          Manage your profile information and family members.
        </p>
      </div>
      
      <div className="mb-12">
        <KidsManager />
      </div>
    </div>
  );
};

export default Dashboard;
