import React, { useState } from 'react';


interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label = 'Senha', error, helperText, className = '', id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || 'password-input';

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-extrabold text-[var(--t800)]">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={`w-full pl-4 pr-20 py-3 rounded-xl bg-white dark:bg-[var(--cream)] text-[var(--foreground)] border font-sans text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--yellow)] min-h-[44px] ${
              error
                ? 'border-[var(--coral)] bg-[var(--coral-light)]/20 text-[var(--coral)]'
                : 'border-[var(--border-color)] focus:border-[var(--yellow)]'
            } ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--t300)]/20' : ''} ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] font-bold text-[var(--tq)] hover:text-[var(--tq-dark)] transition-colors"
          >
            {showPassword ? 'ocultar' : 'mostrar'}
          </button>
        </div>
        {error ? (
          <span className="text-xs font-semibold text-[var(--coral)]">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-[var(--muted-foreground)]">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

PasswordField.displayName = 'PasswordField';
