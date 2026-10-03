import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  kind?: 'in-progress' | 'complete';
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  kind,
  showPercentage = false,
  className = '',
}) => {
  const normalized = Math.min(100, Math.max(0, progress));
  const isComplete = kind === 'complete' || normalized >= 100;

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <div
        className="flex-1 h-3 rounded-full bg-[var(--sand)] border border-[var(--border)] overflow-hidden p-0.5"
        role="progressbar"
        aria-valuenow={normalized}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isComplete ? 'bg-[var(--menta)]' : 'bg-[var(--yellow)]'
          }`}
          style={{ width: `${normalized}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs font-bold text-[var(--muted-foreground)] min-w-[36px] text-right">
          {Math.round(normalized)}%
        </span>
      )}
    </div>
  );
};
