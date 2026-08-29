import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'brand' | 'coral' | 'amber' | 'mint' | 'sky' | 'slate';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'brand',
  size = 'md',
  icon,
}) => {
  const colorMap = {
    brand: 'bg-brand-100 text-brand-800 border-brand-200',
    coral: 'bg-rose-100 text-rose-800 border-rose-200',
    amber: 'bg-amber-100 text-amber-900 border-amber-200',
    mint: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sky: 'bg-sky-100 text-sky-800 border-sky-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeMap = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3.5 py-1 text-sm font-medium',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorMap[color]} ${sizeMap[size]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
