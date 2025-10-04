import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const theme = {
    colors: darkMode ? {
      // Enhanced Dark theme colors
      primary: 'from-indigo-600 via-purple-600 to-pink-600',
      secondary: 'from-slate-700 via-gray-700 to-zinc-700',
      success: 'from-emerald-600 via-green-600 to-teal-600',
      warning: 'from-amber-500 via-orange-500 to-red-500',
      danger: 'from-red-600 via-rose-600 to-pink-600',
      info: 'from-cyan-500 via-blue-500 to-indigo-500',
      background: 'from-slate-900 via-gray-900 to-zinc-900',
      cardBg: 'bg-slate-800/80 backdrop-blur-sm border-slate-700/50',
      cardHover: 'hover:bg-slate-700/80 hover:border-slate-600/50',
      text: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      border: 'border-slate-700/50',
      inputBg: 'bg-slate-800/50 border-slate-600/50 text-slate-100 placeholder-slate-400',
      hoverBg: 'hover:bg-slate-700/50',
      glass: 'bg-slate-800/20 backdrop-blur-xl border-slate-700/30',
      accent: 'from-violet-500 to-purple-500',
      surface: 'bg-slate-800/60'
    } : {
      // Enhanced Light theme colors
      primary: 'from-blue-500 via-indigo-500 to-purple-500',
      secondary: 'from-slate-500 via-gray-500 to-zinc-500',
      success: 'from-emerald-500 via-green-500 to-teal-500',
      warning: 'from-amber-400 via-orange-400 to-red-400',
      danger: 'from-red-500 via-rose-500 to-pink-500',
      info: 'from-cyan-400 via-blue-400 to-indigo-400',
      background: 'from-slate-50 via-blue-50 to-indigo-50',
      cardBg: 'bg-white/80 backdrop-blur-sm border-slate-200/50',
      cardHover: 'hover:bg-slate-50/80 hover:border-slate-300/50',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      border: 'border-slate-200/50',
      inputBg: 'bg-white/50 border-slate-300/50 text-slate-900 placeholder-slate-400',
      hoverBg: 'hover:bg-slate-50/50',
      glass: 'bg-white/20 backdrop-blur-xl border-white/30',
      accent: 'from-violet-400 to-purple-400',
      surface: 'bg-white/60'
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};