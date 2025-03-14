
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardErrorProps {
  error: Error | unknown;
}

export const DashboardError = ({ error }: DashboardErrorProps) => {
  const { t } = useLanguage();

  if (!error) return null;

  return (
    <Alert variant="destructive">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>{t('error')}</AlertTitle>
      <AlertDescription>{error instanceof Error ? error.message : String(error)}</AlertDescription>
    </Alert>
  );
};
