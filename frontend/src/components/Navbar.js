import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Tags, BarChart3, Wallet } from 'lucide-react';
import GroupSwitcher from './GroupSwitcher';
import TopRightMenu from './TopRightMenu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/add', label: 'Add Expense', icon: Plus },
    { path: '/categories', label: 'Categories', icon: Tags },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl">Group Expense Tracker</h1>
              <p className="text-blue-200 text-xs">Smart expense management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 hover:bg-white hover:bg-opacity-20
                    ${isActive 
                      ? 'bg-white bg-opacity-20 text-white shadow-md' 
                      : 'text-blue-100 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="ml-3">
              <GroupSwitcher />
            </div>
            {user && <TopRightMenu />}
            {!user && (
              <Link className="ml-3 text-white hover:text-blue-200" to="/login">Login</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-blue-200 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-blue-800 bg-opacity-50">
        <div className="px-4 py-2 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm
                  ${isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <GroupSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
