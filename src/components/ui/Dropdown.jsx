import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-56 bg-brand-card border border-brand-border rounded-brand shadow-lg
            py-1.5 focus:outline-none
            animate-in fade-in slide-in-from-top-2 duration-150
            ${alignClasses[align]}
          `}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <hr key={index} className="border-brand-border my-1" />;
            }

            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                className={`
                  flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors duration-150 text-left
                  ${item.danger 
                    ? 'text-red-600 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20' 
                    : 'text-brand-text hover:bg-brand-neutral/50'
                  }
                `}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
