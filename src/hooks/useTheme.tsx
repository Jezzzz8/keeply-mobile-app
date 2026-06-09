import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system';
const ThemeContext = createContext({ theme: 'light' as Theme, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: any) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(t => { if (t) setTheme(t as Theme); });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const effectiveTheme = theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : theme;
  return <ThemeContext.Provider value={{ theme: effectiveTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);