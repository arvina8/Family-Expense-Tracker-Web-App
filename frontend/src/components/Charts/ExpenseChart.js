import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ExpenseByCategory = ({ expenses, categories }) => {
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category?._id === category._id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { name: category.name, amount: total };
  });

  const chartData = {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        label: 'Amount Spent',
        data: categoryData.map(item => item.amount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)',
          'rgba(83, 102, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export const ExpensePieChart = ({ expenses, categories }) => {
  const categoryData = categories.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category?._id === category._id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { name: category.name, amount: total };
  }).filter(item => item.amount > 0);

  const chartData = {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        data: categoryData.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCD56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C7C7C7',
          '#5362FF',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Category Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export const MonthlyExpenseChart = ({ expenses }) => {
  // Get last 6 months of data
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      month: date.getMonth(),
      year: date.getFullYear()
    });
  }

  const monthlyData = months.map(month => {
    const monthExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === month.month && expDate.getFullYear() === month.year;
    });
    return {
      name: month.name,
      amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  });

  const chartData = {
    labels: monthlyData.map(item => item.name),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: monthlyData.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expense Trend',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};
