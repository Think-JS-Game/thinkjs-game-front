import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold font-sans text-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px] min-w-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-[var(--yellow)] text-[var(--t900)] hover:bg-[#E0B400] shadow-[0_4px_0_var(--yellow-dark)] active:translate-y-1 active:shadow-none border border-transparent',
    secondary:
      'bg-[var(--sand)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--border-color)] shadow-sm',
    ghost:
      'bg-transparent text-[var(--foreground)] hover:bg-[var(--sand)] hover:text-[var(--foreground)] border border-transparent',
    danger:
      'bg-[var(--coral)] text-white hover:bg-rose-600 shadow-[0_4px_0_var(--coral-dark)] active:translate-y-1 active:shadow-none border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};
