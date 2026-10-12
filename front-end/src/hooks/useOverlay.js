import { useEffect, useRef } from 'react';

/** Shared behaviour for modals and drawers: Escape to close, scroll lock, focus handling. */
export function useOverlay(onClose, panelRef) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (panelRef.current && !panelRef.current.contains(document.activeElement)) panelRef.current.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus();
    };
  }, [panelRef]);
}
