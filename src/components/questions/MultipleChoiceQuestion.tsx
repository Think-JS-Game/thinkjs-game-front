import React from 'react';
import { RenderableMultipleChoiceQuestion } from '@/types/questionEngine';

interface MultipleChoiceQuestionProps {
  question: RenderableMultipleChoiceQuestion;
  selectedOptionId: string | null;
  incorrectOptionIds?: string[];
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedOptionId,
  incorrectOptionIds = [],
  onSelectOption,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Optional Code Snippet */}
      {question.codeSnippet && (
        <div className="bg-[#27261F] dark:bg-[var(--background)] text-white p-5 rounded-2xl font-mono text-[13px] leading-relaxed shadow-sm">
          <pre className="whitespace-pre-wrap font-mono">{question.codeSnippet}</pre>
        </div>
      )}

      {/* Multiple Choice Options Cards */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isIncorrect = incorrectOptionIds.includes(opt.id);

          let stateClasses = 'bg-white dark:bg-[var(--background)] border-[var(--border-color)] text-[var(--t800)] hover:border-[var(--t400)]';
          
          if (isSelected) {
            stateClasses = 'bg-[#FEF08A]/40 dark:bg-[var(--yellow)]/20 border-[#EAB308] text-[var(--t900)] ring-1 ring-[#EAB308] shadow-sm';
          } else if (isIncorrect) {
            stateClasses = 'bg-[#FEE2E2] dark:bg-[var(--coral)]/20 border-[#FCA5A5] text-[#9CA3AF] pointer-events-none opacity-80';
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled || isIncorrect}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-[14px] font-bold ${stateClasses} ${disabled && !isIncorrect ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

