import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = false,
  hoverable = false,
  selected = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl p-6 transition-all duration-300',
          glass ? 'glass-card shadow-sm' : 'bg-white border border-purple-100/80 shadow-sm',
          hoverable && 'hover:shadow-float hover:-translate-y-1 hover:border-brand-200 cursor-pointer',
          selected && 'border-2 border-brand-500 bg-brand-50/50 shadow-glow ring-2 ring-brand-400/20',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
