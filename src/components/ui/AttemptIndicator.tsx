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
      <div className="flex items-center gap-1.5">
        {attempts.map((num) => {
          const isUsedOrCurrent = num <= currentAttempt;

          return (
            <div
              key={num}
              className={`w-1.5 h-1.5 rounded-full ${
                isUsedOrCurrent
                  ? 'bg-[#EF4444] dark:bg-[var(--coral)]'
                  : 'bg-[#D1D5DB] dark:bg-[var(--t300)] opacity-50'
              }`}
            />
          );
        })}
      </div>
      <span className="text-[11px] font-bold text-[var(--t500)] tracking-widest lowercase">
        tentativa {currentAttempt} de {maxAttempts}
      </span>
    </div>
  );
};
