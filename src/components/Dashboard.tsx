
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Avatar from './Avatar';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UserProfile from './UserProfile';

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
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url, points')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
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
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Name Card */}
        <Card title="Name" delay={100}>
          {isLoading ? (
            <div className="mt-2 h-8 bg-muted/50 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="mt-2 text-2xl font-semibold">{profile?.username || user?.email?.split('@')[0] || 'User'}</div>
              <div className="text-sm text-muted-foreground mt-1">Your profile name</div>
            </>
          )}
        </Card>
        
        {/* Points Card */}
        <Card title="Points" className="relative overflow-visible" delay={200}>
          {isLoading ? (
            <div className="mt-2 h-8 bg-muted/50 rounded animate-pulse"></div>
          ) : (
            <>
              <div className="flex items-center mt-2">
                <div className="text-2xl font-semibold">{(profile?.points || 0).toLocaleString()}</div>
                <div className="ml-2 bg-primary/10 text-primary p-1 rounded-full">
                  <Trophy size={16} className="animate-float" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total earned points</div>
            </>
          )}
          
          {/* Decorative element */}
          <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-primary/5 blur-xl" />
        </Card>
        
        {/* Avatar Card */}
        <Card title="Avatar" delay={300}>
          <div className="flex justify-center items-center min-h-[100px] mt-2">
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
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
