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
            absolute z-50 mt-3 w-60 bg-base-100/95 backdrop-blur-xl border border-base-200/50 rounded-2xl shadow-2xl
            py-2 px-2 focus:outline-none
            animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200
            ${alignClasses[align]}
          `}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <hr key={index} className="border-brand-border my-1" />;
            }

            if (item.isHeader) {
              return (
                <div key={index} className="px-4 py-3 mb-1">
                  <p className="text-sm font-bold text-base-content truncate">{item.label}</p>
                  {item.subLabel && <p className="text-xs opacity-60 truncate mt-0.5">{item.subLabel}</p>}
                </div>
              );
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
                  flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left rounded-xl
                  ${item.danger 
                    ? 'text-error hover:bg-error/10 hover:translate-x-1' 
                    : 'text-base-content hover:bg-base-200 hover:text-primary hover:translate-x-1'
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
