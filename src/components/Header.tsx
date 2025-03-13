
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Users, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const isQuestionsPage = location.pathname.startsWith('/questions/');
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('signOut'),
        description: t('signOutSuccess'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('signOutError'),
      });
    }
  };

  return (
    <header className="w-full bg-card shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-medium">{t('dashboard')}</h1>
          
          {!isQuestionsPage && (
            <Tabs value={activeTab} onValueChange={onTabChange} className="ml-6">
              <TabsList className="grid grid-cols-2 w-48">
                <TabsTrigger value="kids" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{t('myKids')}</span>
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{t('packages')}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <button 
            onClick={handleLogout}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            aria-label={t('signOut')}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
