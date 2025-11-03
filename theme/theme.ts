// theme/theme.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  isDark: false,
  toggle: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => {
      if (v) setIsDark(v === 'dark');
    });
  }, []);

  const toggle = () => {
    setIsDark((s) => {
      const next = !s;
      AsyncStorage.setItem('theme', next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  };

  return React.createElement(ThemeContext.Provider, { value: { isDark, toggle } }, children);
};

export const useTheme = () => useContext(ThemeContext);
