import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'gradient',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500/50';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5 min-h-[38px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-base gap-2.5 min-h-[52px]',
  };

  const variantClasses = {
    gradient: 'bg-brand-gradient text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98]',
    primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-md hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-brand-100 text-brand-900 hover:bg-brand-200 hover:scale-[1.02] active:scale-[0.98]',
    outline: 'border-2 border-brand-300 text-brand-700 hover:bg-brand-50 hover:border-brand-500 hover:scale-[1.02]',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-brand-700',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          fullWidth && 'w-full',
          className
        )
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-block">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-block">{icon}</span>}
    </button>
  );
};
