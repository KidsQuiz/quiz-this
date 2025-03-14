
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { UserStatsCards } from './UserStatsCards';
import { RegistrationChart } from './RegistrationChart';
import AdminErrorBoundaryWithLanguage from './AdminErrorBoundary';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('adminDashboard')}</h1>
        <Button 
          variant="outline" 
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('dashboard')}</span>
        </Button>
      </div>
      
      <AdminErrorBoundaryWithLanguage>
        <UserStatsCards />
      </AdminErrorBoundaryWithLanguage>
      
      <AdminErrorBoundaryWithLanguage>
        <RegistrationChart />
      </AdminErrorBoundaryWithLanguage>
    </div>
  );
};

export default AdminDashboard;
