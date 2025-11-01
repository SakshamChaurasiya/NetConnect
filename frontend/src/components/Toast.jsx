import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type, onClose, actions }) => {
  useEffect(() => {
    if (!actions) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, actions]);

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-gray-800';

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in`}
    >
      <span>{message}</span>

      {actions && (
        <div className="flex gap-2 ml-3">
          {actions.map(({ label, onClick, variant }) => (
            <button
              key={label}
              onClick={onClick}
              className={`px-2 py-1 rounded text-sm font-medium ${
                variant === 'confirm'
                  ? 'bg-white text-gray-800 hover:bg-gray-200'
                  : 'border border-white text-white hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
