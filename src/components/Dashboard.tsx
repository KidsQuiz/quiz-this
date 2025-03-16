
import React, { useEffect, useState } from 'react';
import { KidsManager } from './kids';
import PackagesManager from './packages/PackagesManager';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

const Dashboard = ({ activeTab }) => {
  const [isSettingUpRls, setIsSettingUpRls] = useState(false);
  const [rlsError, setRlsError] = useState<string | null>(null);

  // One-time setup for RLS policies
  useEffect(() => {
    const setupRlsPolicies = async () => {
      try {
        // Only run this once
        const storageKey = 'rls_policy_setup_complete';
        if (localStorage.getItem(storageKey)) return;

        setIsSettingUpRls(true);

        // Check if we have the necessary permissions
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) {
          setIsSettingUpRls(false);
          return;
        }

        // Execute RPC to create RLS policy with a timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('RLS policy setup timed out')), 15000)
        );

        const setupPromise = supabase.rpc('create_kid_wrong_answers_policy', {});
        
        try {
          await Promise.race([setupPromise, timeoutPromise]);
          localStorage.setItem(storageKey, 'true');
          console.log('RLS policy setup complete');
        } catch (err) {
          console.warn('Could not set up RLS policy:', err instanceof Error ? err.message : String(err));
          setRlsError("RLS policy setup failed. Some features may be limited.");
        }
      } catch (err) {
        console.warn('Error during RLS policy setup:', err);
      } finally {
        setIsSettingUpRls(false);
      }
    };

    setupRlsPolicies();
  }, []);

  const handleRetryRls = () => {
    localStorage.removeItem('rls_policy_setup_complete');
    setRlsError(null);
    window.location.reload();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {rlsError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Setup Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{rlsError}</span>
            <Button size="sm" onClick={handleRetryRls}>Retry Setup</Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isSettingUpRls ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Setting up database permissions...</p>
        </div>
      ) : (
        <>
          {activeTab === 'kids' && <KidsManager />}
          {activeTab === 'packages' && <PackagesManager />}
        </>
      )}
    </div>
  );
};

export default Dashboard;
