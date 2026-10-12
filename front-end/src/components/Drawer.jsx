import { useId, useRef } from 'react';
import Icon from './Icon';
import { useOverlay } from '../hooks/useOverlay';

export default function Drawer({ title, subtitle, onClose, children, footer }) {
  const panelRef = useRef(null);
  const titleId = useId();
  useOverlay(onClose, panelRef);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40" onMouseDown={onClose} aria-hidden="true" />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex h-full w-full animate-slide-in-right flex-col bg-white shadow-xl outline-none sm:max-w-md lg:max-w-lg"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="-mr-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Icon name="x" size={18} />
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3">{footer}</footer>}
      </aside>
    </div>
  );
}
