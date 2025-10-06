import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ChevronDown, Users, Settings, LogOut, Trash2, Plus } from 'lucide-react';

const GroupSwitcher = () => {
  const { user, currentGroup, setCurrentGroup } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchGroups();
  }, [user]);

  // Close dropdown when clicking outside - moved before early return
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.group-switcher')) {
        setIsOpen(false);
        setShowManageMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await client.get('/groups/mine');
      const list = res.data.map(m => ({ ...m.group, role: m.role }));
      setGroups(list);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const handleGroupChange = (groupId) => {
    setCurrentGroup(groupId);
    setIsOpen(false);
    window.location.href = `/app/${groupId}/dashboard`;
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    
    try {
      setLoading(true);
      await client.post(`/groups/${groupId}/leave`);
      toast.success('Left group successfully');
      await fetchGroups();
      
      // If leaving current group, redirect to group selection
      if (groupId === currentGroup) {
        setCurrentGroup(null);
        window.location.href = '/select-group';
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      toast.error(error.response?.data?.message || 'Failed to leave group');
    } finally {
      setLoading(false);
      setShowManageMenu(null);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      await client.delete(`/groups/${groupId}`);
      toast.success('Group deleted successfully');
      await fetchGroups();
      
      // If deleting current group, redirect to group selection
      if (groupId === currentGroup) {
        setCurrentGroup(null);
        window.location.href = '/select-group';
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error(error.response?.data?.message || 'Failed to delete group');
    } finally {
      setLoading(false);
      setShowManageMenu(null);
    }
  };

  if (!user) return null;

  const currentGroupData = groups.find(g => g._id === currentGroup);

  return (
    <div className="relative group-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
          bg-white bg-opacity-20 hover:bg-opacity-30 text-white backdrop-blur-sm
          border border-white border-opacity-20 hover:border-opacity-40
          min-w-[160px] justify-between
        `}
      >
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4" />
          <span className="truncate">
            {currentGroupData ? currentGroupData.name : 'Select Group'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`
          absolute top-full mt-2 right-0 w-72 z-50
          ${theme.colors.cardBg} backdrop-blur-xl border-2 ${theme.colors.border}
          rounded-2xl shadow-2xl py-2 max-h-96 overflow-y-auto
        `}>
          {/* Header */}
          <div className={`px-4 py-2 border-b ${theme.colors.border}`}>
            <h3 className={`font-semibold ${theme.colors.text}`}>Your Groups</h3>
          </div>
          
          {/* Groups List */}
          <div className="py-2">
            {groups.map((group) => (
              <div key={group._id} className="relative">
                <div className={`flex items-center justify-between px-4 py-3 ${theme.colors.hoverBg} transition-colors`}>
                  <button
                    onClick={() => handleGroupChange(group._id)}
                    className={`flex-1 flex items-center space-x-3 text-left ${
                      group._id === currentGroup ? 'text-indigo-600 dark:text-indigo-400' : theme.colors.text
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      group._id === currentGroup 
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{group.name}</div>
                      <div className={`text-xs ${theme.colors.textMuted}`}>
                        {group.role === 'admin' ? 'Admin' : 'Member'}
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowManageMenu(showManageMenu === group._id ? null : group._id);
                    }}
                    className={`p-2 ${theme.colors.hoverBg} rounded-lg transition-colors`}
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                {/* Group Management Menu */}
                {showManageMenu === group._id && (
                  <div className={`absolute right-4 top-full mt-1 w-48 z-50 ${theme.colors.cardBg} border-2 ${theme.colors.border} rounded-xl shadow-lg py-1`}>
                    <a
                      href={`/app/${group._id}/members`}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm ${theme.colors.text} ${theme.colors.hoverBg} transition-colors`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Manage Members</span>
                    </a>
                    
                    {group.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteGroup(group._id)}
                        disabled={loading}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Group</span>
                      </button>
                    )}
                    
                    {group.role !== 'admin' && (
                      <button
                        onClick={() => handleLeaveGroup(group._id)}
                        disabled={loading}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Leave Group</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Add Group Button */}
          <div className={`border-t ${theme.colors.border} pt-2`}>
            <a
              href="/select-group"
              className={`flex items-center space-x-2 px-4 py-3 text-sm ${theme.colors.text} ${theme.colors.hoverBg} transition-colors`}
            >
              <Plus className="w-4 h-4" />
              <span>Join or Create Group</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupSwitcher;
