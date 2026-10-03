import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--sand)] text-[var(--foreground)] border font-sans text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--yellow)] min-h-[44px] ${
            error
              ? 'border-[var(--coral)] bg-[var(--coral-light)]/20 text-[var(--coral)]'
              : 'border-[var(--border)] focus:border-[var(--yellow)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--t300)]/20' : ''} ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs font-semibold text-[var(--coral)] flex items-center gap-1">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-[var(--muted-foreground)]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
