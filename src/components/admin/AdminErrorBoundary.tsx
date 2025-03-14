
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DashboardError } from './DashboardError';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// We need this wrapper because context hooks can't be used in class components
const AdminErrorBoundaryWithLanguage = ({ children }: ErrorBoundaryProps) => {
  const languageContext = useLanguage();
  
  return (
    <AdminErrorBoundaryClass languageContext={languageContext}>
      {children}
    </AdminErrorBoundaryClass>
  );
};

class AdminErrorBoundaryClass extends Component<
  ErrorBoundaryProps & { languageContext: any },
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps & { languageContext: any }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Admin dashboard error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{this.props.languageContext.t('adminDashboard')}</h2>
          <DashboardError error={this.state.error} />
          <div className="mt-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              {this.props.languageContext.t('tryAgain')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundaryWithLanguage;
