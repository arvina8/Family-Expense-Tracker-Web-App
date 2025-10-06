import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center rounded-xl
        bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20
        hover:bg-opacity-30 transition-all duration-200 group
        ${className}
      `}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`
            absolute inset-0 w-5 h-5 text-yellow-400 transition-all duration-300 transform
            ${darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}
          `}
        />
        <Moon 
          className={`
            absolute inset-0 w-5 h-5 text-blue-300 transition-all duration-300 transform
            ${darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
          `}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;