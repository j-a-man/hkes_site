import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

const THEME_KEY = 'hkes-portal-theme';

export interface PortalTheme {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

// Dark mode is a portal-only preference; the public site is always light, so
// the class comes off again when the portal unmounts.
export function usePortalDarkMode(): PortalTheme {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
    return () => document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return { darkMode, setDarkMode };
}

export function usePortalTheme() {
  return useOutletContext<PortalTheme>();
}
