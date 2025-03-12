
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Avatar from './Avatar';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  points: number;
}

const UserProfile = () => {
  const { user, signOut } = useAuth();
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
      } finally {
        setIsLoading(false);
      }
    };
    
    getProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading profile...</div>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar 
        src={profile.avatar_url || "https://www.gravatar.com/avatar/?d=mp"} 
        alt={profile.username || "User"}
        size="md"
      />
      <div className="flex flex-col">
        <span className="font-medium">{profile.username || "User"}</span>
        <span className="text-sm text-muted-foreground">{profile.points} points</span>
      </div>
      <button 
        onClick={handleLogout}
        className="ml-4 text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
};

export default UserProfile;
