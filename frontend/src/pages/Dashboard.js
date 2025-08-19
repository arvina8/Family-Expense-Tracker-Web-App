import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseList from '../components/ExpenseList';
import CategoryManager from '../components/CategoryManager';
import ExpenseSplitting from '../components/ExpenseSplitting';
import FamilyManager from '../components/FamilyManager';
import AddExpense from './AddExpense';
import { ExpenseByCategory, ExpensePieChart, MonthlyExpenseChart } from '../components/Charts/ExpenseChart';
import { QuickStatsGrid } from '../components/UI/StatsCards';
import { GradientBackground, Card } from '../components/UI/Components';
import { TrendingUp, Users, PlusCircle, Eye, Settings, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes, usersRes] = await Promise.all([
        axios.get('/api/expenses'),
        axios.get('/api/categories'),
        axios.get('/api/users')
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    // Trigger a refresh of the expense list and balances
    setRefreshKey(prev => prev + 1);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-purple-500 to-purple-600' },
    { id: 'family', label: 'Family Members', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'add-expense', label: 'Add Expense', icon: PlusCircle, color: 'from-orange-500 to-orange-600' },
    { id: 'expenses', label: 'All Expenses', icon: Eye, color: 'from-indigo-500 to-indigo-600' },
    { id: 'categories', label: 'Categories', icon: Settings, color: 'from-pink-500 to-pink-600' },
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <QuickStatsGrid expenses={expenses} users={users} categories={categories} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
                <div className="space-y-3">
                  {expenses.slice(0, 5).map(expense => (
                    <div key={expense._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{expense.description || 'No description'}</p>
                        <p className="text-sm text-gray-600">{expense.category?.name} • {expense.paidBy?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{expense.amount}</p>
                        <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <ExpenseSplitting key={`splitting-${refreshKey}`} />
              </Card>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                🚀 Getting Started Guide
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Setup Your Family</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Add family members in the "Family Members" tab</li>
                    <li>• Create expense categories in the "Categories" tab</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Track & Manage</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Start adding expenses with automatic splitting</li>
                    <li>• Monitor balances and settle up regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card>
                <MonthlyExpenseChart expenses={expenses} />
              </Card>
              <Card>
                <ExpensePieChart expenses={expenses} categories={categories} />
              </Card>
            </div>
            <Card>
              <ExpenseByCategory expenses={expenses} categories={categories} />
            </Card>
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
      default:
        return null;
    }
  };

  return (
    <GradientBackground className="min-h-screen">
      {/* Enhanced Tab Navigation */}
      <div className="bg-white shadow-lg border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm
                    transition-all duration-300 whitespace-nowrap min-w-fit
                    ${isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105` 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </GradientBackground>
  );
};

export default Dashboard;
