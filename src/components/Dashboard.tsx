
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
        // Use the any type to bypass TypeScript error while maintaining functionality
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
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-balance">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          View and manage your profile information and activity stats.
        </p>
      </div>
      
      <div className="flex justify-end mb-6">
        <UserProfile />
      </div>
      
      {/* Combined User Info Card */}
      <Card title="User Profile" className="relative overflow-visible" delay={100}>
        <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            {isLoading ? (
              <div className="w-24 h-24 rounded-full bg-muted/50 animate-pulse"></div>
            ) : (
              <Avatar 
                src={profile?.avatar_url || "https://www.gravatar.com/avatar/?d=mp"} 
                alt={profile?.username || "User"} 
                size="lg" 
              />
            )}
          </div>
          
          {/* User Info Section */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Name */}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Username</div>
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-48 mx-auto md:mx-0"></div>
              ) : (
                <div className="text-2xl font-semibold">
                  {profile?.username || user?.email?.split('@')[0] || 'User'}
                </div>
              )}
            </div>
            
            {/* Points */}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Achievement Points</div>
              {isLoading ? (
                <div className="h-8 bg-muted/50 rounded animate-pulse w-32 mx-auto md:mx-0"></div>
              ) : (
                <div className="flex items-center justify-center md:justify-start">
                  <div className="text-2xl font-semibold">{(profile?.points || 0).toLocaleString()}</div>
                  <div className="ml-2 bg-primary/10 text-primary p-1 rounded-full">
                    <Trophy size={16} className="animate-float" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-primary/5 blur-xl" />
      </Card>
    </div>
  );
};

export default Dashboard;
