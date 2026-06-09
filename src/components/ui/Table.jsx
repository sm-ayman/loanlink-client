import React from 'react';

const Table = ({
  headers = [],
  data = [],
  renderRow,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden border border-brand-border rounded-brand bg-brand-card shadow-sm ${className}`}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-neutral/50 border-b border-brand-border">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-text/80 select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/60 text-sm text-brand-text">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {Array.from({ length: headers.length || 3 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4.5">
                      <div className="h-4 bg-brand-neutral rounded-full w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-6 py-10 text-center text-brand-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                if (renderRow) {
                  return renderRow(item, index);
                }
                // Fallback row render if no custom renderRow is provided
                return (
                  <tr
                    key={index}
                    className="hover:bg-brand-neutral/20 transition-colors duration-150"
                  >
                    {Object.values(item).map((val, cellIndex) => (
                      <td key={cellIndex} className="px-6 py-4">
                        {val}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
