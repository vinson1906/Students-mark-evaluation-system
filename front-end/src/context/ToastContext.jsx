import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Icon from '../components/Icon';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((list) => [...list, { id, type, message }]);
      setTimeout(() => dismiss(id), type === 'error' ? 6000 : 3500);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({ success: (message) => push('success', message), error: (message) => push('error', message) }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm animate-pop-in items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 pr-2 shadow-lg"
          >
            <span className={t.type === 'error' ? 'mt-0.5 text-red-600' : 'mt-0.5 text-emerald-600'}>
              <Icon name={t.type === 'error' ? 'alert' : 'checkCircle'} size={18} />
            </span>
            <p className="flex-1 text-sm text-slate-700">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
