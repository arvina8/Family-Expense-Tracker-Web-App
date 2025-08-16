import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExpense = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [users, setUsers] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data));
    axios.get('/api/users').then(res => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/expenses', { amount, category, date, paidBy, description });
    setAmount(''); setCategory(''); setDate(''); setPaidBy(''); setDescription('');
    if (onExpenseAdded) onExpenseAdded();
  };

  return (
    <form className="bg-white p-6 rounded shadow-md" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
      <div className="mb-2">
        <input type="number" placeholder="Amount" className="input input-bordered w-full" value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>
      <div className="mb-2">
        <select className="input input-bordered w-full" value={category} onChange={e => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <input type="date" className="input input-bordered w-full" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="mb-2">
        <select className="input input-bordered w-full" value={paidBy} onChange={e => setPaidBy(e.target.value)} required>
          <option value="">Paid By</option>
          {users.map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
        </select>
      </div>
      <div className="mb-2">
        <input type="text" placeholder="Description (optional)" className="input input-bordered w-full" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-primary w-full" type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpense;
