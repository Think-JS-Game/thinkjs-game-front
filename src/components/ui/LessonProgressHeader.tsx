import React from 'react';
import { X } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LessonProgressHeaderProps {
  questionNumber: number;
  totalQuestions: number;
  onClose?: () => void;
  className?: string;
}

export const LessonProgressHeader: React.FC<LessonProgressHeaderProps> = ({
  questionNumber,
  totalQuestions,
  onClose,
  className = '',
}) => {
  const progress = (questionNumber / Math.max(1, totalQuestions)) * 100;

  return (
    <header className={`w-full flex items-center justify-between gap-4 py-3 px-4 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Sair da lição"
        className="p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--sand)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </button>

      <div className="flex-1 max-w-lg">
        <ProgressBar progress={progress} />
      </div>

      <div className="px-3 py-1 rounded-full bg-[var(--sand)] border border-[var(--border)] text-xs font-extrabold text-[var(--foreground)]">
        {questionNumber}/{totalQuestions}
      </div>
    </header>
  );
};
