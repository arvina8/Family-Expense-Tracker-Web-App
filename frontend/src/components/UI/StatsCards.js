import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, PieChart } from 'lucide-react';

export const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-200 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white shadow-md ${iconColorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export const QuickStatsGrid = ({ expenses, users, categories }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonth = new Date();
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === thisMonth.getMonth() && 
           expDate.getFullYear() === thisMonth.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
  const lastMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === lastMonth.getMonth() && 
           expDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyTrend = lastMonthTotal > 0 ? 
    ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

  const averagePerExpense = expenses.length > 0 ? 
    (totalExpenses / expenses.length).toFixed(0) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Expenses"
        value={`₹${totalExpenses.toLocaleString()}`}
        icon={DollarSign}
        color="blue"
      />
      <StatsCard
        title="This Month"
        value={`₹${thisMonthTotal.toLocaleString()}`}
        icon={CreditCard}
        trend={monthlyTrend > 0 ? 'up' : 'down'}
        trendValue={`${Math.abs(monthlyTrend)}%`}
        color="green"
      />
      <StatsCard
  title="Group Members"
        value={users.length}
        icon={Users}
        color="purple"
      />
      <StatsCard
        title="Avg per Expense"
        value={`₹${averagePerExpense}`}
        icon={PieChart}
        color="orange"
      />
    </div>
  );
};
