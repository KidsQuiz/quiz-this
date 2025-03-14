
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardErrorProps {
  error: Error | unknown;
  title?: string;
}

export const DashboardError = ({ error, title }: DashboardErrorProps) => {
  const { t } = useLanguage();

  if (!error) return null;

  // Determine error message based on type
  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = JSON.stringify(error);
  } else {
    errorMessage = String(error);
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || t('error')}</AlertTitle>
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  );
};
