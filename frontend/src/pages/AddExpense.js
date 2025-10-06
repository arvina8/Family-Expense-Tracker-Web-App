import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, Input, Select } from '../components/UI/Components';
import { Plus, Users, AlertCircle, Calculator, Calendar, DollarSign, Tag } from 'lucide-react';

const AddExpense = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [splitType, setSplitType] = useState('even');
  const [customSplit, setCustomSplit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { currentGroup } = useAuth();
  const toast = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentGroup) return;
    fetchData();
  }, [currentGroup]);

  const fetchData = async () => {
    try {
      const [categoriesRes, groupRes] = await Promise.all([
        client.get('/categories', { params: { groupId: currentGroup } }),
        client.get(`/groups/${currentGroup}`)
      ]);
      
      setCategories(categoriesRes.data);
      const members = groupRes.data.members?.map(m => m.user) || [];
      setUsers(members);
      setCustomSplit(members.map(user => ({ user: user._id, ratio: 0 })));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.paidBy) {
      newErrors.paidBy = 'Please select who paid';
    }
    
    if (splitType === 'custom') {
      const totalRatio = getTotalRatio();
      if (Math.abs(totalRatio - 1) > 0.001) {
        newErrors.split = 'Custom split ratios must sum to 1.0 (100%)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    
    let expenseData = { 
      ...formData,
      amount: parseFloat(formData.amount), 
      group: currentGroup,
    };

    // Add split information based on split type
    if (splitType === 'custom') {
      expenseData.split = customSplit.filter(split => split.ratio > 0);
    } else {
      // For even split among all users
      expenseData.split = users.map(user => ({ 
        user: user._id, 
        ratio: 1 / users.length 
      }));
    }

    try {
      await client.post('/expenses', expenseData);
      toast.success('💰 Expense added successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        paidBy: '',
        notes: '',
      });
      setSplitType('even');
      setCustomSplit(users.map(user => ({ user: user._id, ratio: 0 })));
      
      if (onExpenseAdded) onExpenseAdded();
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (users.length === 0 || categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${theme.colors.text} mb-2 flex items-center justify-center`}>
            <Plus className="w-8 h-8 mr-3 text-blue-600" />
            Add New Expense
          </h1>
          <p className={theme.colors.textSecondary}>Track and split expenses with your group members</p>
        </div>

        <Card className="max-w-2xl mx-auto state-error">
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
              Setup Required
            </h3>
            {users.length === 0 && (
              <div className="mb-4">
                <p className="text-red-700 dark:text-red-300 mb-3">
                  No group members found. You need to add group members before creating expenses.
                </p>
                <Button variant="danger" onClick={() => window.location.href = '/select-group'}>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Group Members
                </Button>
              </div>
            )}
            {categories.length === 0 && (
              <div>
                <p className="text-red-700 dark:text-red-300 mb-3">
                  No categories found. You should add some expense categories first.
                </p>
                <Button variant="warning" onClick={() => window.location.href = `/app/${currentGroup}/categories`}>
                  <Tag className="w-4 h-4 mr-2" />
                  Add Categories
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${theme.colors.text} mb-2 flex items-center justify-center`}>
          <Plus className="w-8 h-8 mr-3 text-blue-600" />
          Add New Expense
        </h1>
        <p className={theme.colors.textSecondary}>Track and split expenses with your group members</p>
      </div>

      <Card className="max-w-2xl mx-auto" glass>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Amount (₹)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              error={errors.amount}
              icon={DollarSign}
              className="text-lg font-medium"
            />

            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={errors.date}
              icon={Calendar}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={errors.category}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Select>

            <Select
              label="Paid By"
              value={formData.paidBy}
              onChange={(e) => handleInputChange('paidBy', e.target.value)}
              error={errors.paidBy}
            >
              <option value="">Select who paid</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </Select>
          </div>

          <Input
            label="Notes (optional)"
            type="text"
            placeholder="What was this expense for?"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          {/* Split Configuration */}
          <Card className={`${theme.colors.cardBg} border-2 ${theme.colors.border}`}>
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className={`text-lg font-medium ${theme.colors.text}`}>Split Configuration</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`
                  flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${splitType === 'even' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : `${theme.colors.border} ${theme.colors.hoverBg}`
                  }
                `}>
                  <input 
                    type="radio" 
                    value="even" 
                    checked={splitType === 'even'} 
                    onChange={(e) => setSplitType(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className={`font-medium ${theme.colors.text}`}>Even Split</div>
                    <div className={`text-sm ${theme.colors.textMuted}`}>Split equally among all members</div>
                  </div>
                </label>
                
                <label className={`
                  flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                  ${splitType === 'custom' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:border-purple-400' 
                    : `${theme.colors.border} ${theme.colors.hoverBg}`
                  }
                `}>
                  <input 
                    type="radio" 
                    value="custom" 
                    checked={splitType === 'custom'} 
                    onChange={(e) => setSplitType(e.target.value)}
                    className="mr-3 text-purple-600"
                  />
                  <div>
                    <div className={`font-medium ${theme.colors.text}`}>Custom Split</div>
                    <div className={`text-sm ${theme.colors.textMuted}`}>Set custom ratios for each member</div>
                  </div>
                </label>
              </div>

              {splitType === 'custom' && (
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 border-purple-200 dark:border-purple-700">
                  <h4 className="font-medium mb-3 text-purple-800 dark:text-purple-200">Custom Split Ratios</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
                    Enter decimal values that sum to 1.0 (e.g., 0.6 for 60%, 0.4 for 40%)
                  </p>
                  <div className="space-y-3">
                    {users.map(user => (
                      <div key={user._id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                        <span className={`font-medium ${theme.colors.text}`}>{user.name}</span>
                        <div className="flex items-center space-x-3">
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            max="1"
                            placeholder="0.00"
                            className={`
                              w-24 px-3 py-2 rounded-lg text-center
                              ${theme.colors.inputBg} ${theme.colors.border} border
                              focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                            `}
                            value={customSplit.find(split => split.user === user._id)?.ratio || ''}
                            onChange={(e) => handleCustomSplitChange(user._id, e.target.value)}
                          />
                          <span className={`text-sm ${theme.colors.textMuted} min-w-[60px]`}>
                            ({((customSplit.find(split => split.user === user._id)?.ratio || 0) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-purple-800 dark:text-purple-200">Total:</span>
                        <span className={`font-bold ${
                          Math.abs(getTotalRatio() - 1) <= 0.001 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {getTotalRatio().toFixed(3)} ({(getTotalRatio() * 100).toFixed(1)}%)
                        </span>
                      </div>
                      {errors.split && (
                        <p className="text-sm text-red-600 mt-1">⚠️ {errors.split}</p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          <Button 
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Adding Expense...' : 'Add Expense'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
