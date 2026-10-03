import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type AlertKind = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  kind: AlertKind;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ kind, title, children, className = '' }) => {
  const configs = {
    success: {
      bg: 'bg-[var(--menta-light)]/40 border-[var(--menta)] text-emerald-950 dark:text-emerald-100',
      icon: CheckCircle2,
      iconColor: 'text-[var(--menta)]',
    },
    error: {
      bg: 'bg-[var(--coral-light)]/40 border-[var(--coral)] text-rose-950 dark:text-rose-100',
      icon: AlertCircle,
      iconColor: 'text-[var(--coral)]',
    },
    warning: {
      bg: 'bg-[var(--yellow-light)]/60 border-[var(--yellow-dark)] text-amber-950 dark:text-amber-100',
      icon: AlertTriangle,
      iconColor: 'text-[var(--yellow-dark)]',
    },
    info: {
      bg: 'bg-[var(--turquesa-light)]/40 border-[var(--turquesa)] text-teal-950 dark:text-teal-100',
      icon: Info,
      iconColor: 'text-[var(--turquesa)]',
    },
  };

  const config = configs[kind];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="space-y-1 text-sm font-sans">
        {title && <div className="font-bold">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};
