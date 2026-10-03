import React from 'react';
import { RenderableMultipleChoiceQuestion } from '@/types/questionEngine';
import { Check } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: RenderableMultipleChoiceQuestion;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  disabled?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  disabled = false,
}) => {
  return (
    <div className="space-y-4 pt-2">
      {/* Optional Code Snippet */}
      {question.codeSnippet && (
        <div className="bg-[#1E1D17] text-[#FFFDF7] p-4 rounded-2xl font-mono text-sm border border-[#363327]">
          <pre>{question.codeSnippet}</pre>
        </div>
      )}

      {/* Multiple Choice Options Cards (Sanitized RenderableOption - NO correctOptionId in DOM) */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all min-h-[56px] text-sm font-semibold flex items-center justify-between ${
                isSelected
                  ? 'bg-[var(--yellow-light)] border-[var(--yellow-dark)] text-[var(--t900)] ring-2 ring-[var(--yellow)] shadow-xs'
                  : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--sand)]'
              } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span>{opt.text}</span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'border-[var(--yellow-dark)] bg-[var(--yellow)]'
                    : 'border-[var(--border-color)]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--t900)] stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
