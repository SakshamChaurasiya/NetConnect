import React, { createContext, useContext, useState } from 'react';
import ToastContainer from '../components/ToastContainer';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const showConfirmToast = (message, onConfirm, onCancel) => {
    const id = Date.now();
    setToasts(prev => [
      ...prev,
      {
        id,
        message,
        type: 'default',
        actions: [
          {
            label: 'Yes',
            variant: 'confirm',
            onClick: () => {
              onConfirm();
              removeToast(id);
            },
          },
          {
            label: 'Cancel',
            onClick: () => {
              if (onCancel) onCancel();
              removeToast(id);
            },
          },
        ],
      },
    ]);
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
