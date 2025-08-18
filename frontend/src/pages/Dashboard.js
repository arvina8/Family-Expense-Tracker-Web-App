import React, { useState } from 'react';
import ExpenseList from '../components/ExpenseList';
import CategoryManager from '../components/CategoryManager';
import ExpenseSplitting from '../components/ExpenseSplitting';
import FamilyManager from '../components/FamilyManager';
import AddExpense from './AddExpense';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    // Trigger a refresh of the expense list and balances
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'family', label: 'Family Members', icon: '👨‍👩‍👧‍👦' },
    { id: 'add-expense', label: 'Add Expense', icon: '➕' },
    { id: 'expenses', label: 'All Expenses', icon: '📋' },
    { id: 'categories', label: 'Categories', icon: '🏷️' },
    { id: 'splitting', label: 'Split & Balance', icon: '💰' }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-bold mb-4">Family Expense Tracker</h2>
              <p className="text-lg text-gray-600 mb-4">
                Welcome! Track and manage your family expenses easily.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Family Setup</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Add family members first to start tracking expenses
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">Smart Splitting</h3>
                  <p className="text-sm text-green-600 mt-1">
                    Automatically split expenses among family members
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800">Balance Tracking</h3>
                  <p className="text-sm text-purple-600 mt-1">
                    See who owes what and settle up easily
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800">Easy Management</h3>
                  <p className="text-sm text-orange-600 mt-1">
                    Edit and delete expenses with just a click
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">🚀 Getting Started</h3>
              <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                <li>Add family members in the "Family Members" tab</li>
                <li>Create expense categories in the "Categories" tab</li>
                <li>Start adding expenses with automatic splitting</li>
                <li>Monitor balances and settle up regularly</li>
              </ol>
            </div>
            <ExpenseSplitting key={`splitting-${refreshKey}`} />
          </div>
        );
      case 'family':
        return <FamilyManager key={`family-${refreshKey}`} />;
      case 'add-expense':
        return <AddExpense onExpenseAdded={handleExpenseAdded} />;
      case 'expenses':
        return <ExpenseList key={`expenses-${refreshKey}`} />;
      case 'categories':
        return <CategoryManager />;
      case 'splitting':
        return <ExpenseSplitting key={`splitting-detail-${refreshKey}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-3 whitespace-nowrap border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Dashboard;
