import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  action,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        bg-brand-card border border-brand-border rounded-brand p-6 shadow-sm
        transition-all duration-300 ease-in-out
        ${hoverable ? 'hover:-translate-y-1 hover:shadow-md hover:border-brand-primary/30' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-bold tracking-tight text-brand-text">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-brand-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-sm text-brand-text/90">
        {children}
      </div>
    </div>
  );
};

export default Card;
