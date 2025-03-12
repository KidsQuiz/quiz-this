
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        navigate('/');
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            },
          },
        });

        if (error) throw error;
        
        toast({
          title: "Account created",
          description: "Please check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      // Log the error to get more details for debugging
      console.error("Authentication error:", error);
      
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <div className="text-center py-8">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? 'Sign up to start your journey' : 'Sign in to your account'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Username (optional)
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-background border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    placeholder="Choose a username"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-input rounded-md p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none"
                  placeholder="•••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full flex justify-center items-center bg-primary text-primary-foreground py-3 rounded-md transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Designed with precision and simplicity.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
