import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('/api/expenses').then(res => setExpenses(res.data));
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">All Expenses</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Paid By</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp._id} className="border-t">
              <td className="px-4 py-2">₹{exp.amount}</td>
              <td className="px-4 py-2">{exp.category?.name}</td>
              <td className="px-4 py-2">{new Date(exp.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{exp.paidBy?.name}</td>
              <td className="px-4 py-2">{exp.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
