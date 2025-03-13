
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    setErrorMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) throw error;
        
        toast({
          title: t("accountCreated"),
          description: t("checkEmail"),
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: t("welcomeBack"),
          description: t("loginSuccess"),
        });
        
        navigate('/');
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      setErrorMessage(error.message || t("somethingWentWrong"));
      
      toast({
        variant: "destructive",
        title: t("authFailed"),
        description: error.message || t("somethingWentWrong"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <div className="text-center py-8">{t("redirecting")}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{isSignUp ? t("createAccount") : t("welcomeBack")}</h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? t("signUpToStart") : t("signInToAccount")}
            </p>
          </div>
          
          {errorMessage && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
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
                  {t("password")}
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
                <span className="animate-pulse">{t("processing")}</span>
              ) : (
                <span>{isSignUp ? t("createAccount") : t("signIn")}</span>
              )}
            </button>
          </form>
          
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>{t("designedWithPrecision")}</p>
      </footer>
    </div>
  );
};

export default AuthPage;
