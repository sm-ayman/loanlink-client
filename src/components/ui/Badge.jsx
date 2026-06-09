import React from 'react';

const Badge = ({
  children,
  variant = 'primary',
  dot = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full select-none';

  // Soft high-contrast variants for accessible styling in both light/dark themes
  const variants = {
    primary: 'bg-brand-primary/15 text-brand-primary border border-brand-primary/20',
    secondary: 'bg-brand-secondary/15 text-brand-secondary border border-brand-secondary/20',
    accent: 'bg-brand-accent/15 text-brand-accent border border-brand-accent/20',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20',
    error: 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20',
    neutral: 'bg-brand-neutral/80 text-brand-text border border-brand-border',
  };

  const dotColors = {
    primary: 'bg-brand-primary',
    secondary: 'bg-brand-secondary',
    accent: 'bg-brand-accent',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    neutral: 'bg-brand-text-muted',
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
