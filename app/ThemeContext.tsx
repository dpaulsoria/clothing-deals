'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDarkMode: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (mode === 'system') {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  useEffect(() => {
    switch (mode) {
      case 'light':
        setIsDarkMode(false);
        break;
      case 'dark':
        setIsDarkMode(true);
        break;
      case 'system':
        setIsDarkMode(
          window.matchMedia('(prefers-color-scheme: dark)').matches
        );
        break;
    }

    localStorage.setItem('themeMode', mode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [mode, isDarkMode]);

  const contextValue: ThemeContextType = {
    mode,
    isDarkMode,
    setMode: (newMode) => {
      setMode(newMode);
    },
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
