
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Avatar from './Avatar';
import { LogOut, User, Users, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
}

const Header = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isQuestionsPage = location.pathname.startsWith('/questions/');
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

  return (
    <header className="w-full bg-card shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-medium">Dashboard</h1>
          
          {!isQuestionsPage && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-6">
              <TabsList className="grid grid-cols-2 w-48">
                <TabsTrigger value="kids" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Kids</span>
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Packages</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        {!isLoading && profile && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium">{profile.username || "User"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar 
                src={profile.avatar_url || "https://www.gravatar.com/avatar/?d=mp"} 
                alt={profile.username || "User"}
                size="sm"
              />
              
              <button 
                onClick={handleLogout}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
