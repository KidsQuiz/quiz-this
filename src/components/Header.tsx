
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Users, Package, ShieldCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Header = ({
  activeTab,
  onTabChange
}: HeaderProps) => {
  const {
    signOut,
    isAdmin
  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isQuestionsPage = location.pathname.startsWith('/questions/');
  const isAdminPage = location.pathname === '/admin';
  const {
    t
  } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('signOut'),
        description: t('signOutSuccess')
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('signOutError')
      });
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return <header className="w-full bg-card shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-medium">{t('dashboard')}</h1>
          </div>
          
          {!isQuestionsPage && !isAdminPage && 
            <div className="ml-2 bg-muted rounded-lg p-1">
              <div className="flex gap-2">
                <Button
                  onClick={() => onTabChange('kids')}
                  variant={activeTab === 'kids' ? 'default' : 'ghost'}
                  className={`rounded-md px-5 py-2 h-auto flex items-center gap-2 transition-all ${activeTab === 'kids' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{t('myKids')}</span>
                </Button>
                <Button
                  onClick={() => onTabChange('packages')}
                  variant={activeTab === 'packages' ? 'default' : 'ghost'}
                  className={`rounded-md px-5 py-2 h-auto flex items-center gap-2 transition-all ${activeTab === 'packages' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Package className="h-5 w-5" />
                  <span className="font-medium">{t('packages')}</span>
                </Button>
              </div>
            </div>
          }
        </div>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={handleAdminClick}
              variant="outline"
              size="sm"
              className={`rounded-md flex items-center gap-1.5 ${isAdminPage ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t('admin')}</span>
            </Button>
          )}

          <LanguageSwitcher />
          
          <button onClick={handleLogout} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors" aria-label={t('signOut')}>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>;
};

export default Header;
