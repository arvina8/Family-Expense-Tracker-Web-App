import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge } from './UI/Components';
import { Tag, Plus, Edit, Trash2, Calendar, AlertCircle } from 'lucide-react';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { currentGroup } = useAuth();

  useEffect(() => {
    if (!currentGroup) return;
    fetchCategories();
  }, [currentGroup]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
  const res = await client.get('/categories', { params: { groupId: currentGroup } });
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
  await client.post('/categories', { ...newCategory, group: currentGroup });
      setNewCategory({ name: '' });
      setShowAddForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/categories/${editingCategory._id}`, { name: editingCategory.name });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect existing expenses.')) {
      try {
  await client.delete(`/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const defaultCategories = [
    'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
    'Bills & Utilities', 'Health & Fitness', 'Travel', 'Education',
    'Home & Garden', 'Gifts & Donations'
  ];

  const addDefaultCategories = async () => {
    try {
      for (const categoryName of defaultCategories) {
        await client.post('/categories', { name: categoryName, group: currentGroup });
      }
      fetchCategories();
    } catch (error) {
      console.error('Error adding default categories:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
        <div className="text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {categories.length === 0 && (
            <Button
              onClick={addDefaultCategories}
              variant="primary"
              icon={Tag}
            >
              Add Default Categories
            </Button>
          )}
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "secondary" : "success"}
            icon={Plus}
          >
            {showAddForm ? 'Cancel' : 'Add Category'}
          </Button>
        </div>
      </Card>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <AlertCircle className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
          <div className="text-yellow-800 mb-2 font-bold text-lg">
            No categories found!
          </div>
          <div className="text-yellow-700 text-sm max-w-md mx-auto">
            Categories help organize your expenses. Add some default categories or create your own custom ones.
          </div>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Category
          </h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter category name (e.g., Food & Dining, Transportation)"
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="success">
                Create Category
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory({ name: '' });
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Edit Form */}
      {editingCategory && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Category
          </h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">
                Update Category
              </Button>
              <Button
                type="button"
                onClick={() => setEditingCategory(null)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-600" />
            Expense Categories ({categories.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Card key={category._id} className="bg-gradient-to-br from-gray-50 to-white border-gray-200" hover={false} padding="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      {category.name}
                    </h4>
                  </div>
                  <Badge color="blue" size="sm">Active</Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {new Date(category.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(category)}
                    variant="outline"
                    size="sm"
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(category._id)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CategoryManager;
