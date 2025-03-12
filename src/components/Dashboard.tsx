import React, { useState, useEffect } from 'react';
import Card from './Card';
import Avatar from './Avatar';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UserProfile from './UserProfile';
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
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8 text-center animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-balance">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
          View and manage your profile information and activity stats.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <UserProfile />
      </div>
      
      <Card title="User Profile" className="relative overflow-visible max-w-md mx-auto" delay={100}>
        <div className="flex items-center gap-4 mt-3">
          {isLoading ? (
            <div className="w-16 h-16 rounded-full bg-muted/50 animate-pulse shrink-0"></div>
          ) : (
            <Avatar 
              src={profile?.avatar_url || "https://www.gravatar.com/avatar/?d=mp"} 
              alt={profile?.username || "User"} 
              size="md" 
              className="shrink-0"
            />
          )}
          
          <div className="flex-1 space-y-2">
            <div>
              <div className="text-xs text-muted-foreground">Username</div>
              {isLoading ? (
                <div className="h-5 bg-muted/50 rounded animate-pulse w-28"></div>
              ) : (
                <div className="text-base font-semibold">
                  {profile?.username || user?.email?.split('@')[0] || 'User'}
                </div>
              )}
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground">Achievement Points</div>
              {isLoading ? (
                <div className="h-5 bg-muted/50 rounded animate-pulse w-20"></div>
              ) : (
                <div className="flex items-center">
                  <div className="text-base font-semibold">{(profile?.points || 0).toLocaleString()}</div>
                  <div className="ml-2 bg-primary/10 text-primary p-0.5 rounded-full">
                    <Trophy size={12} className="animate-float" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary/5 blur-xl" />
      </Card>
    </div>
  );
};

export default Dashboard;
