import React from 'react';
import { Zap, Flame } from 'lucide-react';

export type ChipKind = 'xp' | 'streak';

interface ChipProps {
  kind: ChipKind;
  value: number | string;
  label?: string;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ kind, value, label, className = '' }) => {
  if (kind === 'xp') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700 ${className}`}
        aria-label={`XP: ${value}`}
      >
        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 stroke-[2.5]" />
        <span>{value} XP</span>
        {label && <span className="opacity-75">{label}</span>}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-700 ${className}`}
      aria-label={`Streak: ${value} dias`}
    >
      <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 stroke-[2.5]" />
      <span>{value} dias</span>
      {label && <span className="opacity-75">{label}</span>}
    </div>
  );
};
