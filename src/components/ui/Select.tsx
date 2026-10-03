import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-[var(--sand)] text-[var(--foreground)] border font-sans text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--yellow)] min-h-[44px] ${
              error ? 'border-[var(--coral)]' : 'border-[var(--border)]'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)] pointer-events-none" />
        </div>
        {error && <span className="text-xs font-semibold text-[var(--coral)]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
