import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Button } from '../components/UI/Components';
import { Plus, Users, AlertCircle, Calculator, Calendar } from 'lucide-react';

const AddExpense = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState('');
  const [splitType, setSplitType] = useState('even'); // 'even' or 'custom'
  const [customSplit, setCustomSplit] = useState([]);

  const { currentGroup } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!currentGroup) return;
    fetchCategories();
    fetchUsers();
  }, [currentGroup]);

  const fetchCategories = async () => {
    try {
  const res = await client.get('/categories', { params: { groupId: currentGroup } });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUsers = async () => {
    try {
  const res = await client.get('/groups/mine');
  const g = res.data.find(m => m.group._id === currentGroup);
  const members = g ? g.group.members.map(m => m.user) : [];
  setUsers(members);
      // Initialize custom split with all users at 0 ratio
  setCustomSplit(members.map(user => ({ user: user._id, ratio: 0 })));
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
  group: currentGroup,
  paidBy, 
  notes 
    };

    // Add split information based on split type
    if (splitType === 'custom') {
      const totalRatio = getTotalRatio();
      if (Math.abs(totalRatio - 1) > 0.001) {
        toast.error('Custom split ratios must sum to 1.0 (100%)');
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
  await client.post('/expenses', expenseData);
  toast.success('Expense added');
      // Reset form
      setAmount(''); 
      setCategory(''); 
      setDate(''); 
      setPaidBy(''); 
  setNotes('');
      setSplitType('even');
      setCustomSplit(users.map(user => ({ user: user._id, ratio: 0 })));
      
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
  toast.error('Error adding expense. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Plus className="w-8 h-8 mr-3 text-blue-600" />
          Add New Expense
        </h1>
  <p className="text-gray-600">Track and split expenses with your group members</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        {users.length === 0 && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div className="text-red-800 font-medium">No Group Members Found</div>
            </div>
            <div className="text-red-700 text-sm mb-3">
              You need to add group members before creating expenses. 
            </div>
            <Button variant="danger" size="sm">
              <a href="/select-group" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Add Group Members First
              </a>
            </Button>
          </div>
        )}

        {categories.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <div className="text-yellow-800 font-medium">No Categories Found</div>
            </div>
            <div className="text-yellow-700 text-sm mb-3">
              You should add some expense categories for better organization.
            </div>
            <Button variant="outline" size="sm">
              <a href="/categories" className="flex items-center text-yellow-600">
                Add Categories
              </a>
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid By
              </label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                value={paidBy} 
                onChange={e => setPaidBy(e.target.value)} 
                required
                disabled={users.length === 0}
              >
                <option value="">{users.length === 0 ? 'No group members available' : 'Select who paid'}</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <input 
              type="text" 
              placeholder="What was this expense for?" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
            />
          </div>

          {users.length > 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="flex items-center mb-4">
                <Calculator className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-800">Split Configuration</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="radio" 
                      value="even" 
                      checked={splitType === 'even'} 
                      onChange={e => setSplitType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Even Split</div>
                      <div className="text-sm text-gray-600">Split equally among all members</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="radio" 
                      value="custom" 
                      checked={splitType === 'custom'} 
                      onChange={e => setSplitType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Custom Split</div>
                      <div className="text-sm text-gray-600">Set custom ratios for each member</div>
                    </div>
                  </label>
                </div>

                {splitType === 'custom' && (
                  <div className="border-2 border-blue-200 p-4 rounded-lg bg-blue-50">
                    <h4 className="font-medium mb-3 text-blue-800">Custom Split Ratios</h4>
                    <p className="text-sm text-blue-600 mb-4">
                      Enter decimal values that sum to 1.0 (e.g., 0.6 for 60%, 0.4 for 40%)
                    </p>
                    <div className="space-y-3">
                      {users.map(user => (
                        <div key={user._id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <span className="font-medium text-gray-800">{user.name}</span>
                          <div className="flex items-center space-x-3">
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              max="1"
                              placeholder="0.00"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={customSplit.find(split => split.user === user._id)?.ratio || 0}
                              onChange={e => handleCustomSplitChange(user._id, e.target.value)}
                            />
                            <span className="text-sm text-gray-600 min-w-[60px]">
                              ({((customSplit.find(split => split.user === user._id)?.ratio || 0) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-blue-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-blue-800">Total:</span>
                          <span className={`font-bold ${getTotalRatio() === 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {getTotalRatio().toFixed(3)} ({(getTotalRatio() * 100).toFixed(1)}%)
                          </span>
                        </div>
                        {Math.abs(getTotalRatio() - 1) > 0.001 && (
                          <p className="text-sm text-red-600 mt-1">
                            ⚠️ Ratios must sum to 1.0 (100%)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Button 
            type="submit"
            variant={users.length === 0 || categories.length === 0 ? "secondary" : "primary"}
            className="w-full py-4 text-lg"
            disabled={users.length === 0 || categories.length === 0}
          >
            {users.length === 0 || categories.length === 0 
              ? 'Please add group members and categories first' 
              : 'Add Expense'
            }
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
