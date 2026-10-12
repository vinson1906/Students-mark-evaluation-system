import { useEffect } from 'react';

export function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') handler();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, handler, active]);
}
