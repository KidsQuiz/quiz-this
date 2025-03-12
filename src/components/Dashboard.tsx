
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  points: number;
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
          .select('username, avatar_url, points')
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
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6 text-center animate-fade-in">
        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-balance">
          Your Activity Summary
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
          View your profile information and activity stats.
        </p>
      </div>
      
      <Card title="Achievement Points" className="max-w-sm mx-auto" delay={100}>
        <div className="flex items-center justify-center gap-3 mt-3">
          {isLoading ? (
            <div className="h-5 bg-muted/50 rounded animate-pulse w-20"></div>
          ) : (
            <div className="flex items-center">
              <div className="text-2xl font-bold">{(profile?.points || 0).toLocaleString()}</div>
              <div className="ml-2 bg-primary/10 text-primary p-1 rounded-full">
                <Trophy size={16} className="animate-float" />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
