
import React, { useEffect } from 'react';
import { KidsManager } from './kids';
import PackagesManager from './packages/PackagesManager';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = ({ activeTab }) => {
  // One-time setup for RLS policies
  useEffect(() => {
    const setupRlsPolicies = async () => {
      try {
        // Only run this once
        const storageKey = 'rls_policy_setup_complete';
        if (localStorage.getItem(storageKey)) return;

        // Check if we have the necessary permissions
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        // Execute RPC to create RLS policy (this is safe because it's idempotent)
        const { error } = await supabase.rpc('create_kid_wrong_answers_policy', {});
        if (error) {
          console.warn('Could not set up RLS policy:', error.message);
        } else {
          localStorage.setItem(storageKey, 'true');
          console.log('RLS policy setup complete');
        }
      } catch (err) {
        console.warn('Error during RLS policy setup:', err);
      }
    };

    setupRlsPolicies();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {activeTab === 'kids' && <KidsManager />}
      {activeTab === 'packages' && <PackagesManager />}
    </div>
  );
};

export default Dashboard;
