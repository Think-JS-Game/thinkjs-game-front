import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, checked, onChange, disabled, ...props }, ref) => {
    const checkboxId = id || 'checkbox-input';

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`inline-flex items-center gap-3 cursor-pointer min-h-[44px] select-none text-sm text-[var(--foreground)] ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative flex items-center justify-center min-w-[24px] min-h-[24px]">
            <input
              id={checkboxId}
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className="sr-only peer"
              {...props}
            />
            <div className="w-5 h-5 rounded-md border border-[var(--border-color)] bg-[var(--sand)] peer-checked:bg-[var(--yellow)] peer-checked:border-[var(--yellow-dark)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--yellow)] transition-all flex items-center justify-center">
              {checked && <Check className="w-3.5 h-3.5 text-[var(--t900)] stroke-[3]" />}
            </div>
          </div>
          <span>{label}</span>
        </label>
        {error && <span className="text-xs font-semibold text-[var(--coral)] ml-8">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
