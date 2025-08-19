import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Badge } from './UI/Components';
import { Users, UserPlus, Edit, Trash2, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const FamilyManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: 'familypass123' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', newUser);
      setNewUser({ name: '', email: '', password: 'familypass123' });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating family member. Please check if email already exists.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating family member.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this family member? This will affect all related expenses.')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting family member.');
      }
    }
  };

  const initializeDefaultUsers = async () => {
    try {
      const res = await axios.post('/api/users/initialize');
      alert(res.data.message);
      fetchUsers();
    } catch (error) {
      console.error('Error initializing users:', error);
      alert(error.response?.data?.error || 'Error initializing default family members');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
        <div className="text-gray-600">Loading family members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Users className="w-8 h-8 mr-3 text-blue-600" />
          Family Member Management
        </h1>
        <p className="text-gray-600">Manage your family members who will share expenses</p>
      </div>

      {/* Action Buttons */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {users.length === 0 && (
            <Button
              onClick={initializeDefaultUsers}
              variant="primary"
              icon={Users}
            >
              Add Default Family
            </Button>
          )}
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant={showAddForm ? "secondary" : "success"}
            icon={UserPlus}
          >
            {showAddForm ? 'Cancel' : 'Add Member'}
          </Button>
        </div>
      </Card>

      {/* Empty State */}
      {users.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <AlertCircle className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
          <div className="text-yellow-800 mb-2 font-bold text-lg">
            No family members found!
          </div>
          <div className="text-yellow-700 text-sm max-w-md mx-auto">
            You need to add family members before you can create expenses. 
            Use "Add Default Family" for quick setup or "Add Member" to create custom members.
          </div>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New Family Member
          </h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Enter password"
              />
              <p className="text-xs text-gray-500 mt-1">Default password is set for new members</p>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="success">
                Add Member
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUser({ name: '', email: '', password: 'familypass123' });
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
      {editingUser && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Family Member
          </h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">
                Update Member
              </Button>
              <Button
                type="button"
                onClick={() => setEditingUser(null)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Family Members List */}
      {users.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Family Members ({users.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <Card key={user._id} className="bg-gradient-to-br from-gray-50 to-white border-gray-200" hover={false} padding="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">{user.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {user.email}
                    </div>
                  </div>
                  <Badge color="blue" size="sm">Member</Badge>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(user)}
                    variant="outline"
                    size="sm"
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(user._id)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Success State */}
      {users.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h4 className="font-semibold text-green-800 text-lg">👨‍👩‍👧‍👦 Family Setup Complete!</h4>
              <p className="text-sm text-green-700">
                You have {users.length} family member{users.length !== 1 ? 's' : ''} set up. 
                You can now add expenses and split them among family members.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FamilyManager;
