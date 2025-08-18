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
  const [splitType, setSplitType] = useState('even'); // 'even' or 'custom'
  const [customSplit, setCustomSplit] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
      // Initialize custom split with all users at 0 ratio
      setCustomSplit(res.data.map(user => ({ user: user._id, ratio: 0 })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCustomSplitChange = (userId, ratio) => {
    setCustomSplit(prev => 
      prev.map(split => 
        split.user === userId ? { ...split, ratio: parseFloat(ratio) || 0 } : split
      )
    );
  };

  const getTotalRatio = () => {
    return customSplit.reduce((sum, split) => sum + split.ratio, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let expenseData = { 
      amount: parseFloat(amount), 
      category, 
      date, 
      paidBy, 
      description 
    };

    // Add split information based on split type
    if (splitType === 'custom') {
      const totalRatio = getTotalRatio();
      if (Math.abs(totalRatio - 1) > 0.001) {
        alert('Custom split ratios must sum to 1.0 (100%)');
        return;
      }
      expenseData.split = customSplit.filter(split => split.ratio > 0);
    } else {
      // For even split, we'll let the backend handle it or split evenly among all users
      expenseData.split = users.map(user => ({ 
        user: user._id, 
        ratio: 1 / users.length 
      }));
    }

    try {
      await axios.post('/api/expenses', expenseData);
      // Reset form
      setAmount(''); 
      setCategory(''); 
      setDate(''); 
      setPaidBy(''); 
      setDescription('');
      setSplitType('even');
      setCustomSplit(users.map(user => ({ user: user._id, ratio: 0 })));
      
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
      
      {users.length === 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-medium mb-2">⚠️ No Family Members Found</div>
          <div className="text-red-700 text-sm mb-3">
            You need to add family members before creating expenses. 
          </div>
          <a 
            href="/family" 
            className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Add Family Members First
          </a>
        </div>
      )}

      {categories.length === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-yellow-800 font-medium mb-2">⚠️ No Categories Found</div>
          <div className="text-yellow-700 text-sm mb-3">
            You should add some expense categories for better organization.
          </div>
          <a 
            href="/categories" 
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
          >
            Add Categories
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="Enter amount" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            required
            disabled={categories.length === 0}
          >
            <option value="">{categories.length === 0 ? 'No categories available' : 'Select Category'}</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            value={date} 
            onChange={e => setDate(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            value={paidBy} 
            onChange={e => setPaidBy(e.target.value)} 
            required
            disabled={users.length === 0}
          >
            <option value="">{users.length === 0 ? 'No family members available' : 'Select who paid'}</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <input 
            type="text" 
            placeholder="What was this expense for?" 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>

        {users.length > 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    value="even" 
                    checked={splitType === 'even'} 
                    onChange={e => setSplitType(e.target.value)}
                    className="mr-2"
                  />
                  Split evenly among all family members
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    value="custom" 
                    checked={splitType === 'custom'} 
                    onChange={e => setSplitType(e.target.value)}
                    className="mr-2"
                  />
                  Custom split ratios
                </label>
              </div>
            </div>

            {splitType === 'custom' && (
              <div className="border p-4 rounded-md bg-gray-50">
                <h3 className="font-medium mb-3">Custom Split Ratios</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Enter decimal values that sum to 1.0 (e.g., 0.6 for 60%, 0.4 for 40%)
                </p>
                <div className="space-y-2">
                  {users.map(user => (
                    <div key={user._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{user.name}</span>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          max="1"
                          placeholder="0.00"
                          className="w-20 p-1 border border-gray-300 rounded text-sm"
                          value={customSplit.find(split => split.user === user._id)?.ratio || 0}
                          onChange={e => handleCustomSplitChange(user._id, e.target.value)}
                        />
                        <span className="text-sm text-gray-500">
                          ({((customSplit.find(split => split.user === user._id)?.ratio || 0) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Total:</span>
                      <span className={getTotalRatio() === 1 ? 'text-green-600' : 'text-red-600'}>
                        {getTotalRatio().toFixed(3)} ({(getTotalRatio() * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <button 
          className={`w-full py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            users.length === 0 || categories.length === 0
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          type="submit"
          disabled={users.length === 0 || categories.length === 0}
        >
          {users.length === 0 || categories.length === 0 
            ? 'Please add family members and categories first' 
            : 'Add Expense'
          }
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
