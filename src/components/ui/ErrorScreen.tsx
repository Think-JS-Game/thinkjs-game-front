import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  message = 'Ocorreu uma falha inesperada no aplicativo.',
  onRetry = () => window.location.reload(),
  className = '',
}) => {
  return (
    <div className={`min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6 ${className}`}>
      <div className="w-20 h-20 rounded-3xl bg-[var(--coral-light)] text-[var(--coral)] border-2 border-[var(--coral)] flex items-center justify-center shadow-sm">
        <AlertCircle className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-3xl font-extrabold display-lg text-[var(--foreground)]">Algo deu errado</h2>
        <p className="text-sm text-[var(--muted-foreground)] body-md">{message}</p>
      </div>

      <Button variant="primary" onClick={onRetry} className="px-8 py-3.5 text-base">
        <RefreshCw className="w-5 h-5" />
        <span>Tentar de novo</span>
      </Button>
    </div>
  );
};
