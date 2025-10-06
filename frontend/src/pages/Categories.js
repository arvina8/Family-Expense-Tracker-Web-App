import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, Input, Modal } from '../components/UI/Components';
import { Tag, Plus, Edit, Trash2, Package, TrendingUp, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  const { currentGroup } = useAuth();
  const toast = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    if (!currentGroup) return;
    fetchCategories();
  }, [currentGroup]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await client.get('/categories', { 
        params: { groupId: currentGroup } 
      });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Category name must be less than 50 characters';
    }

    // Check if name already exists (excluding current category when editing)
    const nameExists = categories.some(cat => 
      cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      cat._id !== editingCategory?._id
    );
    
    if (nameExists) {
      newErrors.name = 'A category with this name already exists';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
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

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        group: currentGroup
      };

      if (editingCategory) {
        await client.put(`/categories/${editingCategory._id}`, categoryData);
        toast.success('✨ Category updated successfully!');
      } else {
        await client.post('/categories', categoryData);
        toast.success('🎉 Category created successfully!');
      }
      
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.response?.status === 400) {
        toast.error('Category name already exists or invalid data');
      } else {
        toast.error('Failed to save category. Please try again.');
      }
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      await client.delete(`/categories/${categoryId}`);
      toast.success('🗑️ Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error.response?.status === 400) {
        toast.error('Cannot delete category that has associated expenses');
      } else {
        toast.error('Failed to delete category. Please try again.');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${theme.colors.text} mb-2 flex items-center justify-center`}>
            <Tag className="w-8 h-8 mr-3 text-purple-600" />
            Categories
          </h1>
          <p className={theme.colors.textSecondary}>Organize your expenses with categories</p>
        </div>
        
        <Card className="max-w-4xl mx-auto p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
            <span className={theme.colors.text}>Loading categories...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className={`text-3xl font-bold ${theme.colors.text} mb-2 flex items-center justify-center`}>
          <Tag className="w-8 h-8 mr-3 text-purple-600" />
          Categories
        </h1>
        <p className={theme.colors.textSecondary}>Organize your expenses with categories</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-6" glass>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-semibold ${theme.colors.text} mb-1`}>
                Category Management
              </h2>
              <p className={theme.colors.textSecondary}>
                Create and manage expense categories for better organization
              </p>
            </div>
            <Button 
              onClick={handleAddNew}
              variant="primary"
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </Card>

        {categories.length === 0 ? (
          <Card className="text-center py-12" state="empty">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start organizing your expenses by creating your first category. 
              Categories help you track spending patterns and generate better reports.
            </p>
            <Button onClick={handleAddNew} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Category
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category._id} 
                className={`
                  group transition-all duration-300 hover:scale-105
                  ${theme.colors.cardBg} border-2 ${theme.colors.border}
                  hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme.colors.text} group-hover:text-purple-600 transition-colors`}>
                        {category.name}
                      </h3>
                      <p className={`text-xs ${theme.colors.textMuted}`}>
                        Category
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {category.description && (
                  <p className={`text-sm ${theme.colors.textSecondary} mb-4 line-clamp-2`}>
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span>Used in expenses</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {category._id.slice(-6)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${theme.colors.text}`}>
                {editingCategory ? 'Update Category' : 'Create New Category'}
              </h3>
              <p className={theme.colors.textSecondary}>
                {editingCategory ? 'Modify the category details' : 'Add a new expense category'}
              </p>
            </div>
          </div>

          <Input
            label="Category Name"
            type="text"
            placeholder="e.g., Food & Dining, Transportation, Entertainment"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            maxLength={50}
            required
          />

          <div>
            <label className={`block text-sm font-medium ${theme.colors.text} mb-2`}>
              Description (Optional)
            </label>
            <textarea
              placeholder="Brief description of what this category includes..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none
                ${errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : `${theme.colors.border} focus:border-purple-500 focus:ring-purple-500`
                }
                ${theme.colors.inputBg} ${theme.colors.text}
                focus:ring-2 focus:ring-opacity-50
              `}
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
              <span className={`text-xs ${theme.colors.textMuted} ml-auto`}>
                {formData.description.length}/200
              </span>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCloseModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              className="flex-1"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
