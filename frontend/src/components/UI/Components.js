import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const GradientBackground = ({ children, className = '' }) => {
  const { theme } = useTheme();
  return (
    <div className={`bg-gradient-to-br ${theme.colors.background} min-h-screen ${className}`}>
      {children}
    </div>
  );
};

export const Card = ({ children, className = '', hover = true, padding = 'p-6', glass = false, state = '' }) => {
  const { theme } = useTheme();
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-[1.02] transition-all duration-300' : '';
  const glassClass = glass ? theme.colors.glass : theme.colors.cardBg;
  
  let stateClasses = '';
  if (state === 'success') stateClasses = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-900/20';
  else if (state === 'warning') stateClasses = 'border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-900/20';
  else if (state === 'error') stateClasses = 'border-red-300 dark:border-red-700 bg-red-50/80 dark:bg-red-900/20';
  else if (state === 'empty') stateClasses = 'border-slate-300 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50';
  
  return (
    <div className={`
      ${glassClass} rounded-2xl shadow-lg border-2
      ${stateClasses || `${theme.colors.border} ${theme.colors.cardHover}`}
      ${padding} ${hoverClass} ${className}
      dark:shadow-dark-lg transition-all duration-300 backdrop-blur-sm
    `}>
      {children}
    </div>
  );
};

export const Badge = ({ children, color = 'primary', size = 'sm', variant = 'solid' }) => {
  const { theme } = useTheme();
  
  const colorClasses = {
    primary: variant === 'solid' 
      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-300'
      : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    secondary: variant === 'solid'
      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-gray-300'
      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
    success: variant === 'solid'
      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-300'
      : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    warning: variant === 'solid'
      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-300'
      : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700',
    danger: variant === 'solid'
      ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-300'
      : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
    info: variant === 'solid'
      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-300'
      : 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-700',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${colorClasses[color]} ${sizeClasses[size]}
      transition-all duration-200 shadow-sm
    `}>
      {children}
    </span>
  );
};

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  loading = false,
  disabled = false,
  glass = false,
  ...props 
}) => {
  const { theme } = useTheme();
  
  const variants = {
    primary: `bg-gradient-to-r ${theme.colors.primary} text-white shadow-lg hover:shadow-xl hover:scale-105 
              dark:shadow-dark-lg border-transparent`,
    secondary: `bg-gradient-to-r ${theme.colors.secondary} text-white shadow-lg hover:shadow-xl hover:scale-105
                dark:shadow-dark-lg border-transparent`,
    success: `bg-gradient-to-r ${theme.colors.success} text-white shadow-lg hover:shadow-xl hover:scale-105
              dark:shadow-dark-lg border-transparent`,
    warning: `bg-gradient-to-r ${theme.colors.warning} text-white shadow-lg hover:shadow-xl hover:scale-105
              dark:shadow-dark-lg border-transparent`,
    danger: `bg-gradient-to-r ${theme.colors.danger} text-white shadow-lg hover:shadow-xl hover:scale-105
             dark:shadow-dark-lg border-transparent`,
    info: `bg-gradient-to-r ${theme.colors.info} text-white shadow-lg hover:shadow-xl hover:scale-105
           dark:shadow-dark-lg border-transparent`,
    outline: `border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white ${theme.colors.cardBg}
              dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900`,
    ghost: `text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 border-transparent`,
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const glassClass = glass ? 'backdrop-blur-sm bg-opacity-80' : '';
  const loadingClass = loading ? 'opacity-70 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`
        inline-flex items-center justify-center space-x-2 rounded-xl font-medium 
        transition-all duration-200 transform focus:outline-none 
        focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
        disabled:transform-none disabled:hover:scale-100
        ${variants[variant]} ${sizes[size]} ${glassClass} 
        ${loadingClass} ${disabledClass} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </button>
  );
};

export const Input = ({ 
  className = '', 
  label = '', 
  error = '', 
  icon: Icon,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium ${theme.colors.text}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.colors.textMuted}`} />
        )}
        <input
          className={`
            w-full ${Icon ? 'pl-10 pr-4' : 'px-4'} py-3 rounded-xl 
            ${theme.colors.inputBg} ${theme.colors.border} border
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-all duration-200 ${className}
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export const Select = ({ 
  className = '', 
  label = '', 
  error = '', 
  children,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-1">
      {label && (
        <label className={`block text-sm font-medium ${theme.colors.text}`}>
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-xl 
          ${theme.colors.inputBg} ${theme.colors.border} border
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200 ${className}
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
        `}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className={`
        relative ${theme.colors.cardBg} rounded-2xl shadow-2xl 
        ${sizes[size]} w-full max-h-[90vh] overflow-y-auto
        dark:shadow-dark-lg transform transition-all duration-200
        animate-slide-up
      `}>
        {title && (
          <div className={`px-6 py-4 border-b ${theme.colors.border}`}>
            <h3 className={`text-lg font-semibold ${theme.colors.text}`}>{title}</h3>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
