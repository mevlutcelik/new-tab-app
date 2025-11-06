import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'new-tab-app-theme';

export const useTheme = () => {
  // System preference'ı kontrol et
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Başlangıç theme'ini belirle
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        return stored;
      }
      return getSystemTheme();
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Theme değiştiğinde DOM'u güncelle
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // localStorage'a kaydet
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Diğer sekmelerle senkronizasyon
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        setTheme(e.newValue);
      }
    };

    // storage event listener - diğer sekmelerden değişiklikleri dinle
    window.addEventListener('storage', handleStorageChange);

    // custom event listener - aynı sekmedeki değişiklikleri dinle
    const handleThemeChange = (e) => {
      setTheme(e.detail.theme);
    };
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Theme toggle fonksiyonu
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Aynı sekmedeki diğer componentlere bildir
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
  };

  // Belirli bir theme set et
  const setThemeMode = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setTheme(newTheme);
      window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newTheme } }));
    }
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeMode,
  };
};
