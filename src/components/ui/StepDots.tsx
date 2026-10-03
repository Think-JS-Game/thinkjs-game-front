import React from 'react';

interface StepDotsProps {
  totalSteps: number;
  currentStep: number; // 0-indexed
  onSelectStep?: (stepIndex: number) => void;
  className?: string;
}

export const StepDots: React.FC<StepDotsProps> = ({
  totalSteps,
  currentStep,
  onSelectStep,
  className = '',
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {steps.map((idx) => {
        const isActive = idx === currentStep;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectStep?.(idx)}
            aria-label={`Ir para o slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all min-w-[10px] min-h-[10px] ${
              isActive
                ? 'w-7 bg-[var(--yellow)]'
                : 'w-2.5 bg-[var(--border-color)] hover:bg-[var(--t400)]'
            }`}
          />
        );
      })}
    </div>
  );
};
