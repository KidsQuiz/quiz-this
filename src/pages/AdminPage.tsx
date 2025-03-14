
import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Header from '@/components/Header';
import AdminErrorBoundaryWithLanguage from '@/components/admin/AdminErrorBoundary';

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeTab="" onTabChange={() => navigate('/')} />
      <main className="flex-1 bg-background">
        <AdminErrorBoundaryWithLanguage>
          <AdminDashboard />
        </AdminErrorBoundaryWithLanguage>
      </main>
    </div>
  );
};

export default AdminPage;
