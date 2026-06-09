import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) => {
  // Base classes for consistent spacing system & typography
  const baseClasses = 'inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none rounded-brand cursor-pointer';

  // Variant mappings using the design system's 3 colors + neutral
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/95 focus:ring-brand-primary/50 shadow-md shadow-brand-primary/20',
    secondary: 'bg-brand-secondary text-white hover:bg-brand-secondary/95 focus:ring-brand-secondary/50 shadow-md shadow-brand-secondary/20',
    accent: 'bg-brand-accent text-white hover:bg-brand-accent/95 focus:ring-brand-accent/50 shadow-md shadow-brand-accent/20',
    outline: 'border-2 border-brand-border text-brand-text bg-transparent hover:bg-brand-neutral/30 hover:border-brand-text/30 focus:ring-brand-secondary/40',
    ghost: 'text-brand-text hover:bg-brand-neutral/40 bg-transparent focus:ring-brand-neutral/50',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/50 shadow-md shadow-red-600/20',
  };

  // Size mappings ensuring 8px grid consistency
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
