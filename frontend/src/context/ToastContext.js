import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(t => t.filter(to => to.id !== id));
  }, []);

  const push = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = ++idCounter;
    setToasts(t => [...t, { id, message, type }]);
    if (duration > 0) setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  const api = {
    push,
    success: (m, o) => push(m, { type: 'success', ...(o||{}) }),
    error: (m, o) => push(m, { type: 'error', ...(o||{}) }),
    info: (m, o) => push(m, { type: 'info', ...(o||{}) }),
    remove
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map(t => (
          <div key={t.id} className={`rounded shadow px-4 py-3 text-sm text-white flex justify-between items-start animate-fade-in-down
            ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}> 
            <span className="pr-3">{t.message}</span>
            <button onClick={() => remove(t.id)} className="text-white/80 hover:text-white ml-2">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
