import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  type = 'text',
  className = '',
  id,
  required,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col w-full gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold tracking-wider text-brand-text/80 uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3.5 text-brand-text-muted/70 flex items-center pointer-events-none">
            <Icon className="h-5 w-5" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-sm bg-brand-neutral/30 text-brand-text border border-brand-border rounded-brand
            transition-all duration-200 outline-none
            focus:ring-2 focus:ring-brand-secondary/40 focus:border-brand-secondary focus:bg-brand-card
            disabled:opacity-50 disabled:bg-brand-neutral/10 disabled:pointer-events-none
            ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3.5 text-brand-text-muted/70 flex items-center pointer-events-none">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {error ? (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-brand-text-muted">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
