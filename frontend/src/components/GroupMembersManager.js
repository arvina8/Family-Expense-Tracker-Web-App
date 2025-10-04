import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge } from './UI/Components';
import { Users, UserPlus, Edit, Trash2, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import AddMemberModal from './AddMemberModal';
import PendingInvitesList from './PendingInvitesList';

const GroupMembersManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ email: '', role: 'member' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitesRefreshKey, setInvitesRefreshKey] = useState(0);
  const { currentGroup } = useAuth();

  useEffect(() => {
    if (!currentGroup) return;
    fetchUsers();
  }, [currentGroup]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await client.get('/groups/' + currentGroup);
      setUsers(res.data.members.map(m => ({ ...m.user, role: m.role })));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await client.post(`/groups/${currentGroup}/members`, newUser);
      setNewUser({ email: '', role: 'member' });
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating group member. Please check if email already exists.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setEditingUser(null); // reserved for future
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating group member.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this group member? This will affect all related expenses.')) {
      try {
        await client.delete(`/groups/${currentGroup}/members`, { data: { userId: id } });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting group member.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mr-4"></div>
        <div className="text-gray-600">Loading group members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
          <Users className="w-8 h-8 mr-3 text-blue-600" />
          Group Member Management
        </h1>
        <p className="text-gray-600">Manage your group members who will share expenses</p>
      </div>

      {/* Actions */}
      <Card>
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex gap-3">
            <Button
              onClick={() => setInviteModalOpen(true)}
              variant="success"
              icon={UserPlus}
            >
              Invite / Add Member
            </Button>
          </div>
        </div>
      </Card>
      <PendingInvitesList refreshKey={invitesRefreshKey} />

      {/* Empty state */}
      {users.length === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <AlertCircle className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
          <div className="text-yellow-800 mb-2 font-bold text-lg">No group members found!</div>
          <div className="text-yellow-700 text-sm max-w-md mx-auto">
            You need to add group members before you can create expenses. Use the Invite button to add members.
          </div>
        </Card>
      )}

      {/* Add member form */}
      {showAddForm && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New Group Member
          </h3>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Email *</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="success">Add Member</Button>
              <Button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewUser({ email: '', role: 'member' });
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Edit member placeholder */}
      {editingUser && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Member
          </h3>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-gray-700">Role: {editingUser.role}</div>
            </div>
            <div className="flex space-x-3">
              <Button type="submit" variant="primary">Save Changes</Button>
              <Button type="button" onClick={() => setEditingUser(null)} variant="secondary">Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Members list */}
      {users.length > 0 && (
        <Card>
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Group Members ({users.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user._id} className="p-4 rounded-lg border bg-white hover:shadow transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 truncate">{user.name || user.email}</h4>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Badge color={user.role === 'admin' ? 'blue' : 'gray'}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined
                  </div>
                  <div className="space-x-1">
                    <Button size="xs" variant="secondary" onClick={() => handleEdit(user)} icon={Edit}>
                      Edit
                    </Button>
                    <Button size="xs" variant="danger" onClick={() => handleDelete(user._id)} icon={Trash2}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Completion card */}
      {users.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h4 className="font-semibold text-green-800 text-lg">Group Setup Complete!</h4>
              <p className="text-sm text-green-700">
                You have {users.length} group member{users.length !== 1 ? 's' : ''} set up. You can now add expenses and split them among members.
              </p>
            </div>
          </div>
        </Card>
      )}
      <AddMemberModal open={inviteModalOpen} onClose={()=>{ setInviteModalOpen(false); }} onInvited={()=>{ setInvitesRefreshKey(k=>k+1); fetchUsers(); }} />
    </div>
  );
};

export default GroupMembersManager;
