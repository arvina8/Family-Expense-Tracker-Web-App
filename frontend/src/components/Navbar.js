import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Tags, BarChart3, Wallet } from 'lucide-react';
import GroupSwitcher from './GroupSwitcher';
import TopRightMenu from './TopRightMenu';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { user, currentGroup } = useAuth();
  const { theme } = useTheme();

  const base = currentGroup ? `/app/${currentGroup}` : '';
  const navItems = [
    { path: currentGroup ? `${base}/dashboard` : '/', label: 'Dashboard', icon: Home },
    { path: currentGroup ? `${base}/add` : '/add', label: 'Add Expense', icon: Plus },
    { path: currentGroup ? `${base}/categories` : '/categories', label: 'Categories', icon: Tags },
    { path: currentGroup ? `${base}/reports` : '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className={`
      bg-gradient-to-r ${theme.colors.primary} shadow-2xl sticky top-0 z-50
      backdrop-blur-sm border-b border-white border-opacity-30
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-2xl shadow-lg backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl tracking-tight">ExpenseTracker</h1>
              <p className="text-white text-opacity-80 text-xs hidden sm:block">Smart group expenses</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-300 hover:bg-white hover:bg-opacity-20
                    hover:shadow-lg hover:scale-105 transform
                    ${isActive 
                      ? 'bg-white bg-opacity-25 text-white shadow-lg backdrop-blur-sm border border-white border-opacity-30' 
                      : 'text-white text-opacity-90 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              );
            })}
            
            <div className="ml-4 flex items-center space-x-3">
              <GroupSwitcher />
              <ThemeToggle />
              {user && <TopRightMenu />}
              {!user && (
                <Link 
                  className="text-white text-opacity-90 hover:text-white px-4 py-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-300 font-medium" 
                  to="/login"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button className="text-white hover:text-white p-2 rounded-xl hover:bg-white hover:bg-opacity-20 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-black bg-opacity-20 backdrop-blur-sm border-t border-white border-opacity-20">
        <div className="px-4 py-2 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${isActive 
                    ? 'bg-white bg-opacity-20 text-white shadow-lg' 
                    : 'text-white text-opacity-90 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white border-opacity-20">
            <GroupSwitcher />
            {user && <TopRightMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
