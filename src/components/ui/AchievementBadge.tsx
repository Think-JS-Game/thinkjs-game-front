import React from 'react';
import { Award, Lock } from 'lucide-react';

export type AchievementState = 'unlocked' | 'locked';

interface AchievementBadgeProps {
  title: string;
  description: string;
  state: AchievementState;
  unlockedAt?: string;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  state,
  unlockedAt,
  className = '',
}) => {
  const isUnlocked = state === 'unlocked';

  return (
    <div
      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
        isUnlocked
          ? 'bg-[var(--yellow-light)]/30 border-[var(--yellow-dark)] shadow-sm'
          : 'bg-[var(--sand)] border-[var(--border)] opacity-60'
      } ${className}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
          isUnlocked
            ? 'bg-[var(--yellow)] text-[var(--t900)] shadow-xs'
            : 'bg-[var(--t300)] text-[var(--muted-foreground)]'
        }`}
      >
        {isUnlocked ? (
          <Award className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <Lock className="w-5 h-5 stroke-[2.5]" />
        )}
      </div>

      <div className="space-y-0.5">
        <h4 className="font-extrabold text-sm display-md text-[var(--foreground)]">{title}</h4>
        <p className="text-xs text-[var(--muted-foreground)] leading-tight">{description}</p>
        {isUnlocked && unlockedAt && (
          <span className="text-[10px] text-[var(--menta)] font-bold block pt-1">
            Conquistado em {unlockedAt}
          </span>
        )}
      </div>
    </div>
  );
};
