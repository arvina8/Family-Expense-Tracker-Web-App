import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ExpenseSplitting from '../components/ExpenseSplitting';
import { ExpenseByCategory, ExpensePieChart, MonthlyExpenseChart } from '../components/Charts/ExpenseChart';
import { QuickStatsGrid } from '../components/UI/StatsCards';
import { GradientBackground, Card } from '../components/UI/Components';
import {
  TrendingUp,
  Users,
  Wallet,
  Activity,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Plus,
  Eye,
} from 'lucide-react';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { currentGroup } = useAuth();
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupMeta, setGroupMeta] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);

  useEffect(() => {
    if (!currentGroup) return;
    fetchData();
  }, [refreshKey, currentGroup]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes, groupRes] = await Promise.all([
        client.get('/expenses', { params: { groupId: currentGroup } }),
        client.get('/categories', { params: { groupId: currentGroup } }),
        client.get(`/groups/${currentGroup}`),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setUsers(groupRes.data.members?.map((m) => m.user) ?? []);
      setGroupMeta(groupRes.data);
      setRecentExpenses(expensesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GradientBackground className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className={`${theme.colors.text} text-lg`}>Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className={`min-h-screen bg-gradient-to-br ${theme.colors.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className={`text-4xl font-bold ${theme.colors.text} mb-2 flex items-center`}>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                Dashboard
              </h1>
              <p className={`${theme.colors.textSecondary} text-lg`}>
                Welcome back! Here's your expense overview.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              <a
                href={`/app/${currentGroup}/add`}
                className={`
                  inline-flex items-center px-6 py-3 rounded-xl font-medium text-white
                  bg-gradient-to-r ${theme.colors.primary} shadow-lg hover:shadow-xl
                  transform hover:scale-105 transition-all duration-200
                `}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </a>
              <a
                href={`/app/${currentGroup}/reports`}
                className={`
                  inline-flex items-center px-6 py-3 rounded-xl font-medium
                  ${theme.colors.cardBg} ${theme.colors.text} ${theme.colors.cardHover}
                  border-2 ${theme.colors.border} shadow-lg hover:shadow-xl
                  transform hover:scale-105 transition-all duration-200
                `}
              >
                <Eye className="w-5 h-5 mr-2" />
                View Reports
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStatsGrid expenses={expenses} users={users} categories={categories} />
        </div>

        {/* Main Content Grid - Equal Height Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-8">
          {/* Recent Expenses - 2/5 width on desktop (40%) */}
          <div className="xl:col-span-2 h-full">
            <Card
              className={`${theme.colors.cardBg} border-2 ${theme.colors.border} shadow-xl h-full flex flex-col`}
            >
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h3 className={`text-xl font-bold ${theme.colors.text} flex items-center`}>
                  <Activity className="w-6 h-6 mr-3 text-indigo-600" />
                  Recent Expenses
                </h3>
                <a
                  href={`/app/${currentGroup}/expenses`}
                  className={`text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center transition-colors`}
                >
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </div>

              {recentExpenses.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center text-center py-12 min-h-[400px]">
                  <DollarSign className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h4 className={`text-lg font-medium ${theme.colors.textMuted} mb-2`}>
                    No expenses yet
                  </h4>
                  <p className={`${theme.colors.textMuted} mb-4`}>
                    Start by adding your first expense
                  </p>
                  <a
                    href={`/app/${currentGroup}/add`}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Expense
                  </a>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-[400px]">
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {recentExpenses.map((expense) => (
                      <div 
                        key={expense._id} 
                        className={`
                          p-3 rounded-lg border
                          ${theme.colors.surface} ${theme.colors.border} ${theme.colors.hoverBg}
                          hover:shadow-md transition-all duration-200
                        `}
                        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '12px', alignItems: 'center' }}
                      >
                        {/* Icon */}
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        
                        {/* Text content */}
                        <div className="min-w-0">
                          <p className={`font-semibold ${theme.colors.text} truncate mb-0`}>
                            {expense.notes || 'No description'}
                          </p>
                          <p className={`text-sm ${theme.colors.textMuted} truncate mb-0`}>
                            {expense.category?.name || 'Uncategorized'} • {expense.paidBy?.name || 'Unknown'} •{' '}
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Amount */}
                        <div>
                          <p className={`font-bold text-base ${theme.colors.text} whitespace-nowrap text-right`}>
                            ₹{expense.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Balance Summary - 3/5 width on desktop (60%) */}
          <div className="xl:col-span-3 h-full">
            <Card
              className={`${theme.colors.cardBg} border-2 ${theme.colors.border} shadow-xl h-full flex flex-col`}
            >
              <h3 className={`text-xl font-bold ${theme.colors.text} mb-6 flex items-center flex-shrink-0`}>
                <Users className="w-6 h-6 mr-3 text-green-600" />
                Balance Summary
              </h3>
              <div className="flex-1 overflow-y-auto min-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <ExpenseSplitting key={`splitting-${refreshKey}`} />
              </div>
            </Card>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <Card className={`${theme.colors.cardBg} border-2 ${theme.colors.border} shadow-xl`}>
            <MonthlyExpenseChart expenses={expenses} />
          </Card>
          <Card className={`${theme.colors.cardBg} border-2 ${theme.colors.border} shadow-xl`}>
            <ExpensePieChart expenses={expenses} categories={categories} />
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className={`${theme.colors.cardBg} border-2 ${theme.colors.border} shadow-xl mb-8`}>
          <ExpenseByCategory expenses={expenses} categories={categories} />
        </Card>

        {/* Getting Started Guide */}
        {expenses.length === 0 && (
          <Card
            className={`${theme.colors.glass} border-2 border-indigo-200 dark:border-indigo-800 shadow-xl`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${theme.colors.text} mb-4`}>
                🚀 Welcome to Your Expense Tracker!
              </h3>
              <p className={`${theme.colors.textSecondary} mb-8 max-w-2xl mx-auto`}>
                Get started by setting up your group and adding your first expense. Track spending,
                split bills, and manage group finances with ease.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className={`p-6 rounded-xl ${theme.colors.surface} border-2 ${theme.colors.border}`}>
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                  <h4 className={`font-semibold ${theme.colors.text} mb-2`}>Set Up Your Group</h4>
                  <ul className={`text-sm ${theme.colors.textSecondary} text-left space-y-1`}>
                    <li>• Add members to your group</li>
                    <li>• Create expense categories</li>
                    <li>• Share group code with others</li>
                  </ul>
                  {groupMeta && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${theme.colors.text}`}>
                          Group Code: <strong>{groupMeta.code}</strong>
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(groupMeta.code)}
                          className="text-blue-600 hover:text-blue-800 text-sm underline"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className={`p-6 rounded-xl ${theme.colors.surface} border-2 ${theme.colors.border}`}>
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-4" />
                  <h4 className={`font-semibold ${theme.colors.text} mb-2`}>Track & Manage</h4>
                  <ul className={`text-sm ${theme.colors.textSecondary} text-left space-y-1`}>
                    <li>• Add expenses with automatic splitting</li>
                    <li>• Monitor balances and debts</li>
                    <li>• Generate detailed reports</li>
                  </ul>
                  <div className="mt-4">
                    <a
                      href={`/app/${currentGroup}/add`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Expense
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </GradientBackground>
  );
};

export default Dashboard;
