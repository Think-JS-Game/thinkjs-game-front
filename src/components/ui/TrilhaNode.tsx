import React from 'react';
import { CheckCircle2, Lock, Play } from 'lucide-react';

export type TrilhaNodeState = 'done' | 'current' | 'locked';

interface TrilhaNodeProps {
  title: string;
  order: number;
  state: TrilhaNodeState;
  lessonCount?: number;
  onClick?: () => void;
  className?: string;
}

export const TrilhaNode: React.FC<TrilhaNodeProps> = ({
  title,
  order,
  state,
  lessonCount,
  onClick,
  className = '',
}) => {
  const isDone = state === 'done';
  const isCurrent = state === 'current';
  const isLocked = state === 'locked';

  const nodeStyles = {
    done: 'bg-[var(--menta-light)] border-[var(--menta)] text-emerald-950 dark:text-emerald-100 hover:opacity-90',
    current:
      'bg-[var(--yellow)] border-[var(--yellow-dark)] text-[var(--t900)] shadow-[0_6px_0_var(--yellow-dark)] scale-[1.02]',
    locked:
      'bg-[var(--sand)] border-[var(--border)] text-[var(--muted-foreground)] opacity-75 cursor-not-allowed',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      aria-disabled={isLocked}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all min-h-[72px] flex items-center justify-between gap-4 ${nodeStyles[state]} ${className}`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
            isDone
              ? 'bg-[var(--menta)] text-white'
              : isCurrent
              ? 'bg-[var(--t900)] text-[var(--yellow)]'
              : 'bg-[var(--border-color)] text-[var(--muted-foreground)]'
          }`}
        >
          {isDone ? (
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          ) : isLocked ? (
            <Lock className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <span>{order}</span>
          )}
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-80">
            Módulo {order} &bull; {isDone ? 'Concluído' : isCurrent ? 'Em progresso' : 'Bloqueado'}
          </div>
          <h3 className="font-extrabold text-base display-md leading-snug">{title}</h3>
          {lessonCount !== undefined && (
            <span className="text-xs opacity-75 font-medium">{lessonCount} lições</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isCurrent && (
          <div className="w-10 h-10 rounded-full bg-[var(--t900)] text-[var(--yellow)] flex items-center justify-center">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        )}
        {isLocked && <Lock className="w-5 h-5 opacity-60" />}
      </div>
    </button>
  );
};
