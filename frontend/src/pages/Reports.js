import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExpenseByCategory, ExpensePieChart, MonthlyExpenseChart } from '../components/Charts/ExpenseChart';
import { QuickStatsGrid } from '../components/UI/StatsCards';
import { GradientBackground, Card } from '../components/UI/Components';
import { Calendar, Filter, Download, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

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

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    let dateFilter = true;
    if (dateRange === 'thisMonth') {
      dateFilter = expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
    } else if (dateRange === 'lastMonth') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
      dateFilter = expenseDate.getMonth() === lastMonth.getMonth() && 
                   expenseDate.getFullYear() === lastMonth.getFullYear();
    } else if (dateRange === 'last3Months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
      dateFilter = expenseDate >= threeMonthsAgo;
    }

    const categoryFilter = selectedCategory === 'all' || 
                          expense.category?._id === selectedCategory;
    
    return dateFilter && categoryFilter;
  });

  const getTotalByCategory = (catId) =>
    filteredExpenses.filter(e => e.category?._id === catId).reduce((sum, e) => sum + e.amount, 0);

  const getTopSpenders = () => {
    const spenderMap = users.map(user => {
      const userExpenses = filteredExpenses.filter(exp => exp.paidBy?._id === user._id);
      const total = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      return { ...user, total, expenseCount: userExpenses.length };
    }).sort((a, b) => b.total - a.total);
    
    return spenderMap;
  };

  if (loading) {
    return (
      <GradientBackground className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your family spending patterns</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </Card>

        {/* Quick Stats */}
        <QuickStatsGrid expenses={filteredExpenses} users={users} categories={categories} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <Card>
            <MonthlyExpenseChart expenses={filteredExpenses} />
          </Card>
          <Card>
            <ExpensePieChart expenses={filteredExpenses} categories={categories} />
          </Card>
        </div>

        <Card className="mb-8">
          <ExpenseByCategory expenses={filteredExpenses} categories={categories} />
        </Card>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {categories
                .map(cat => ({ ...cat, total: getTotalByCategory(cat._id) }))
                .filter(cat => cat.total > 0)
                .sort((a, b) => b.total - a.total)
                .map(cat => (
                  <div key={cat._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{cat.name}</h4>
                      <p className="text-sm text-gray-600">
                        {filteredExpenses.filter(e => e.category?._id === cat._id).length} expenses
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{cat.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {((cat.total / filteredExpenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Top Spenders */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Top Spenders
            </h3>
            <div className="space-y-3">
              {getTopSpenders()
                .filter(user => user.total > 0)
                .map((user, index) => (
                  <div key={user._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'}
                      `}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.expenseCount} expenses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{user.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {user.expenseCount > 0 ? `₹${(user.total / user.expenseCount).toFixed(0)} avg` : ''}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Reports;
