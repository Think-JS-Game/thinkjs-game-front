import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
          <label htmlFor={inputId} className="text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            className={`w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--sand)] text-[var(--foreground)] border font-sans text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--yellow)] min-h-[44px] ${
              error
                ? 'border-[var(--coral)] bg-[var(--coral-light)]/20 text-[var(--coral)]'
                : 'border-[var(--border)] focus:border-[var(--yellow)]'
            } ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--t300)]/20' : ''} ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5 stroke-[2]" /> : <Eye className="w-5 h-5 stroke-[2]" />}
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
