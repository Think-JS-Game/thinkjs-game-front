import React from 'react';
import { BookOpen, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export type LessonState = 'available' | 'completed' | 'locked';

interface LessonCardProps {
  title: string;
  description: string;
  order: number;
  xpReward: number;
  state: LessonState;
  onSelect?: () => void;
  className?: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  order,
  xpReward,
  state,
  onSelect,
  className = '',
}) => {
  const isCompleted = state === 'completed';
  const isLocked = state === 'locked';

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      aria-disabled={isLocked}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all min-h-[84px] flex items-center justify-between gap-4 ${
        isCompleted
          ? 'bg-[var(--card)] border-[var(--menta)] shadow-xs'
          : isLocked
          ? 'bg-[var(--sand)] border-[var(--border)] opacity-60 cursor-not-allowed'
          : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--yellow-dark)] shadow-sm hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
            isCompleted
              ? 'bg-[var(--menta-light)] text-[var(--menta)]'
              : isLocked
              ? 'bg-[var(--t300)]/30 text-[var(--muted-foreground)]'
              : 'bg-[var(--yellow-light)] text-[var(--t900)]'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          ) : isLocked ? (
            <Lock className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">
              Lição {order}
            </span>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--yellow-light)] text-[var(--t900)] border border-[var(--yellow-mid)]">
              +{xpReward} XP
            </span>
          </div>
          <h4 className="font-extrabold text-base display-md leading-snug">{title}</h4>
          <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="flex items-center">
        {!isLocked && (
          <div className="w-8 h-8 rounded-full bg-[var(--sand)] text-[var(--foreground)] flex items-center justify-center">
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </div>
    </button>
  );
};
