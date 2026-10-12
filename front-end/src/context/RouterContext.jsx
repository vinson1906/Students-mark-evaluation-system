import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NAV_ITEMS } from '../navigation';

// Minimal hash router (#/students). No dependency needed; swap for React Router later if you like.
const KEYS = NAV_ITEMS.map((n) => n.key);
const RouterContext = createContext(null);

const parse = () => {
  const key = window.location.hash.replace(/^#\/?/, '').split(/[?/]/)[0];
  return KEYS.includes(key) ? key : 'overview';
};

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(parse);

  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((key) => {
    window.location.hash = `/${key}`;
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export const useRoute = () => useContext(RouterContext);
