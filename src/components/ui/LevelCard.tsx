import React from 'react';
import { StudentLevel } from '@/types/student';
import { Monitor, Terminal, Code2, Layers, Cpu } from 'lucide-react';

interface LevelCardProps {
  level: StudentLevel;
  title: string;
  subtitle: string;
  description: string;
  isSelected?: boolean;
  onSelect?: (level: StudentLevel) => void;
  className?: string;
}

export const levelConfigs: Record<
  StudentLevel,
  { icon: React.ElementType; colorBg: string; borderColor: string }
> = {
  basic: {
    icon: Monitor,
    colorBg: 'bg-[var(--turquesa-light)]/40',
    borderColor: 'border-[var(--turquesa)]',
  },
  beginner: {
    icon: Terminal,
    colorBg: 'bg-[var(--yellow-light)]/40',
    borderColor: 'border-[var(--yellow-dark)]',
  },
  intermediate: {
    icon: Code2,
    colorBg: 'bg-[var(--roxo-light)]/40',
    borderColor: 'border-[var(--roxo)]',
  },
  advanced: {
    icon: Layers,
    colorBg: 'bg-[var(--menta-light)]/40',
    borderColor: 'border-[var(--menta)]',
  },
  expert: {
    icon: Cpu,
    colorBg: 'bg-[var(--coral-light)]/40',
    borderColor: 'border-[var(--coral)]',
  },
};

export const LevelCard: React.FC<LevelCardProps> = ({
  level,
  title,
  subtitle,
  description,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  const config = levelConfigs[level];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(level)}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all min-h-[120px] flex flex-col justify-between gap-3 ${
        isSelected
          ? `${config.colorBg} ${config.borderColor} ring-4 ring-[var(--yellow)] shadow-md`
          : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--t400)]'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.colorBg} border ${config.borderColor}`}
          >
            <Icon className="w-5 h-5 text-[var(--foreground)] stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg display-md text-[var(--foreground)]">{title}</h3>
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
              {subtitle}
            </span>
          </div>
        </div>

        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected
              ? 'border-[var(--yellow-dark)] bg-[var(--yellow)]'
              : 'border-[var(--border-color)]'
          }`}
        >
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[var(--t900)]" />}
        </div>
      </div>

      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </button>
  );
};
