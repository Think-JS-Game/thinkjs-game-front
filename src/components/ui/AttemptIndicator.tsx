import React from 'react';

interface AttemptIndicatorProps {
  currentAttempt: number; // 1, 2, or 3
  maxAttempts?: number;
  className?: string;
}

export const AttemptIndicator: React.FC<AttemptIndicatorProps> = ({
  currentAttempt,
  maxAttempts = 3,
  className = '',
}) => {
  const attempts = Array.from({ length: maxAttempts }, (_, i) => i + 1);

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Tentativa ${currentAttempt} de ${maxAttempts}`}
    >
      <span className="text-xs font-bold text-[var(--muted-foreground)]">Tentativas:</span>
      <div className="flex items-center gap-1.5">
        {attempts.map((num) => {
          const isCurrent = num === currentAttempt;
          const isUsed = num < currentAttempt;

          return (
            <div
              key={num}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-[var(--yellow)] text-[var(--t900)] ring-2 ring-[var(--yellow-dark)] scale-110'
                  : isUsed
                  ? 'bg-[var(--coral-light)] text-[var(--coral)] border border-[var(--coral)]'
                  : 'bg-[var(--sand)] text-[var(--muted-foreground)] border border-[var(--border)]'
              }`}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
};
