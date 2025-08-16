import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/expenses').then(res => setExpenses(res.data));
    axios.get('/api/categories').then(res => setCategories(res.data));
  }, []);

  const getTotalByCategory = (catId) =>
    expenses.filter(e => e.category._id === catId).reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Expense Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
            <p className="text-gray-700">Total: ₹{getTotalByCategory(cat._id)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
